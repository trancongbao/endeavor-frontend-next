export function highlightTargetWords(cardText: string, targetWordPositions: { start: number; end: number }[]): string {
  const bTagOpening = '<b class="text-primary-600">'
  const bTagClosing = '</b>'
  // Sort positions by start index to handle inserts correctly
  const sortedPositions = targetWordPositions.sort((a, b) => a.start - b.start)
  console.log(`highlightTargetWords: sortedPositions=${sortedPositions}`)

  // Offset to keep track of the shift in indices after insertion
  let offset = 0

  sortedPositions.forEach((position) => {
    const startIndex = position.start + offset
    const endIndex = position.end + offset

    // Insert opening <b> opening tag
    cardText = cardText.slice(0, startIndex) + bTagOpening + cardText.slice(startIndex)
    offset += bTagOpening.length

    // Insert closing </b> tag
    cardText =
      cardText.slice(0, endIndex + bTagOpening.length + 1) +
      bTagClosing +
      cardText.slice(endIndex + bTagOpening.length + 1)
    offset += bTagClosing.length
  })

  return cardText
}
