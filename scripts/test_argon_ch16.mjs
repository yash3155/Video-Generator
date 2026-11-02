import 'dotenv/config';

const uniqueId = `fresh_test_${Date.now()}`;
console.log('Sending request with unique session ID:', uniqueId);

const res = await fetch('http://127.0.0.1:8001/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Session-ID': uniqueId,
    'X-Agent-ID': uniqueId,
    'Authorization': 'Bearer none',
  },
  body: JSON.stringify({
    model: 'argon-low',
    messages: [
      { role: 'user', content: 'Generate a short 1-line JSON object: {"status": "ok", "message": "Argon is alive and working!"}. Output ONLY the JSON.' },
    ],
    temperature: 0.2,
  }),
});

console.log('Response HTTP status:', res.status);
const data = await res.json();
console.log('Response body:', JSON.stringify(data, null, 2));
