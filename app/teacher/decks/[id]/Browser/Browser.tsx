'use client'

import _ from 'lodash'
import CardList from './CardList'
import { useState } from 'react'
import { Row, GroupedSubdeckRows } from '../page'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef, useEffect } from 'react'
import { addSubdeck, deleteSubdeck, editSubdeckTitle } from '@/app/actions'
import Menu from './Menu'

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
   * An example is when a card is added, which changes deckRows, which causes rerendering even though selectedSubdeckOrder stays the same.
   */
  const [selectedSubdeckOrder, setSelectedSubdeckOrder] = useState(minSubdeckOrder)
  console.log('selectedSubdeckOrder: ', selectedSubdeckOrder)

  const [isAddingSubdeck, setIsAddingSubdeck] = useState(false)

  /*
   * Extract subdeck list to a separate component would introduce tight coupling regarding the state management of selectedSubdeck.
   */
  return (
    <div className="grid grid-cols-[1fr_6fr] grid-rows-[1fr_10fr] gap-2">
      <Subdecks
        groupedSubdeckRows={groupedSubdeckRows}
        courseId={courseId}
        selectedSubdeckOrder={selectedSubdeckOrder}
        setSelectedSubdeckOrder={selectedSubdeckOrder}
        isAddingSubdeck={isAddingSubdeck}
        setIsAddingSubdeck={setIsAddingSubdeck}
      />

      {/* 
        We want to reset states (selectedCardRows, specifically) in CardList when selectedSubdeckRows changes without using useEffect.
        Ref: https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
        Ref: https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key
      */}
      <CardList key={selectedSubdeckOrder} selectedSubdeckRows={groupedSubdeckRows[selectedSubdeckOrder]} />
    </div>
  )
}

function Subdecks({
  groupedSubdeckRows,
  courseId,
  setSelectedSubdeckOrder,
  selectedSubdeckOrder,
  isAddingSubdeck,
  setIsAddingSubdeck,
}) {
  return (
    <div className="basis-80 border-r-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {Object.keys(groupedSubdeckRows).map((subdeckOrder) => {
          return (
            <div
              key={subdeckOrder}
              className={`${parseInt(subdeckOrder) === selectedSubdeckOrder ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
            >
              <Subdeck
                courseId={courseId}
                subdeckOrder={parseInt(subdeckOrder)}
                subdeckTitle={groupedSubdeckRows[subdeckOrder][0].lessonTitle as string}
                setSelectedSubdeckOrder={setSelectedSubdeckOrder}
              />
            </div>
          )
        })}
      </div>
      {!isAddingSubdeck ? (
        <Button
          variant="outline"
          className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
          onClick={() => setIsAddingSubdeck(true)}
        >
          Add subdeck
        </Button>
      ) : (
        <AddSubdeckForm
          courseId={courseId}
          order={Object.keys(groupedSubdeckRows).length}
          setIsAddingSubdeck={setIsAddingSubdeck}
        />
      )}
    </div>
  )
}

interface SubdeckProps {
  courseId: number
  subdeckOrder: number
  subdeckTitle: string
  setSelectedSubdeckOrder: (order: number) => void
}

function Subdeck({ courseId, subdeckOrder, subdeckTitle, setSelectedSubdeckOrder }: SubdeckProps) {
  const [isEditingSubdeckTitle, setIsEditingSubdeckTitle] = useState(false)
  const editSubdeckTitileInputRef = useRef<HTMLInputElement>(null)
  const [newSubdeckTitle, setNewSubdeckTitle] = useState(subdeckTitle)

  useEffect(() => {
    if (isEditingSubdeckTitle && editSubdeckTitileInputRef.current) {
      editSubdeckTitileInputRef.current.focus()
    }
  }, [isEditingSubdeckTitle])

  return (
    <div>
      {!isEditingSubdeckTitle ? (
        <div className={`m-1 rounded flex justify-between items-center`}>
          <p onClick={() => setSelectedSubdeckOrder(subdeckOrder)} className="flex-1 cursor-pointer p-2 rounded">
            {subdeckTitle}
          </p>
          <Menu onSelect={onSelect} />
        </div>
      ) : (
        <div className="flex">
          <form action={editSubdeckTitle} onSubmit={() => setIsEditingSubdeckTitle(false)} className="flex-1">
            <Input type="hidden" name="courseId" value={courseId} />
            <Input type="hidden" name="order" value={subdeckOrder} />
            <Input
              name="title"
              ref={editSubdeckTitileInputRef}
              value={newSubdeckTitle}
              onChange={(e) => setNewSubdeckTitle(e.target.value)}
            />
          </form>
          <Button
            variant="outline"
            className="w-20 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
            onClick={() => {
              setIsEditingSubdeckTitle(false)
              setNewSubdeckTitle(subdeckTitle)
            }}
          >
            Cancel
          </Button>
        </div>
      )}
    </div>
  )

  function onSelect(action: 'edit' | 'delete') {
    console.log('onSelect: ', action)
    switch (action) {
      case 'edit':
        setIsEditingSubdeckTitle(true)
        break
      case 'delete':
        deleteSubdeck(courseId, subdeckOrder)
        break
      default:
        break
    }
  }
}

interface AddSubdeckFormProps {
  courseId: number
  order: number
  setIsAddingSubdeck: React.Dispatch<React.SetStateAction<boolean>>
}

function AddSubdeckForm({ courseId, order, setIsAddingSubdeck }: AddSubdeckFormProps) {
  const addSubdeckInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => addSubdeckInputRef.current!.focus(), [])

  return (
    <div>
      <form action={addSubdeck} onSubmit={() => setIsAddingSubdeck(false)}>
        <Input type="hidden" name="courseId" value={courseId} />
        <Input type="hidden" name="order" value={order} />
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
  )
}
