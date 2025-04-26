export function captializeFirstLetter(string: string) {
  if (!string?.length) {
    return;
  }

  return string[0].toUpperCase() + string.slice(1);
}
