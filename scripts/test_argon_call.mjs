// scripts/test_argon_call.mjs
async function main() {
  console.log('Testing Gemini 4 Argon on http://127.0.0.1:8001/v1/chat/completions...');
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000);

  try {
    const res = await fetch('http://127.0.0.1:8001/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test'
      },
      body: JSON.stringify({
        model: 'gemini-4-argon',
        messages: [
          { role: 'user', content: 'Say "Gemini 4 Argon Online"' }
        ]
      }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await res.json();
    if (data.choices && data.choices[0]) {
      console.log('✅ Response:', data.choices[0].message.content.trim());
    } else {
      console.log('❌ Unexpected response structure:', JSON.stringify(data, null, 2));
    }
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('Fetch error:', err.message);
  }
}

main().catch(console.error);
