import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { questionAPI, examAPI, submissionAPI } from '../services/api';
import { useAuth } from './AuthContext';

const ExamContext = createContext(null);

export const ExamProvider = ({ children }) => {
  const { studentUser } = useAuth();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Selected option per MCQ question: { [questionId]: 'A' | 'B' | 'C' | 'D' | null }
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    const saved = localStorage.getItem('gusac_selected_answers');
    return saved ? JSON.parse(saved) : {};
  });

  // Code editor draft per coding question: { [questionId]: string }
  const [codes, setCodes] = useState(() => {
    const saved = localStorage.getItem('gusac_student_codes');
    return saved ? JSON.parse(saved) : {};
  });

  // Current selected programming language (Java is primary)
  const [currentLang, setCurrentLang] = useState('java');

  // Test execution results for public/sample test cases: { [questionId]: resultObject }
  const [testResults, setTestResults] = useState({});
  const [isRunningCode, setIsRunningCode] = useState(false);

  // Submitted answers for coding questions: { [questionId]: submissionInfo }
  const [submittedAnswers, setSubmittedAnswers] = useState(() => {
    const saved = localStorage.getItem('gusac_submitted_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);

  // Marked for review per question: { [questionId]: boolean }
  const [reviewStatus, setReviewStatus] = useState(() => {
    const saved = localStorage.getItem('gusac_review_status');
    return saved ? JSON.parse(saved) : {};
  });

  // Timer state (40 minutes = 2400 seconds)
  const [remainingSeconds, setRemainingSeconds] = useState(40 * 60);
  const [durationMinutes, setDurationMinutes] = useState(40);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [isExamLocked, setIsExamLocked] = useState(false);
  const [isFinalSubmitting, setIsFinalSubmitting] = useState(false);

  const timerRef = useRef(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('gusac_selected_answers', JSON.stringify(selectedAnswers));
  }, [selectedAnswers]);

  useEffect(() => {
    localStorage.setItem('gusac_student_codes', JSON.stringify(codes));
  }, [codes]);

  useEffect(() => {
    localStorage.setItem('gusac_submitted_answers', JSON.stringify(submittedAnswers));
  }, [submittedAnswers]);

  useEffect(() => {
    localStorage.setItem('gusac_review_status', JSON.stringify(reviewStatus));
  }, [reviewStatus]);

  // Current active question
  const currentQuestion = questions[currentIdx] || null;

  // Code getter for current question
  const currentCode =
    currentQuestion && codes[currentQuestion._id] !== undefined
      ? codes[currentQuestion._id]
      : currentQuestion?.starterCode?.java || currentQuestion?.starterCode?.python || '';

  // Update code for current question
  const updateCurrentCode = (newCode) => {
    if (isExamLocked || !currentQuestion) return;
    setCodes((prev) => ({
      ...prev,
      [currentQuestion._id]: newCode,
    }));
  };

  // Reset code to default template
  const resetCurrentCode = () => {
    if (isExamLocked || !currentQuestion) return;
    const defaultCode = currentQuestion.starterCode?.java || currentQuestion.starterCode?.[currentLang] || '';
    setCodes((prev) => ({
      ...prev,
      [currentQuestion._id]: defaultCode,
    }));
  };

  const changeLanguage = (lang) => {
    setCurrentLang(lang);
  };

  // Load questions from server
  const loadQuestions = async () => {
    if (!studentUser) return;
    try {
      setLoadingQuestions(true);
      const res = await questionAPI.getQuestions();
      const qList = res.data.questions || [];
      setQuestions(qList);

      // Initialize default starter code for coding questions
      setCodes((prev) => {
        const nextCodes = { ...prev };
        qList.forEach((q) => {
          if (q.section === 'B' || q.type === 'coding') {
            if (nextCodes[q._id] === undefined) {
              nextCodes[q._id] = q.starterCode?.java || '';
            }
          }
        });
        return nextCodes;
      });
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
        const codesMap = { ...codes };
        const submittedMap = { ...submittedAnswers };

        data.answers.forEach((ans) => {
          if (ans.selectedOption !== undefined && ans.selectedOption !== null) {
            answersMap[ans.questionId] = ans.selectedOption;
          }
          if (ans.code) {
            codesMap[ans.questionId] = ans.code;
          }
          if (ans.isMarkedForReview !== undefined) {
            reviewsMap[ans.questionId] = ans.isMarkedForReview;
          }
          if (ans.score !== undefined && (ans.code || ans.language)) {
            submittedMap[ans.questionId] = {
              score: ans.score,
              passedTests: ans.passedTests,
              totalTests: ans.totalTests,
              maxMarks: 50,
              status: ans.passedTests === ans.totalTests ? 'Accepted' : 'Partial',
            };
          }
        });

        setSelectedAnswers(answersMap);
        setReviewStatus(reviewsMap);
        setCodes(codesMap);
        setSubmittedAnswers(submittedMap);
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
        const codesMap = {};
        const submittedMap = {};

        data.answers.forEach((ans) => {
          if (ans.selectedOption) answersMap[ans.questionId] = ans.selectedOption;
          if (ans.code) codesMap[ans.questionId] = ans.code;
          if (ans.isMarkedForReview) reviewsMap[ans.questionId] = ans.isMarkedForReview;
          if (ans.score !== undefined && (ans.code || ans.language)) {
            submittedMap[ans.questionId] = {
              score: ans.score,
              passedTests: ans.passedTests,
              totalTests: ans.totalTests,
              maxMarks: 50,
              status: ans.passedTests === ans.totalTests ? 'Accepted' : 'Partial',
            };
          }
        });
        setSelectedAnswers(answersMap);
        setReviewStatus(reviewsMap);
        setCodes(codesMap);
        setSubmittedAnswers(submittedMap);
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
        code: codes[questionId] || null,
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

  // Run Code against public test cases
  const runCode = async (customInput = null) => {
    if (isExamLocked || !currentQuestion) return;
    try {
      setIsRunningCode(true);
      const res = await submissionAPI.runCode({
        questionId: currentQuestion._id,
        code: currentCode,
        language: currentLang || 'java',
        customInput,
      });
      setTestResults((prev) => ({
        ...prev,
        [currentQuestion._id]: res.data,
      }));
      return res.data;
    } catch (error) {
      console.error('Run code error:', error);
      const errMsg = error.response?.data?.message || error.message || 'Execution failed';
      const fallbackResult = {
        success: false,
        allPassed: false,
        totalTests: 0,
        passedTests: 0,
        results: [
          {
            testCaseNumber: 1,
            passed: false,
            status: 'Execution Error',
            stderr: errMsg,
          },
        ],
      };
      setTestResults((prev) => ({
        ...prev,
        [currentQuestion._id]: fallbackResult,
      }));
      throw error;
    } finally {
      setIsRunningCode(false);
    }
  };

  // Submit Answer for Java Coding Question (evaluates hidden test cases)
  const submitAnswer = async () => {
    if (isExamLocked || !currentQuestion) return;
    try {
      setIsSubmittingAnswer(true);
      const res = await submissionAPI.submitAnswer({
        questionId: currentQuestion._id,
        code: currentCode,
        language: currentLang || 'java',
      });
      const data = res.data;
      setSubmittedAnswers((prev) => ({
        ...prev,
        [currentQuestion._id]: data,
      }));
      return data;
    } catch (error) {
      console.error('Submit answer error:', error);
      throw error;
    } finally {
      setIsSubmittingAnswer(false);
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
    localStorage.removeItem('gusac_student_codes');
    localStorage.removeItem('gusac_submitted_answers');
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
      localStorage.removeItem('gusac_student_codes');
      localStorage.removeItem('gusac_submitted_answers');
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
        // Coding specific state & functions
        codes,
        currentCode,
        updateCurrentCode,
        resetCurrentCode,
        currentLang,
        changeLanguage,
        runCode,
        submitAnswer,
        isRunningCode,
        isSubmittingAnswer,
        testResults,
        submittedAnswers,
        // Exam session & timer
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
