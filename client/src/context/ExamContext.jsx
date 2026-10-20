import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionAPI, examAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ExamContext = createContext(null);

export const ExamProvider = ({ children }) => {
  const { studentUser } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Selected option per question: { [questionId]: 'A' | 'B' | 'C' | 'D' | null }
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem('gusac_selected_answers');
    return saved ? JSON.parse(saved) : {};
  });

  // Marked for review per question: { [questionId]: boolean }
  const [reviewStatus, setReviewStatus] = useState(() => {
    const saved = localStorage.getItem('gusac_review_status');
    return saved ? JSON.parse(saved) : {};
  });

  // Timer state
  const [remainingSeconds, setRemainingSeconds] = useState(40 * 60);
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isExamLocked, setIsExamLocked] = useState(false);
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);

  const timerRef = useRef(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('gusac_selected_answers', JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  useEffect(() => {
    localStorage.setItem('gusac_review_status', JSON.stringify(reviewStatus));
  }, [reviewStatus]);

  // Load questions from server
  const loadQuestions = async () => {
    if (!studentUser) return;
    try {
      setLoadingQuestions(true);
      const res = await questionAPI.getQuestions();
      const qList = res.data.questions || [];
      setQuestions(qList);
    } catch (error) {
      console.error('Failed to load questions:', error);
    } finally {
      setLoadingQuestions(false);
    }
  };

  // Sync exam status with server
  const syncExamSession = async () => {
    if (!studentUser) return;
    try {
      const res = await examAPI.getExamStatus();
      const data = res.data;

      if (data.status === 'completed') {
        setIsExamLocked(true);
        setIsTimerActive(false);
        navigate('/result');
        return;
      }

      setRemainingSeconds(Math.max(0, data.remainingSeconds));
      if (data.duration) setDurationMinutes(data.duration);
      setIsTimerActive(true);

      // Hydrate answers from server
      if (data.answers && data.answers.length > 0) {
        const answersMap = { ...selectedAnswers };
        const reviewsMap = { ...reviewStatus };

        data.answers.forEach((ans) => {
          if (ans.selectedOption) {
            answersMap[ans.questionId] = ans.selectedOption;
          }
          if (ans.isMarkedForReview !== undefined) {
            reviewsMap[ans.questionId] = ans.isMarkedForReview;
          }
        });

        setSelectedAnswers(answersMap);
        setReviewStatus(reviewsMap);
      }

      if (questions.length === 0) {
        await loadQuestions();
      }
    } catch (error) {
      console.warn('Could not sync exam status (exam not started yet)');
    }
  };

  // Start exam
  const startExam = async () => {
    try {
      const res = await examAPI.startExam();
      const data = res.data;

      if (data.alreadyCompleted) {
        setIsExamLocked(true);
        setIsTimerActive(false);
        navigate('/result');
        return;
      }

      setRemainingSeconds(Math.max(0, data.remainingSeconds));
      if (data.duration) setDurationMinutes(data.duration);
      setIsTimerActive(true);
      setIsExamLocked(false);

      if (data.answers && data.answers.length > 0) {
        const answersMap = {};
        const reviewsMap = {};
        data.answers.forEach((ans) => {
          if (ans.selectedOption) answersMap[ans.questionId] = ans.selectedOption;
          if (ans.isMarkedForReview) reviewsMap[ans.questionId] = ans.isMarkedForReview;
        });
        setSelectedAnswers(answersMap);
        setReviewStatus(reviewsMap);
      }

      await loadQuestions();
      navigate('/portal');
    } catch (error) {
      console.error('Failed to start exam:', error);
      throw error;
    }
  };

  // Timer interval countdown
  useEffect(() => {
    if (!isTimerActive || isExamLocked) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerActive, isExamLocked]);

  // Periodic server timer resync every 30 seconds
  useEffect(() => {
    if (!isTimerActive || isExamLocked) return;

    const resyncInterval = setInterval(async () => {
      try {
        const res = await examAPI.getExamStatus();
        if (res.data.status === 'completed') {
          handleAutoSubmit();
        } else if (res.data.remainingSeconds !== undefined) {
          setRemainingSeconds(res.data.remainingSeconds);
        }
      } catch (e) {
        // ignore sync error
      }
    }, 30000);

    return () => clearInterval(resyncInterval);
  }, [isTimerActive, isExamLocked]);

  // Current active question
  const currentQuestion = questions[currentIdx] || null;

  // Select Option with instant local update and background server auto-save
  const selectOption = async (questionId, optionKey) => {
    if (isExamLocked) return;

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));

    try {
      await examAPI.saveAnswer({
        questionId,
        selectedOption: optionKey,
        isMarkedForReview: !!reviewStatus[questionId],
      });
    } catch (err) {
      console.error('Background save answer error:', err);
    }
  };

  // Toggle Marked for Review
  const toggleReview = async (questionId) => {
    if (isExamLocked) return;
    const newStatus = !reviewStatus[questionId];

    setReviewStatus((prev) => ({
      ...prev,
      [questionId]: newStatus,
    }));

    try {
      await examAPI.saveAnswer({
        questionId,
        selectedOption: selectedAnswers[questionId] || null,
        isMarkedForReview: newStatus,
      });
    } catch (err) {
      console.error('Background toggle review error:', err);
    }
  };

  // Clear Response for current question
  const clearResponse = async (questionId) => {
    if (isExamLocked) return;

    setSelectedAnswers((prev) => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });

    try {
      await examAPI.saveAnswer({
        questionId,
        selectedOption: null,
        isMarkedForReview: !!reviewStatus[questionId],
      });
    } catch (err) {
      console.error('Background clear answer error:', err);
    }
  };

  // Auto-submit when timer reaches 0
  const handleAutoSubmit = async () => {
    setIsTimerActive(false);
    setIsExamLocked(true);
    try {
      await examAPI.submitExam();
    } catch (e) {
      console.error('Auto submit error:', e);
    }
    // Clean up local draft caches
    localStorage.removeItem('gusac_selected_answers');
    localStorage.removeItem('gusac_review_status');
    navigate('/result');
  };

  // Final manual submit
  const finalizeExam = async () => {
    try {
      setIsFinalSubmitting(true);
      const res = await examAPI.submitExam();
      setIsTimerActive(false);
      setIsExamLocked(true);
      localStorage.removeItem('gusac_selected_answers');
      localStorage.removeItem('gusac_review_status');
      navigate('/result');
      return res.data;
    } catch (error) {
      console.error('Finalize exam failed:', error);
      throw error;
    } finally {
      setIsFinalSubmitting(false);
    }
  };

  return (
    <ExamContext.Provider
      value={{
        questions,
        currentIdx,
        setCurrentIdx,
        currentQuestion,
        loadingQuestions,
        loadQuestions,
        selectedAnswers,
        reviewStatus,
        selectOption,
        toggleReview,
        clearResponse,
        remainingSeconds,
        durationMinutes,
        isTimerActive,
        isExamLocked,
        isFinalSubmitting,
        startExam,
        syncExamSession,
        finalizeExam,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => useContext(ExamContext);
