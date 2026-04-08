import http from 'k6/http';
import { check, sleep } from 'k6/metrics';

const baseURL = __ENV.K6_BASE_URL || 'http://localhost:3000/api';

export const options = {
  vus: 50,
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<200'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const healthRes = http.get(`${baseURL.replace('/api', '')}/health`);
  check(healthRes, {
    'health endpoint returns 200': (r) => r.status === 200,
  });

  const apiHealthRes = http.get(`${baseURL}/health`);
  check(apiHealthRes, {
    'api health endpoint returns 200': (r) => r.status === 200,
  });

  sleep(0.5);
}
