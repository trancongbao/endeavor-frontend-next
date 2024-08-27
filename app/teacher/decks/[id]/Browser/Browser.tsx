'use client'

import _ from 'lodash'
import CardList from './CardList'
import { useState } from 'react'
import { Row, SubdeckRows } from '../page'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef, useEffect } from 'react'
import { addSubdeck } from '@/app/actions'

export default function Browser({ subdeckRows }: { subdeckRows: SubdeckRows }) {
  /*
   * Subdeck with the lowest order is selected by default.
   */
  const [selectedSubdeck, setSelectedSubdeck] = useState(
    subdeckRows[_.min(Object.keys(subdeckRows).map(Number)) as number]
  )

  const [isAddingSubdeck, setIsAddingSubdeck] = useState(false)
  const addSubdeckInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAddingSubdeck && addSubdeckInputRef.current) {
      addSubdeckInputRef.current.focus()
    }
  }, [isAddingSubdeck])

  console.log('subdeckRows: ', subdeckRows)
  /*
   * Extract subdeck list to a separate component would introduce tight coupling regarding the state management of selectedSubdeck.
   */
  return (
    <div className="grid grid-cols-[1fr_6fr] grid-rows-[1fr_10fr] gap-4">
      <div className="basis-80 border-r-4 flex flex-col gap-4">
        <div className="flex flex-col gap-4">
          {Object.keys(subdeckRows).map((subdeckOrder) => {
            return (
              <p
                key={subdeckOrder}
                onClick={() => setSelectedSubdeck(subdeckRows[subdeckOrder])}
                className={`hover:bg-orange-100 ${selectedSubdeck[0].lessonOrder === parseInt(subdeckOrder) ? 'bg-orange-200' : ''} cursor-pointer p-2 rounded`}
              >{`${subdeckRows[subdeckOrder][0].lessonTitle}`}</p>
            )
          })}
        </div>
        {!isAddingSubdeck && (
          <Button
            variant="outline"
            className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
            onClick={() => setIsAddingSubdeck(true)}
          >
            Add Subdeck
          </Button>
        )}
        {isAddingSubdeck && (
          <div>
            <form action={addSubdeck} onSubmit={() => setIsAddingSubdeck(false)}>
              <Input ref={addSubdeckInputRef} placeholder="Enter the subdeck title and press Return." />
            </form>
            <Button
              variant="outline"
              className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
              onClick={() => setIsAddingSubdeck(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      <CardList cards={_.groupBy(selectedSubdeck, 'cardOrder')} />
    </div>
  )
}

export type Cards = {
  [key: string]: Row[]
}
