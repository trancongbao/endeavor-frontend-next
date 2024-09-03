export function highlightTargetWords(cardText: string, targetWordPositions: { start: number; end: number }[]): string {
  const bTag = '<b class="text-primary-600">'
  // Sort positions by start index to handle inserts correctly
  const sortedPositions = targetWordPositions.sort((a, b) => a.start - b.start)
  console.log(`highlightTargetWords: "sortedPositions=${sortedPositions}`)

  // Offset to keep track of the shift in indices after insertion
  let offset = 0

  for (const position of sortedPositions) {
    const startIndex = position.start + offset
    const endIndex = position.end + offset

    // Insert opening <b> tag
    cardText = cardText.slice(0, startIndex) + bTag + cardText.slice(startIndex)
    offset += 28 // Length of "<b class="text-primary-600">" is 3

    // Insert closing </b> tag
    cardText =
      cardText.slice(0, endIndex + 28) + // +3 to account for the added <b> tag
      '</b>' +
      cardText.slice(endIndex + 28)
    offset += 4 // Length of "</b>" is 4
  }

  return cardText
}
