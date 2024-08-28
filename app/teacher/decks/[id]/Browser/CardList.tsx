'use client'
import { useState } from 'react'
import _ from 'lodash'
import { styleNewWord } from './styleNewWord'
import Card from './Card/Card'
import { Row } from '../page'

export default function CardList({ selectedSubdeckRows }: { selectedSubdeckRows: Row[] }) {
  console.log('CardList: selectedSubdeckRows = ', selectedSubdeckRows)
  const groupedCardRows = hasCard(selectedSubdeckRows) ? _.groupBy(selectedSubdeckRows, 'cardOrder') : undefined
  console.log('CardList: groupedCardRows = ', groupedCardRows)
  /* */
  const [selectedCardRows, setSelectedCardRows] = useState<Row[]>(groupedCardRows ? getFirstCard(groupedCardRows) : [])

  return (
    <div className="grid grid-cols-[1fr_2fr]">
      <div className="border-r-4">
        <button className="w-36 bg-orange-400 text-white  hover:bg-orange-300 hover:text-black py-2 px-4 rounded">
          Add card
        </button>
        {/*
         * Card list is defined inline here, as extracting it to a separate component would introduce tight coupling regarding the state management of selectedCardRows.
         */}
        {groupedCardRows && (
          <ul className="flex flex-col gap-4">
            {Object.keys(groupedCardRows).map((cardOrder) => (
              <li
                className={`p-2 rounded cursor-pointer  hover:bg-orange-50 ${selectedCardRows.length > 0 && parseInt(cardOrder) === selectedCardRows[0].cardOrder ? 'bg-orange-200' : ''}`}
                key={cardOrder}
                onClick={() => setSelectedCardRows(groupedCardRows[cardOrder])}
                dangerouslySetInnerHTML={{
                  __html: styleNewWord(groupedCardRows[cardOrder][0].cardText as string),
                }}
              ></li>
            ))}
          </ul>
        )}
      </div>
      {groupedCardRows && <Card card={selectedCardRows} />}
    </div>
  )
}

type GroupedCardRows = {
  [key: string]: Row[]
}

function getFirstCard(groupedCardRows: GroupedCardRows) {
  return groupedCardRows[_.min(Object.keys(groupedCardRows).map(Number)) as number]
}

function hasCard(selectedSubdeckRows: Row[]) {
  return selectedSubdeckRows[0]['cardOrder'] !== null
}
