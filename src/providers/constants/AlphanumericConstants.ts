export function isAlphanumeric(inputStr: string): boolean {
  const allowedChars = /^[A-Za-z0-9\s]+$/;
  return allowedChars.test(inputStr);
}
