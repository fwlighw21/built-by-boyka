const https = require('https');
const fs = require('fs');

const auth = JSON.parse(fs.readFileSync('C:/Users/Administrator/AppData/Roaming/com.vercel.cli/Data/auth.json', 'utf8'));
const token = auth.token;

const envVars = [
  { key: 'DATABASE_URL', value: 'file:./dev.db', type: 'plain', target: ['production', 'preview', 'development'] },
  { key: 'JWT_SECRET', value: 'built-by-boyka-super-secure-jwt-secret-key-2026-production-ready', type: 'plain', target: ['production', 'preview', 'development'] },
  { key: 'ADMIN_DEFAULT_USERNAME', value: 'Boyka', type: 'plain', target: ['production', 'preview', 'development'] },
  { key: 'ADMIN_DEFAULT_PASSWORD', value: 'Boyka1234', type: 'plain', target: ['production', 'preview', 'development'] },
  { key: 'NEXT_PUBLIC_APP_URL', value: 'https://built-by-boyka.vercel.app', type: 'plain', target: ['production', 'preview', 'development'] }
];

async function addEnv(item) {
  const data = JSON.stringify(item);
  return new Promise((resolve) => {
    const req = https.request({
      hostname: 'api.vercel.com',
      path: '/v10/projects/built-by-boyka/env?teamId=team_szurotnAbu0AXrMcvxDY3MRE',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(`Env ${item.key}: status ${res.statusCode}`);
        resolve();
      });
    });
    req.write(data);
    req.end();
  });
}

(async () => {
  for (const env of envVars) {
    await addEnv(env);
  }
  console.log('All environment variables added to Vercel!');
})();
