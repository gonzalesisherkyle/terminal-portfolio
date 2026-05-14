export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function getApiError(error, fallback = 'Request failed') {
  return error?.response?.data?.error || error?.message || fallback;
}

export function validateContactPayload(payload) {
  if (!payload.name.trim()) return 'Name is required';
  if (!isValidEmail(payload.email)) return 'Valid email is required';
  if (!payload.message.trim()) return 'Message is required';
  return '';
}

export function validateSkillPayload(payload) {
  if (!payload.name.trim()) return 'Skill name is required';
  if (!payload.category.trim()) return 'Skill category is required';
  return '';
}
