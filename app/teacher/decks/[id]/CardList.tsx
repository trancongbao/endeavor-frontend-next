import { useState } from 'react'
import _ from 'lodash'
import { Cards } from './Browsers'
import Preview from './Preview'

export default function CardList({ cards }: { cards: Cards }) {
  const [selectedCard, setSelectedCard] = useState(cards[_.min(Object.keys(cards).map(Number)) as number])

  console.log('cards: ', cards)

  /*
   * Extract card list to a separate component would introduce tight coupling regarding the state management of selectedSubdeck.
   */
  return (
    <div className="grid grid-cols-[1fr_2fr]">
      <div className="border-r-4">
        <ul className="flex flex-col gap-4">
          {Object.keys(cards).map((cardOrder) => (
            <li
              className={`p-2 rounded cursor-pointer  hover:bg-blue-100 ${parseInt(cardOrder) === selectedCard[0].cardOrder ? 'bg-blue-300' : ''}`}
              key={cardOrder}
              onClick={() => setSelectedCard(cards[cardOrder])}
              dangerouslySetInnerHTML={{
                __html: boldNewWord(cards[cardOrder][0].cardText),
              }}
            ></li>
          ))}
        </ul>
        <button className="w-36 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add card</button>
      </div>
      <Preview />
    </div>
  )
}

export function boldNewWord(newWord) {
  let result = newWord
  let startIndex = result.indexOf('#')
  while (startIndex !== -1) {
    let endIndex = result.indexOf('#', startIndex + 1)
    if (endIndex !== -1) {
      const boldText = result.slice(startIndex + 1, endIndex)
      result = result.replace('#' + boldText + '#', `<b class="bold-text">${boldText}</b>`)
      startIndex = result.indexOf('#', endIndex + 1)
    } else {
      startIndex = -1
    }
  }
  return result
}
