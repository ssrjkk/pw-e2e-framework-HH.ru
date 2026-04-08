import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const baseURL = __ENV.K6_BASE_URL || 'http://localhost:3000/api';

const errorRate = new Rate('errors');
const authDuration = new Trend('auth_duration');
const todoDuration = new Trend('todo_duration');

const userEmail = `loadtest_${Date.now()}@test.com`;
const userPassword = 'TestPass123!';

export const options = {
  stages: [
    { duration: '30s', target: 10 },
    { duration: '1m', target: 50 },
    { duration: '30s', target: 100 },
    { duration: '1m', target: 100 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],
    errors: ['rate<0.1'],
  },
};

export default function () {
  const registerRes = http.post(
    `${baseURL}/auth/register`,
    JSON.stringify({
      email: `loadtest_${Date.now()}_${__VU}@test.com`,
      name: `LoadTest User ${__VU}`,
      password: userPassword,
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    },
  );

  const registerDuration = registerRes.timings.duration;
  authDuration.add(registerDuration);

  const isRegisterSuccess = check(registerRes, {
    'register status is 201 or 200': (r) => r.status === 201 || r.status === 200,
  });
  errorRate.add(!isRegisterSuccess);

  if (registerRes.status !== 201 && registerRes.status !== 200) {
    sleep(1);
    return;
  }

  let token = '';
  try {
    const registerData = JSON.parse(registerRes.body);
    token = registerData.token || registerData.data?.token || '';
  } catch {
    const loginRes = http.post(
      `${baseURL}/auth/login`,
      JSON.stringify({
        email: userEmail,
        password: userPassword,
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    const loginDuration = loginRes.timings.duration;
    authDuration.add(loginDuration);

    const isLoginSuccess = check(loginRes, {
      'login status is 200': (r) => r.status === 200,
    });
    errorRate.add(!isLoginSuccess);

    if (loginRes.status === 200) {
      try {
        const loginData = JSON.parse(loginRes.body);
        token = loginData.token || loginData.data?.token || '';
      } catch {}
    }
  }

  if (!token) {
    sleep(1);
    return;
  }

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const todoRes = http.post(
    `${baseURL}/todos`,
    JSON.stringify({
      title: `Load test todo from VU ${__VU} at ${Date.now()}`,
    }),
    { headers },
  );

  const todoDurationValue = todoRes.timings.duration;
  todoDuration.add(todoDurationValue);

  const isTodoCreated = check(todoRes, {
    'create todo status is 201': (r) => r.status === 201,
  });
  errorRate.add(!isTodoCreated);

  const getTodosRes = http.get(`${baseURL}/todos`, { headers });
  const isGetTodosSuccess = check(getTodosRes, {
    'get todos status is 200': (r) => r.status === 200,
  });
  errorRate.add(!isGetTodosSuccess);

  sleep(1);
}

export function handleSummary(data) {
  return {
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
    'load-tests/summary.json': JSON.stringify(data),
  };
}

function textSummary(data, options) {
  const indent = options.indent || '';
  const enableColors = options.enableColors || false;

  let output = `\n${indent}Test Summary:\n`;
  output += `${indent}==============\n`;
  output += `${indent}Total Requests: ${data.metrics.http_reqs.values.count}\n`;
  output += `${indent}Failed Requests: ${data.metrics.http_req_failed?.values.passes || 0}\n`;
  output += `${indent}Avg Response Time: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms\n`;
  output += `${indent}P95 Response Time: ${data.metrics.http_req_duration.values['p(95)'].toFixed(2)}ms\n`;

  return output;
}
