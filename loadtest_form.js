import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// غيّر الرابط هنا إلى رابط الـ API أو صفحة التسجيل الخاصة بك (لكن فقط لو عندك صلاحية)
const TARGET = __ENV.TARGET_URL || 'https://www.example.com/sign-up/';

export let options = {
  scenarios: {
    constant_rps: {
      executor: 'constant-arrival-rate',
      rate: 1000,          // عدد الطلبات في الثانية (1000 RPS)
      timeUnit: '1s',     // المعدّل محسوب لكل ثانية
      duration: '60m',     // مدة الاختبار (60 دقيقة)
      preAllocatedVUs: 400, // عدد المستخدمين الافتراضيين المبدئيين
      maxVUs: 1000000,        // أقصى عدد VUs ممكن يولّدها k6 للحفاظ على المعدّل
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% من الطلبات أقل من 2 ثانية
    http_req_failed: ['rate<0.05'],    // أقل من 5% فشل
  },
};

let reqTrend = new Trend('req_duration');

export default function () {
  // بيانات التسجيل (عدّل المفاتيح حسب API أو الـ form عندك)
  const payload = JSON.stringify({
    username: `user${Math.floor(Math.random() * 1e6)}`,
    email: `loadtest+${Math.floor(Math.random() * 1e6)}@example.com`,
    password: 'TestPass123!',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: '60s',
  };

  // إرسال الطلب
  let res = http.post(TARGET, payload, params);

  // التحقق من الاستجابة
  check(res, {
    'status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    'no server error (>=500)': (r) => r.status < 500,
  });

  reqTrend.add(res.timings.duration);
  sleep(Math.random() * 1.5 + 0.5); // تأخير بسيط لمحاكاة مستخدم حقيقي
}
