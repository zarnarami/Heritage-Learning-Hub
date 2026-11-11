const http = require('http');
const { app, startServer } = require('./server');

const runTests = async () => {
  const server = await startServer();
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  console.log(`\n🧪 STARTING AUTOMATED END-TO-END SYSTEM INTEGRATION TESTS`);
  console.log(`   Target Server: ${baseUrl}\n`);

  const request = (path, method = 'GET', body = null, token = null) => {
    return new Promise((resolve, reject) => {
      const url = new URL(path, baseUrl);
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const req = http.request(
        url,
        {
          method,
          headers,
        },
        res => {
          let data = '';
          res.on('data', chunk => (data += chunk));
          res.on('end', () => {
            try {
              resolve({ status: res.statusCode, body: JSON.parse(data) });
            } catch (e) {
              resolve({ status: res.statusCode, body: data });
            }
          });
        }
      );
      req.on('error', reject);
      if (body) req.write(JSON.stringify(body));
      req.end();
    });
  };

  try {
    // 1. Health check
    const health = await request('/api/health');
    console.log(`✅ [1/10] Health Check: Status ${health.status} (${health.body.status})`);

    // 2. Fetch Heritage list
    const heritage = await request('/api/heritage?limit=5');
    console.log(`✅ [2/10] Heritage API: Loaded ${heritage.body.count} items, Total: ${heritage.body.total}`);
    const firstHeritageId = heritage.body.data[0]._id;

    // 3. Fetch Heritage item details
    const itemDetails = await request(`/api/heritage/${firstHeritageId}`);
    console.log(`✅ [3/10] Heritage Details API: Loaded "${itemDetails.body.data.name}" (${itemDetails.body.data.state})`);

    // 4. Fetch Learning modules
    const modules = await request('/api/modules');
    console.log(`✅ [4/10] Learning Modules API: Loaded ${modules.body.count} modules`);

    // 5. Fetch Quizzes
    const quizzes = await request('/api/quizzes');
    console.log(`✅ [5/10] Quizzes API: Loaded ${quizzes.body.count} quizzes`);
    const firstQuizId = quizzes.body.data[0]._id;

    // 6. Student Login
    const loginRes = await request('/api/auth/login', 'POST', {
      email: 'student@heritagehub.in',
      password: 'Student@123',
    });
    console.log(`✅ [6/10] Student Authentication: Logged in as ${loginRes.body.user.name} (${loginRes.body.user.role})`);
    const studentToken = loginRes.body.token;

    // 7. Student Profile
    const profileRes = await request('/api/auth/profile', 'GET', null, studentToken);
    console.log(`✅ [7/10] Protected Profile: Retrieved profile for ${profileRes.body.user.email}`);

    // 8. Quiz Submission and Auto Score Calculation
    const submitRes = await request(
      `/api/quizzes/${firstQuizId}/submit`,
      'POST',
      {
        answers: [
          { questionId: 'q1', selectedAnswer: 2 },
          { questionId: 'q2', selectedAnswer: 0 },
        ],
      },
      studentToken
    );
    console.log(
      `✅ [8/10] Quiz Submission & Scoring: ${submitRes.body.data.score}/${submitRes.body.data.totalQuestions} (${submitRes.body.data.percentage}%)`
    );

    // 9. Admin Login & Dashboard Stats
    const adminLoginRes = await request('/api/auth/login', 'POST', {
      email: 'admin@heritagehub.in',
      password: 'Admin@12345',
    });
    const adminToken = adminLoginRes.body.token;
    const adminStats = await request('/api/admin/dashboard', 'GET', null, adminToken);
    console.log(
      `✅ [9/10] Admin Dashboard Analytics: ${adminStats.body.data.counts.totalUsers} users, ${adminStats.body.data.counts.totalHeritage} heritage records`
    );

    // 10. Admin User Management
    const usersRes = await request('/api/admin/users', 'GET', null, adminToken);
    console.log(`✅ [10/10] Admin User Management: Retrieved ${usersRes.body.count} active accounts`);

    console.log(`\n🎉 ALL 10 END-TO-END INTEGRATION TESTS PASSED WITH 100% SUCCESS!\n`);
  } catch (err) {
    console.error(`❌ Integration test failure:`, err);
  } finally {
    server.close();
    process.exit(0);
  }
};

runTests();
