import React, { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, Cpu, Terminal, Play, Loader2 } from 'lucide-react';
import { useExam } from '../context/ExamContext';

const TestResults = () => {
  const { testResults, currentQuestion, runCode, isRunningCode, isExamLocked } = useExam();
  const [activeTab, setActiveTab] = useState('cases'); // 'cases' | 'custom'
  const [customInput, setCustomInput] = useState('');
  const [selectedCaseIdx, setSelectedCaseIdx] = useState(0);

  if (!currentQuestion) return null;

  const results = testResults?.results || [];
  const selectedCase = results[selectedCaseIdx] || null;

  return (
    <div className="flex flex-col h-full bg-[#111827] border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-200">
      {/* Console Tab Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#0d131f] border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-400" />
          <button
            onClick={() => setActiveTab('cases')}
            className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
              activeTab === 'cases'
                ? 'bg-slate-800 text-indigo-300 border border-indigo-700/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Test Cases {results.length > 0 && `(${testResults?.passedTests}/${testResults?.totalTests} Passed)`}
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`text-xs font-semibold px-2.5 py-1 rounded transition-colors ${
              activeTab === 'custom'
                ? 'bg-slate-800 text-indigo-300 border border-indigo-700/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Custom Test
          </button>
        </div>

        {/* Global execution summary */}
        {testResults && results.length > 0 && activeTab === 'cases' && (
          <div className="flex items-center gap-3 text-xs">
            {testResults.allPassed ? (
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                All Public Tests Passed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-rose-400 font-semibold">
                <XCircle className="w-4 h-4 text-rose-400" />
                Some Tests Failed
              </span>
            )}
          </div>
        )}
      </div>

      {/* Console Body */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab === 'cases' ? (
          <div>
            {!testResults ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
                <Terminal className="w-8 h-8 mb-2 opacity-50 text-indigo-400" />
                <p className="text-xs font-medium">Click "Run Code" to execute public sample test cases.</p>
                <p className="text-[11px] text-slate-600 mt-0.5">Your code will be evaluated safely on Judge0.</p>
              </div>
            ) : results.length === 0 ? (
              <div className="text-xs text-rose-400 p-3 bg-rose-950/40 rounded border border-rose-800/40">
                No test results returned. Check compilation errors below.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {/* Case Selector Tabs */}
                <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800">
                  {results.map((r, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedCaseIdx(i)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                        selectedCaseIdx === i
                          ? 'bg-slate-800 border-indigo-500 text-white shadow'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span>Test Case {r.testCaseNumber}</span>
                      <span className={`text-[10px] ml-0.5 px-1 py-0.2 rounded ${
                        r.passed ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                      }`}>
                        {r.status}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Details for selected test case */}
                {selectedCase && (
                  <div className="space-y-2.5 text-xs">
                    {/* Execution metrics */}
                    <div className="flex items-center gap-4 text-[11px] text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded border border-slate-800">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        Time: {selectedCase.executionTime !== undefined ? `${selectedCase.executionTime}s` : '0s'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-indigo-400" />
                        Memory: {selectedCase.memory ? `${selectedCase.memory} KB` : 'N/A'}
                      </span>
                    </div>

                    {/* Input */}
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Input
                      </div>
                      <pre className="bg-[#0a0f18] p-2.5 rounded-md font-mono border border-slate-800/80 overflow-x-auto text-slate-200 whitespace-pre-wrap">
                        {selectedCase.input || '(empty)'}
                      </pre>
                    </div>

                    {/* Expected Output */}
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Expected Output
                      </div>
                      <pre className="bg-[#0a0f18] p-2.5 rounded-md font-mono border border-slate-800/80 overflow-x-auto text-emerald-300 whitespace-pre-wrap">
                        {selectedCase.expectedOutput}
                      </pre>
                    </div>

                    {/* Actual Output */}
                    <div>
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Actual Output (stdout)
                      </div>
                      <pre
                        className={`p-2.5 rounded-md font-mono border overflow-x-auto whitespace-pre-wrap ${
                          selectedCase.passed
                            ? 'bg-[#0a0f18] text-emerald-300 border-emerald-900/40'
                            : 'bg-rose-950/20 text-rose-300 border-rose-900/50'
                        }`}
                      >
                        {selectedCase.actualOutput ? selectedCase.actualOutput : '(no output)'}
                      </pre>
                    </div>

                    {/* Errors if any */}
                    {(selectedCase.stderr || selectedCase.compileOutput) && (
                      <div>
                        <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-400 mb-1 flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Errors / stderr</span>
                        </div>
                        <pre className="bg-rose-950/40 text-rose-300 p-2.5 rounded-md font-mono border border-rose-800/60 overflow-x-auto whitespace-pre-wrap">
                          {selectedCase.compileOutput || selectedCase.stderr}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* Custom Test Tab */
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1">
                Custom Standard Input (stdin)
              </label>
              <textarea
                rows={3}
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="Type custom input values to feed into your program..."
                className="w-full bg-[#0a0f18] text-slate-200 border border-slate-700 rounded-lg p-2.5 text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={() => runCode(customInput)}
              disabled={isExamLocked || isRunningCode}
              className="flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              {isRunningCode ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing Custom Input...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Execute with Custom Input</span>
                </>
              )}
            </button>

            {testResults?.isCustom && (
              <div className="mt-3 space-y-2 text-xs">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Custom Execution Output
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>Status: <strong className="text-slate-200">{testResults.result.status}</strong></span>
                  <span>Time: <strong>{testResults.result.executionTime}s</strong></span>
                </div>
                <pre className="bg-[#0a0f18] p-2.5 rounded font-mono border border-slate-800 text-slate-200 whitespace-pre-wrap">
                  {testResults.result.stdout || '(no stdout)'}
                </pre>
                {testResults.result.stderr && (
                  <pre className="bg-rose-950/30 p-2.5 rounded font-mono border border-rose-900/40 text-rose-300 whitespace-pre-wrap">
                    {testResults.result.stderr}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestResults;
