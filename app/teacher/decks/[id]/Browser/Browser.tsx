'use client'

import _ from 'lodash'
import CardList from './CardList'
import { useState } from 'react'
import { Row, GroupedSubdeckRows } from '../page'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef, useEffect } from 'react'
import { addSubdeck } from '@/app/actions'
import Subdeck from './Subdeck'

export default function Browser({ deckRows }: { deckRows: Row[] }) {
  const { courseId } = deckRows[0]
  const groupedSubdeckRows: GroupedSubdeckRows = _.groupBy(deckRows, 'lessonOrder')
  console.log('groupedSubdeckRows: ', groupedSubdeckRows)
  /*
   * Subdeck with the lowest order is selected by default.
   */
  const minSubdeckOrder = _.min(Object.keys(groupedSubdeckRows).map(Number)) as number
  /*
   * Using selectedSubdeckRows as state necessitates updating it when deckRows changes, even when selectedSubdeckOrder does not.
   * A example is when a card is added, which changes deckRows, which causes rerendering even though selectedSubdeckOrder stays the same.
   */
  const [selectedSubdeckOrder, setSelectedSubdeckOrder] = useState(minSubdeckOrder)
  console.log('selectedSubdeckOrder: ', selectedSubdeckOrder)

  const [isAddingSubdeck, setIsAddingSubdeck] = useState(false)
  const addSubdeckInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAddingSubdeck && addSubdeckInputRef.current) {
      addSubdeckInputRef.current.focus()
    }
  }, [isAddingSubdeck])

  /*
   * Extract subdeck list to a separate component would introduce tight coupling regarding the state management of selectedSubdeck.
   */
  return (
    <div className="grid grid-cols-[1fr_6fr] grid-rows-[1fr_10fr] gap-2">
      <div className="basis-80 border-r-4 flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {Object.keys(groupedSubdeckRows).map((subdeckOrder) => {
            return (
              <Subdeck
                key={subdeckOrder}
                courseId={courseId}
                subdeckOrder={parseInt(subdeckOrder)}
                subdeckTitle={groupedSubdeckRows[subdeckOrder][0].lessonTitle as string}
                isSelected={parseInt(subdeckOrder) === selectedSubdeckOrder}
                setSelectedSubdeckOrder={setSelectedSubdeckOrder}
              />
            )
          })}
        </div>
        {!isAddingSubdeck && (
          <Button
            variant="outline"
            className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
            onClick={() => setIsAddingSubdeck(true)}
          >
            Add subdeck
          </Button>
        )}
        {/* Use ternery operator */}
        {isAddingSubdeck && (
          <div>
            <form action={addSubdeck} onSubmit={() => setIsAddingSubdeck(false)}>
              <Input type="hidden" name="courseId" value={groupedSubdeckRows[selectedSubdeckOrder][0].courseId} />
              <Input type="hidden" name="order" value={Object.keys(groupedSubdeckRows).length} />
              <Input name="title" ref={addSubdeckInputRef} placeholder="Enter the subdeck title and press Return." />
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

      {/* 
        We want to reset states (selectedCardRows, specifically) in CardList when selectedSubdeckRows changes without using useEffect.
        Ref: https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
        Ref: https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key
      */}
      <CardList key={selectedSubdeckOrder} selectedSubdeckRows={groupedSubdeckRows[selectedSubdeckOrder]} />
    </div>
  )
}
