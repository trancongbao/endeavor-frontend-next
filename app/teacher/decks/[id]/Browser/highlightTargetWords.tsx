export function highlightTargetWords(cardText: string, targetWordPositions: { start: number; end: number }[]): string {
  // Sort positions by start index to handle inserts correctly
  const sortedPositions = targetWordPositions.sort((a, b) => a.start - b.start)

  // Offset to keep track of the shift in indices after insertion
  let offset = 0

  for (const position of sortedPositions) {
    const startIndex = position.start + offset
    const endIndex = position.end + offset

    // Insert opening <b> tag
    cardText = cardText.slice(0, startIndex) + '<b>' + cardText.slice(startIndex)
    offset += 3 // Length of "<b>" is 3

    // Insert closing </b> tag
    cardText =
      cardText.slice(0, endIndex + 3) + // +3 to account for the added <b> tag
      '</b>' +
      cardText.slice(endIndex + 3)
    offset += 4 // Length of "</b>" is 4
  }

  return cardText
}
