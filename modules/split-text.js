module.exports = function splitText(text, size) {
  const parts = []

  for (let i = 0, j = 1; i < text.length && j; i = j) {
    j = text.lastIndexOf(".", i + size) + 1
    if (i == j || !j && (i || !parts.length)) j = text.indexOf(".", i + size) + 1
    parts.push(text.slice(i, j || undefined))
  }

  return parts
}