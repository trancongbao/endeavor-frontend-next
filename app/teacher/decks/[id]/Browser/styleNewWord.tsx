export function styleNewWord(newWord: string) {
  let result = newWord
  let startIndex = result.indexOf('#')
  while (startIndex !== -1) {
    let endIndex = result.indexOf('#', startIndex + 1)
    if (endIndex !== -1) {
      const boldText = result.slice(startIndex + 1, endIndex)
      result = result.replace('#' + boldText + '#', `<b class="text-primary-600">${boldText}</b>`)
      startIndex = result.indexOf('#', endIndex + 1)
    } else {
      startIndex = -1
    }
  }
  return result
}
