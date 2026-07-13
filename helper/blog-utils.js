export function getBlogStats(htmlContent) {
  // 1. Remove HTML tags using regex
  const text = htmlContent.replace(/<[^>]*>/g, " ");

  // 2. Count words
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  const wordCount = words.length;

  // 3. Calculate reading time (assuming 225 words per minute)
  const readingTime = Math.ceil(wordCount / 225);

  return { wordCount, readingTime };
}
