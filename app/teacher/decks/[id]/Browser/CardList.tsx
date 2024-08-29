'use client'
import { useRef, useState } from 'react'
import _ from 'lodash'
import { styleNewWord } from './styleNewWord'
import Card from './Card/Card'
import { Row } from '../page'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { addCard } from '@/app/actions'

export default function CardList({ selectedSubdeckRows }: { selectedSubdeckRows: Row[] }) {
  console.log('CardList: selectedSubdeckRows = ', selectedSubdeckRows)
  const groupedCardRows = hasCard(selectedSubdeckRows) ? _.groupBy(selectedSubdeckRows, 'cardOrder') : undefined
  console.log('CardList: groupedCardRows = ', groupedCardRows)
  const [selectedCardRows, setSelectedCardRows] = useState<Row[]>(groupedCardRows ? getFirstCard(groupedCardRows) : [])

  const [isAddingCard, setIsAddingCard] = useState(false)
  const addCardTextInputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="grid grid-cols-[1fr_2fr]">
      <div className="border-r-4">
        {/*
         * Card list is defined inline here, as extracting it to a separate component would introduce tight coupling regarding the state management of selectedCardRows.
         */}
        {groupedCardRows && (
          <ul className="flex flex-col gap-2">
            {Object.keys(groupedCardRows).map((cardOrder) => (
              <li
                className={`p-2 rounded cursor-pointer ${selectedCardRows.length > 0 && selectedCardRows[0].cardOrder === parseInt(cardOrder) ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
                key={cardOrder}
                onClick={() => setSelectedCardRows(groupedCardRows[cardOrder])}
                dangerouslySetInnerHTML={{
                  __html: styleNewWord(groupedCardRows[cardOrder][0].cardText as string),
                }}
              ></li>
            ))}
          </ul>
        )}
        {!isAddingCard && (
          <Button
            variant="outline"
            className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
            onClick={() => setIsAddingCard(true)}
          >
            Add card
          </Button>
        )}
        {isAddingCard && (
          <div>
            <form action={addCard} onSubmit={() => setIsAddingCard(false)}>
              <Input type="hidden" name="courseId" value={selectedSubdeckRows[0].courseId} />
              <Input type="hidden" name="lessonOrder" value={selectedSubdeckRows[0].lessonOrder as number} />
              <Input type="hidden" name="order" value={groupedCardRows ? Object.keys(groupedCardRows).length : 0} />
              <Input name="text" ref={addCardTextInputRef} placeholder="Enter the card text and press Return." />
            </form>
            <Button
              variant="outline"
              className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
              onClick={() => setIsAddingCard(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      {selectedCardRows.length > 0 && <Card selectedCardRows={selectedCardRows} />}
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
