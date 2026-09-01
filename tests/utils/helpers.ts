export function generateUniqueEmail(prefix = 'user') {
  return `${prefix}_${Date.now()}@test.com`;
}