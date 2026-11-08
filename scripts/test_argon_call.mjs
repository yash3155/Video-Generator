// scripts/test_argon_call.mjs
async function main() {
  console.log('Testing Gemini on proxy http://127.0.0.1:8001/v1/chat/completions...');
  const res = await fetch('http://127.0.0.1:8001/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer test'
    },
    body: JSON.stringify({
      model: 'default',
      messages: [
        { role: 'user', content: 'Say "Gemini Proxy Connected"' }
      ]
    })
  });

  const data = await res.json();
  if (data.choices && data.choices[0]) {
    console.log('✅ Response:', data.choices[0].message.content.trim());
  } else {
    console.log('❌ Unexpected response structure:', JSON.stringify(data, null, 2));
  }
}

main().catch(console.error);
