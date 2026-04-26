const http = require('http');

// API base URL
const BASE_URL = 'http://localhost:3300/api/v1';

// Endpoints to test (public ones first, then protected)
const endpoints = [
  { name: 'GET /courses', method: 'GET', path: '/courses', auth: false },
  { name: 'GET /instructor', method: 'GET', path: '/instructor', auth: false },
  { name: 'GET /reviews', method: 'GET', path: '/reviews', auth: false },
  { name: 'GET /faq', method: 'GET', path: '/faq', auth: false },
  { name: 'GET /users/me', method: 'GET', path: '/users/me', auth: true },
];

// Test each endpoint
async function testEndpoint(endpoint, token = null) {
  return new Promise((resolve) => {
    const url = new URL(BASE_URL + endpoint.path);
    
    const options = {
      hostname: url.hostname,
      port: url.port || 3300,
      path: url.pathname,
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const startTime = Date.now();
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        const duration = Date.now() - startTime;
        resolve({
          name: endpoint.name,
          status: res.statusCode,
          duration: duration,
          success: res.statusCode >= 200 && res.statusCode < 400
        });
      });
    });

    req.on('error', (error) => {
      const duration = Date.now() - startTime;
      resolve({
        name: endpoint.name,
        status: 'ERROR',
        duration: duration,
        success: false,
        error: error.message
      });
    });

    if (endpoint.method !== 'GET') {
      req.write(JSON.stringify(endpoint.body || {}));
    }
    
    req.end();
  });
}

// Run tests multiple times and get average
async function runTests(iterations = 5) {
  console.log('🚀 Starting API Performance Tests...\n');
  console.log(`Testing each endpoint ${iterations} times and calculating averages\n`);
  
  const results = [];
  
  for (const endpoint of endpoints) {
    console.log(`Testing: ${endpoint.name}`);
    
    const durations = [];
    const successes = [];
    
    for (let i = 0; i < iterations; i++) {
      const result = await testEndpoint(endpoint);
      durations.push(result.duration);
      successes.push(result.success);
      
      // Small delay between requests
      await new Promise(r => setTimeout(r, 100));
    }
    
    const avgDuration = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
    const minDuration = Math.min(...durations);
    const maxDuration = Math.max(...durations);
    const successRate = Math.round((successes.filter(s => s).length / successes.length) * 100);
    
    results.push({
      name: endpoint.name,
      avgDuration,
      minDuration,
      maxDuration,
      successRate
    });
    
    console.log(`  ✅ Avg: ${avgDuration}ms | Min: ${minDuration}ms | Max: ${maxDuration}ms | Success: ${successRate}%\n`);
  }
  
  // Sort by average duration (slowest first)
  results.sort((a, b) => b.avgDuration - a.avgDuration);
  
  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 PERFORMANCE SUMMARY (Slowest to Fastest)');
  console.log('='.repeat(60) + '\n');
  
  results.forEach((result, index) => {
    const status = result.avgDuration < 100 ? '🟢 FAST' : 
                  result.avgDuration < 300 ? '🟡 OK' : 
                  result.avgDuration < 500 ? '🟠 SLOW' : '🔴 VERY SLOW';
    
    console.log(`${index + 1}. ${result.name.padEnd(25)} ${status.padEnd(12)} ${result.avgDuration}ms avg`);
  });
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 RECOMMENDATIONS');
  console.log('='.repeat(60) + '\n');
  
  const verySlow = results.filter(r => r.avgDuration >= 500);
  const slow = results.filter(r => r.avgDuration >= 300 && r.avgDuration < 500);
  const ok = results.filter(r => r.avgDuration >= 100 && r.avgDuration < 300);
  const fast = results.filter(r => r.avgDuration < 100);
  
  if (verySlow.length > 0) {
    console.log('🔴 VERY SLOW (Need optimization):');
    verySlow.forEach(r => console.log(`   - ${r.name}: ${r.avgDuration}ms`));
    console.log('');
  }
  
  if (slow.length > 0) {
    console.log('🟠 SLOW (Could be optimized):');
    slow.forEach(r => console.log(`   - ${r.name}: ${r.avgDuration}ms`));
    console.log('');
  }
  
  if (ok.length > 0) {
    console.log('🟡 OK (Acceptable performance):');
    ok.forEach(r => console.log(`   - ${r.name}: ${r.avgDuration}ms`));
    console.log('');
  }
  
  if (fast.length > 0) {
    console.log('🟢 FAST (Good performance):');
    fast.forEach(r => console.log(`   - ${r.name}: ${r.avgDuration}ms`));
    console.log('');
  }
}

// Check if server is running
http.get('http://localhost:3300/api/v1/courses', (res) => {
  console.log('✅ Server is running\n');
  runTests(5);
}).on('error', (err) => {
  console.log('❌ Server is not running. Please start your server first.');
  console.log('   Run: npm start or node server.js');
  process.exit(1);
});
