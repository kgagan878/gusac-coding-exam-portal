const axios = require('axios');

const LANGUAGE_MAP = {
  python: 71,      // Python (3.8.1)
  cpp: 54,         // C++ (GCC 9.2.0)
  java: 62,        // Java (OpenJDK 13.0.1)
  javascript: 63,  // JavaScript (Node.js 12.14.0)
};

const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };

  const apiKey = process.env.JUDGE0_API_KEY;
  const apiUrl = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';

  if (apiKey && apiKey.trim() !== '') {
    if (apiUrl.includes('rapidapi.com')) {
      headers['x-rapidapi-key'] = apiKey;
      headers['x-rapidapi-host'] = apiUrl.replace(/^https?:\/\//, '').split('/')[0];
    } else {
      headers['X-Auth-Token'] = apiKey;
    }
  }

  return headers;
};

const normalizeOutput = (str) => {
  if (str === null || str === undefined) return '';
  return str
    .toString()
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();
};

/**
 * Execute single piece of code on Judge0 with given stdin
 */
const executeCode = async (sourceCode, language, stdin = '') => {
  const apiUrl = process.env.JUDGE0_API_URL || 'https://ce.judge0.com';
  const languageId = LANGUAGE_MAP[language.toLowerCase()];

  if (!languageId) {
    throw new Error(`Unsupported language: ${language}. Supported languages are: python, cpp, java, javascript`);
  }

  const payload = {
    source_code: sourceCode,
    language_id: languageId,
    stdin: stdin || '',
  };

  const headers = getHeaders();

  try {
    // Attempt wait=true first for instant execution
    const submitUrl = `${apiUrl.replace(/\/$/, '')}/submissions?base64_encoded=false&wait=true`;
    const response = await axios.post(submitUrl, payload, {
      headers,
      timeout: 25000,
    });

    let result = response.data;

    // If still in queue or processing (status id 1 or 2), poll by token
    if (result.status && (result.status.id === 1 || result.status.id === 2) && result.token) {
      let attempts = 0;
      while (attempts < 6 && (result.status.id === 1 || result.status.id === 2)) {
        await new Promise((res) => setTimeout(res, 1000));
        const pollResponse = await axios.get(
          `${apiUrl.replace(/\/$/, '')}/submissions/${result.token}?base64_encoded=false`,
          { headers, timeout: 10000 }
        );
        result = pollResponse.data;
        attempts++;
      }
    }

    const stdout = result.stdout || '';
    const stderr = result.stderr || '';
    const compileOutput = result.compile_output || '';
    const statusDesc = result.status ? result.status.description : 'Unknown';
    const executionTime = parseFloat(result.time || 0);
    const memory = result.memory || 0;

    return {
      success: true,
      stdout,
      stderr,
      compileOutput,
      status: statusDesc,
      statusId: result.status ? result.status.id : null,
      executionTime,
      memory,
    };
  } catch (error) {
    console.error('Judge0 execution error:', error.response?.data || error.message);
    return {
      success: false,
      stdout: '',
      stderr: error.response?.data?.message || error.message,
      compileOutput: error.response?.data?.error || '',
      status: 'Execution Error',
      statusId: -1,
      executionTime: 0,
      memory: 0,
    };
  }
};

/**
 * Run code against a list of test cases
 */
const runTestCases = async (sourceCode, language, testCases) => {
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    const execResult = await executeCode(sourceCode, language, tc.input);

    const actual = normalizeOutput(execResult.stdout);
    const expected = normalizeOutput(tc.expectedOutput);

    const isAccepted = execResult.success && execResult.status === 'Accepted' && actual === expected;

    results.push({
      testCaseNumber: i + 1,
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      actualOutput: execResult.stdout || '',
      stderr: execResult.stderr,
      compileOutput: execResult.compileOutput,
      passed: isAccepted,
      status: isAccepted ? 'Passed' : execResult.status === 'Accepted' ? 'Wrong Answer' : execResult.status,
      executionTime: execResult.executionTime,
      memory: execResult.memory,
      explanation: tc.explanation || '',
    });
  }

  return results;
};

module.exports = {
  LANGUAGE_MAP,
  executeCode,
  runTestCases,
  normalizeOutput,
};
