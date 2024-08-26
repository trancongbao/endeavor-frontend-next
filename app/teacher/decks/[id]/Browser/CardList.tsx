import { useEffect, useState } from 'react'
import _ from 'lodash'
import { Cards } from './Browser'
import Preview from './Preview'
import { styleNewWord } from './styleNewWord'

export default function CardList({ cards }: { cards: Cards }) {
  const [selectedCard, setSelectedCard] = useState(getFirstCard(cards))

  useEffect(() => {
    setSelectedCard(getFirstCard(cards))
  }, [cards])

  console.log('cards: ', cards)

  /*
   * Extract card list to a separate component would introduce tight coupling regarding the state management of selectedSubdeck.
   */
  return (
    <div className="grid grid-cols-[1fr_2fr]">
      <div className="border-r-4">
        <button className="w-36 bg-orange-400 text-white  hover:bg-orange-300 hover:text-black py-2 px-4 rounded">
          Add card
        </button>
        <ul className="flex flex-col gap-4">
          {Object.keys(cards).map((cardOrder) => (
            <li
              className={`p-2 rounded cursor-pointer  hover:bg-orange-50 ${parseInt(cardOrder) === selectedCard[0].cardOrder ? 'bg-orange-200' : ''}`}
              key={cardOrder}
              onClick={() => setSelectedCard(cards[cardOrder])}
              dangerouslySetInnerHTML={{
                __html: styleNewWord(cards[cardOrder][0].cardText),
              }}
            ></li>
          ))}
        </ul>
      </div>
      <Preview card={selectedCard} />
    </div>
  )
}

function getFirstCard(cards: Cards) {
  return cards[_.min(Object.keys(cards).map(Number)) as number]
}
