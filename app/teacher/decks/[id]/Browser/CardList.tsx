'use client'
import { useEffect, useState } from 'react'
import _ from 'lodash'
import { Cards } from './Browser'
import { styleNewWord } from './styleNewWord'
import Card from './Card/Card'
import { Row } from '../page'

export default function CardList({ selectedSubdeckRows }: { selectedSubdeckRows: Row[] }) {
  console.log('CardList selectedSubdeckRows: ', selectedSubdeckRows)
  /*
   * Even though this is a client component, it is still pre-rendered on the server side.
   * Therefore, the useEffect hook would not be executed on the client side because selectedSubdeckRows would not have changed.
   * Therefore, the initial state of selectedCardRows must not be set to an empty array.
   */
  const [selectedCardRows, setSelectedCardRows] = useState<Row[]>(getFirstCard(groupCardRows(selectedSubdeckRows)))

  useEffect(() => {
    console.log('useEffect selectedSubdeckRows: ', selectedSubdeckRows)
    setSelectedCardRows(getFirstCard(groupCardRows(selectedSubdeckRows)))
  }, [selectedSubdeckRows])

  /*
   * Extract card list to a separate component would introduce tight coupling regarding the state management of selectedSubdeck.
   */
  const cards = groupCardRows(selectedSubdeckRows)
  console.log('cards: ', cards)
  return (
    <div className="grid grid-cols-[1fr_2fr]">
      <div className="border-r-4">
        <button className="w-36 bg-orange-400 text-white  hover:bg-orange-300 hover:text-black py-2 px-4 rounded">
          Add card
        </button>
        {isCardExisting(selectedSubdeckRows) && (
          <ul className="flex flex-col gap-4">
            {Object.keys(groupCardRows(selectedSubdeckRows)).map((cardOrder) => (
              <li
                className={`p-2 rounded cursor-pointer  hover:bg-orange-50 ${parseInt(cardOrder) === selectedCardRows[0].cardOrder ? 'bg-orange-200' : ''}`}
                key={cardOrder}
                onClick={() => setSelectedCardRows(cards[cardOrder])}
                dangerouslySetInnerHTML={{
                  __html: styleNewWord(cards[cardOrder][0].cardText as string),
                }}
              ></li>
            ))}
          </ul>
        )}
      </div>
      {isCardExisting(selectedSubdeckRows) && <Card card={selectedCardRows} />}
    </div>
  )
}

function groupCardRows(selectedSubdeckRows: Row[]) {
  return _.groupBy(selectedSubdeckRows, 'cardOrder')
}

function getFirstCard(cards: Cards) {
  return cards[_.min(Object.keys(cards).map(Number)) as number]
}

function isCardExisting(selectedSubdeckRows: Row[]) {
  return selectedSubdeckRows[0]['cardOrder'] !== null
}
