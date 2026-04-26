
import http from "k6/http";
import { check, sleep } from "k6";
import { Trend, Rate, Counter } from "k6/metrics";

// ============ METRICS ============
const responseTime = new Trend("response_time");
const errorRate    = new Rate("error_rate");
const reqCount     = new Counter("request_count");

// ============ CONFIG ============
export const options = {
  stages: [
    { duration: "30s", target: 10  },
    { duration: "1m",  target: 50  },
    { duration: "30s", target: 100 },
    { duration: "30s", target: 0   },
  ],
  thresholds: {
    http_req_duration: ["p(95)<500"],
    http_req_failed:   ["rate<0.05"],
    response_time:     ["p(90)<300"],
  },
};

const BASE_URL = "http://localhost:3300";
const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwicm9sZSI6InVzZXIiLCJsb2dpbl90b2tlbiI6IjU4ZDkwNDU0Yjg3ZGU4OTcyZmU2NmNkM2EyOTM1MjEzYzVhZGNlMGRmMmI5ZjExMmI4ZWVjNDdhOWFlNjE3MjciLCJpYXQiOjE3NzcyMjc0OTEsImV4cCI6MTc3NzMxMzg5MX0.QpjWTL3dnhMHC6C0KuYc90FsYzG9zf_Lu-MKZ1d4Uf8";

const HEADERS = {
  Authorization: `Bearer ${TOKEN}`,
  "Content-Type": "application/json",
};

// ============ HELPER ============
function safeParseJSON(body) {
  try { return JSON.parse(body); } catch { return null; }
}

function testEndpoint(name, method, url, body = null) {
  const res = method === "GET"
    ? http.get(url, { headers: HEADERS })
    : http[method.toLowerCase()](url, body ? JSON.stringify(body) : null, { headers: HEADERS });

  const parsed = safeParseJSON(res.body);

  check(res, {
    [`[${name}] Status 2xx`]:      (r) => r.status >= 200 && r.status < 300,
    [`[${name}] Response < 500ms`]:(r) => r.timings.duration < 500,
    [`[${name}] Body not empty`]:  (r) => r.body && r.body.length > 0,
  });

  responseTime.add(res.timings.duration);
  errorRate.add(res.status >= 400 && res.status !== 429);
  reqCount.add(1);

  return { res, parsed };
}

// ============ MAIN ============
export default function () {

  // 1. USERS
  testEndpoint("GET /users/me",   "GET", `${BASE_URL}/api/v1/users/me`);
  testEndpoint("GET /users",      "GET", `${BASE_URL}/api/v1/users`);
  sleep(0.5);

  // 2. COURSES
  testEndpoint("GET /courses",    "GET", `${BASE_URL}/api/v1/courses`);
  testEndpoint("GET /courses/1",  "GET", `${BASE_URL}/api/v1/courses/1`);
  sleep(0.5);

  // 3. MODULES
  testEndpoint("GET /modules",    "GET", `${BASE_URL}/api/v1/modules`);
  sleep(0.5);

  // 4. INSTRUCTOR
  testEndpoint("GET /instructor", "GET", `${BASE_URL}/api/v1/instructor`);
  sleep(0.5);

  // 5. FAQ
  testEndpoint("GET /faq",        "GET", `${BASE_URL}/api/v1/faq`);
  sleep(0.5);

  // 6. REVIEWS
  testEndpoint("GET /reviews",    "GET", `${BASE_URL}/api/v1/reviews`);
  sleep(0.5);

  // 7. STUDENT COURSES
  testEndpoint("GET /student-courses", "GET", `${BASE_URL}/api/v1/student-courses`);
  sleep(0.5);

  // 8. REGISTER COURSE
  testEndpoint("GET /register-course", "GET", `${BASE_URL}/api/v1/register-course`);
  sleep(0.5);

  // 9. REGISTRATION
  testEndpoint("GET /registration", "GET", `${BASE_URL}/api/v1/registration`);
  sleep(0.5);

  // 10. PAYMENTS
  testEndpoint("GET /payments",   "GET", `${BASE_URL}/api/v1/payments`);
  sleep(0.5);

  // 11. BANK CARDS
  testEndpoint("GET /bank-cards", "GET", `${BASE_URL}/api/v1/bank-cards`);
  sleep(0.5);

  // 12. SETTINGS
  testEndpoint("GET /settings",   "GET", `${BASE_URL}/api/v1/settings`);
  sleep(0.5);

  // 13. FILES
  testEndpoint("GET /files",      "GET", `${BASE_URL}/api/v1/files`);
  sleep(0.5);

  // 14. CONTACT INFO
  testEndpoint("GET /contact-info", "GET", `${BASE_URL}/api/v1/contact-info`);
  sleep(0.5);

  // 15. HERO CONTENT
  testEndpoint("GET /hero-content", "GET", `${BASE_URL}/api/v1/hero-content`);

  sleep(1);
}

// ============ SUMMARY ============
export function handleSummary(data) {
  const dur  = data.metrics.http_req_duration;
  const fail = data.metrics.http_req_failed;

  console.log("\n========== FULL API TEST SUMMARY ==========");
  console.log(`Total Requests    : ${data.metrics.request_count?.values?.count ?? "N/A"}`);
  console.log(`Avg Response Time : ${dur.values.avg.toFixed(2)}ms`);
  console.log(`Min Response Time : ${dur.values.min.toFixed(2)}ms`);
  console.log(`Max Response Time : ${dur.values.max.toFixed(2)}ms`);
  console.log(`P90 Response Time : ${dur.values["p(90)"].toFixed(2)}ms`);
  console.log(`P95 Response Time : ${dur.values["p(95)"].toFixed(2)}ms`);
  console.log(`Error Rate        : ${(fail.values.rate * 100).toFixed(2)}%`);
  console.log("===========================================\n");
}