function generateRandomString(len = 43) {
  const chars = 'QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm1234567890-._~';
  var result = '';
  for (var i = 0; i < len; i++) {
    const c = chars[Math.floor(Math.random()*chars.length)];
    result += c;
  }
  return result;
}

export async function generateChallenge(len=43) {
  const code_verifier = generateRandomString(len);
  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const code_challenge = await window.crypto.subtle.digest('SHA-256', data);
  return {code_challenge, code_verifier};
}