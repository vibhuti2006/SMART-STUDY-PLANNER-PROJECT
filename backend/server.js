require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Initialize Express
const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static('public'));

// Import Routes
const authRoutes = require('./routes/auth');
const subjectRoutes = require('./routes/subjects');
const examRoutes = require('./routes/exams');
const studySessionRoutes = require('./routes/studySessions');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/study-sessions', studySessionRoutes);

// Root Route - API Documentation/Test Page
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Smart Study Planner API',
    version: '1.0.0',
    status: 'Running',
    endpoints: {
      auth: {
        signup: 'POST /api/auth/signup',
        login: 'POST /api/auth/login',
        getMe: 'GET /api/auth/me (Protected)',
      },
      subjects: {
        create: 'POST /api/subjects (Protected)',
        getAll: 'GET /api/subjects (Protected)',
        getOne: 'GET /api/subjects/:id (Protected)',
        update: 'PUT /api/subjects/:id (Protected)',
        delete: 'DELETE /api/subjects/:id (Protected)',
        updateTopic: 'PUT /api/subjects/:id/topics/:topicId (Protected)',
        stats: 'GET /api/subjects/stats (Protected)',
      },
      exams: {
        create: 'POST /api/exams (Protected)',
        getAll: 'GET /api/exams (Protected)',
        getOne: 'GET /api/exams/:id (Protected)',
        update: 'PUT /api/exams/:id (Protected)',
        delete: 'DELETE /api/exams/:id (Protected)',
        upcoming: 'GET /api/exams/upcoming (Protected)',
        stats: 'GET /api/exams/stats (Protected)',
      },
    },
    documentation: 'Visit /test for interactive API testing',
  });
});

// Test Page Route
app.get('/test', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Test - Smart Study Planner</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 2.5em;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1em;
        }
        .info {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        .button-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }
        button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 16px;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
        button:active {
            transform: translateY(0);
        }
        #result {
            background: #f8f9fa;
            padding: 25px;
            border-radius: 10px;
            border: 2px solid #e9ecef;
            min-height: 200px;
            white-space: pre-wrap;
            font-family: 'Courier New', monospace;
            font-size: 13px;
            overflow-x: auto;
            line-height: 1.6;
        }
        .success {
            color: #28a745;
            font-weight: bold;
            font-size: 16px;
        }
        .error {
            color: #dc3545;
            font-weight: bold;
            font-size: 16px;
        }
        .loading {
            color: #007bff;
            font-weight: bold;
        }
        .endpoint-info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
            border-left: 4px solid #667eea;
        }
        .endpoint-info h3 {
            color: #667eea;
            margin-bottom: 10px;
        }
        .endpoint-info code {
            background: #e9ecef;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 13px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Smart Study Planner</h1>
        <p class="subtitle">Backend API Testing Interface</p>
        
        <div class="info">
            <strong>📋 Instructions:</strong> Test your authentication endpoints by clicking the buttons below. 
            Signup creates a new user, Login authenticates, and Get Me retrieves user data using the JWT token.
        </div>

        <div class="button-group">
            <button onclick="testSignup()">📝 Test Signup</button>
            <button onclick="testLogin()">🔐 Test Login</button>
            <button onclick="testGetMe()">👤 Get Me (Protected)</button>
            <button onclick="clearResult()" style="background: #6c757d;">🗑️ Clear</button>
        </div>

        <div id="result">👋 Welcome! Click a button above to test the API endpoints...</div>

        <div class="endpoint-info">
            <h3>📡 Available Endpoints:</h3>
            <p><strong>POST</strong> <code>/api/auth/signup</code> - Register new user</p>
            <p><strong>POST</strong> <code>/api/auth/login</code> - Login user</p>
            <p><strong>GET</strong> <code>/api/auth/me</code> - Get current user (requires token)</p>
        </div>
    </div>

    <script>
        let authToken = '';
        let currentUser = null;

        async function testSignup() {
            showLoading('Creating new user...');
            try {
                const timestamp = Date.now();
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: 'Test User ' + timestamp,
                        email: 'test' + timestamp + '@example.com',
                        password: 'password123'
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    authToken = data.data.token;
                    currentUser = data.data;
                    showResult('✅ SIGNUP SUCCESS!', {
                        ...data,
                        note: 'Token saved! You can now test protected routes.'
                    });
                } else {
                    showResult('❌ SIGNUP FAILED', data);
                }
            } catch (error) {
                showResult('❌ ERROR', { error: error.message });
            }
        }

        async function testLogin() {
            showLoading('Logging in...');
            
            // Use the last created user or default
            const email = currentUser ? currentUser.email : 'test@example.com';
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        password: 'password123'
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    authToken = data.data.token;
                    currentUser = data.data;
                    showResult('✅ LOGIN SUCCESS!', {
                        ...data,
                        note: 'Token saved! You can now test protected routes.'
                    });
                } else {
                    showResult('❌ LOGIN FAILED', {
                        ...data,
                        tip: 'Try clicking "Test Signup" first to create a user.'
                    });
                }
            } catch (error) {
                showResult('❌ ERROR', { error: error.message });
            }
        }

        async function testGetMe() {
            if (!authToken) {
                showResult('❌ NO TOKEN', { 
                    error: 'Please login or signup first to get an authentication token!',
                    tip: 'Click "Test Signup" or "Test Login" first.'
                });
                return;
            }

            showLoading('Fetching user data...');
            try {
                const response = await fetch('/api/auth/me', {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + authToken
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showResult('✅ GET ME SUCCESS!', {
                        ...data,
                        note: 'Protected route accessed successfully with JWT token!'
                    });
                } else {
                    showResult('❌ GET ME FAILED', data);
                }
            } catch (error) {
                showResult('❌ ERROR', { error: error.message });
            }
        }

        function showLoading(message) {
            document.getElementById('result').innerHTML = 
                \`<span class="loading">⏳ \${message}</span>\`;
        }

        function showResult(title, data) {
            const resultDiv = document.getElementById('result');
            const isSuccess = title.includes('SUCCESS');
            const className = isSuccess ? 'success' : 'error';
            resultDiv.innerHTML = 
                \`<span class="\${className}">\${title}</span>\\n\\n\${JSON.stringify(data, null, 2)}\`;
        }

        function clearResult() {
            document.getElementById('result').innerHTML = 
                '👋 Welcome! Click a button above to test the API endpoints...';
            authToken = '';
            currentUser = null;
        }
    </script>
</body>
</html>
  `);
});

// 404 Handler - Must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableRoutes: {
      root: 'GET /',
      test: 'GET /test',
      auth: 'POST /api/auth/signup, POST /api/auth/login, GET /api/auth/me',
      subjects: 'POST /api/subjects, GET /api/subjects, etc.',
      exams: 'POST /api/exams, GET /api/exams, etc.',
      'study-sessions': 'GET /api/study-sessions/schedule, etc.'
    },
  });
});

// Error Handler - Must be last
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Server Port
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API: http://localhost:${PORT}`);
  console.log(`🧪 Test Page: http://localhost:${PORT}/test`);
});