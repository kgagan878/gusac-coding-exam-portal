import React from 'react';
import Editor from '@monaco-editor/react';
import { RotateCcw, Code, Play, Send, CheckCircle, Loader2 } from 'lucide-react';
import { useExam } from '../context/ExamContext';

const LANGUAGE_LABELS = {
  python: 'Python 3',
  cpp: 'C++ (GCC)',
  java: 'Java (OpenJDK)',
  javascript: 'JavaScript (Node.js)',
};

const MONACO_LANG_MAP = {
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  javascript: 'javascript',
};

const CodeEditor = () => {
  const {
    currentQuestion,
    currentLang,
    changeLanguage,
    currentCode,
    updateCurrentCode,
    resetCurrentCode,
    runCode,
    submitAnswer,
    isRunningCode,
    isSubmittingAnswer,
    isExamLocked,
    submittedAnswers,
  } = useExam();

  if (!currentQuestion) {
    return (
      <div className="h-full flex items-center justify-center text-slate-500">
        Select a question to begin coding.
      </div>
    );
  }

  const isSubmitted = !!submittedAnswers[currentQuestion._id];
  const submissionInfo = submittedAnswers[currentQuestion._id];

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Editor Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200 gap-2">
        <div className="flex items-center gap-3">
          {/* Language Dropdown */}
          <div className="flex items-center gap-1.5">
            <Code className="w-4 h-4 text-indigo-600" />
            <span className="text-xs text-slate-600 font-medium">Language:</span>
            <select
              value={currentLang}
              onChange={(e) => changeLanguage(e.target.value)}
              disabled={isExamLocked}
              className="bg-white text-slate-800 text-xs font-semibold rounded-md px-2.5 py-1.5 border border-slate-300 hover:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-xs"
            >
              {currentQuestion.supportedLanguages?.map((lang) => (
                <option key={lang} value={lang}>
                  {LANGUAGE_LABELS[lang] || lang}
                </option>
              ))}
            </select>
          </div>

          {/* Submission status tag */}
          {isSubmitted && (
            <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-emerald-50 border border-emerald-300 text-emerald-800 font-medium">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>
                Submitted: {submissionInfo.score}/{submissionInfo.maxMarks || currentQuestion.marks} pts ({submissionInfo.passedTests}/{submissionInfo.totalTests} tests)
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Reset Code */}
          <button
            onClick={resetCurrentCode}
            disabled={isExamLocked || isRunningCode || isSubmittingAnswer}
            title="Reset code to default template"
            className="flex items-center gap-1 text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-300 transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          {/* Run Code Button */}
          <button
            onClick={() => runCode()}
            disabled={isExamLocked || isRunningCode || isSubmittingAnswer}
            className="flex items-center gap-1.5 text-xs font-semibold bg-white hover:bg-slate-100 active:bg-slate-200 text-indigo-700 border border-indigo-300 hover:border-indigo-500 px-3.5 py-1.5 rounded-lg transition-all shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {isRunningCode ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                <span>Running...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                <span>Run Code</span>
              </>
            )}
          </button>

          {/* Submit Answer Button */}
          <button
            onClick={() => submitAnswer()}
            disabled={isExamLocked || isRunningCode || isSubmittingAnswer}
            className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white px-4 py-1.5 rounded-lg transition-all shadow-sm shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
          >
            {isSubmittingAnswer ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>Evaluating...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Answer</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="flex-1 min-h-[340px] relative">
        <Editor
          height="100%"
          language={MONACO_LANG_MAP[currentLang] || 'python'}
          value={currentCode}
          onChange={(value) => updateCurrentCode(value || '')}
          theme="vs"
          options={{
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', Menlo, Monaco, Consolas, monospace",
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            padding: { top: 12, bottom: 12 },
            readOnly: isExamLocked,
            renderLineHighlight: 'all',
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
