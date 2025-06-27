export function captializeFirstLetter(string: string) {
  if (!string?.length) {
    return;
  }

  return string[0].toUpperCase() + string.slice(1);
}

export function isStringUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (e) {
    return false;
  }
}
