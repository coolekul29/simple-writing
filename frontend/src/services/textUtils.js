// Count words in a string
export function countWords(str) {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// Enforce the 500-word limit
export function limitToMaxWords(str, MAX_WORDS) {
  const wordsArray = str.trim().split(/\s+/).filter(Boolean);
  if (wordsArray.length > MAX_WORDS) {
    return {
      text: wordsArray.slice(0, MAX_WORDS).join(" "),
      count: MAX_WORDS
    };
  }
  return {
    text: str,
    count: wordsArray.length
  };
}

// Paste from clipboard and merge with existing text
export async function pasteFromClipboard(existingText, MAX_WORDS) {
  const clipboardText = await navigator.clipboard.readText();
  if (!clipboardText) {
    throw new Error("Clipboard is empty — copy some text first!");
  }

  const combinedText = existingText
    ? existingText + " " + clipboardText
    : clipboardText;

  return limitToMaxWords(combinedText, MAX_WORDS);
}