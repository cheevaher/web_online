// services/emailService.js
export async function checkEmail(email) {
  const res = await fetch(`/api/check-email/${email}`);
  if (!res.ok) throw new Error('Failed to check email');
  const data = await res.json();
  return data.exists;  // true หรือ false
}
