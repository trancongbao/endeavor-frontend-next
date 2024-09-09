'use client'

import _ from 'lodash'
import { useState } from 'react'
import { DeckRow, GroupedSubdeckRows } from '../page'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef, useEffect } from 'react'
import { addSubdeck, deleteSubdeck, editSubdeckTitle } from '@/app/actions'
import KebabMenu from './KebabMenu'
import { Edit, XSquare } from 'react-feather'
import CardList from './CardList'

export default function Browser({ deckRows }: { deckRows: DeckRow[] }) {
  console.log('Browser: deckRows = ', deckRows)
  const { courseId } = deckRows[0]
  const groupedSubdeckRows: GroupedSubdeckRows | undefined = hasSubdeck(deckRows)
    ? _.groupBy(deckRows, 'lessonOrder')
    : undefined
  console.log('Browser: groupedSubdeckRows = ', groupedSubdeckRows)

  /*
   * Using selectedSubdeckRows as state necessitates updating it when deckRows changes, even when selectedSubdeckOrder does not.
   * An example is when a card is added, which changes deckRows, which causes rerendering even though selectedSubdeckOrder stays the same.
   * Subdeck with the lowest order is selected by default.
   */
  const [selectedSubdeckOrder, setSelectedSubdeckOrder] = useState(
    hasSubdeck(deckRows) ? (_.min(Object.keys(groupedSubdeckRows!).map(Number)) as number) : undefined
  )
  const [isAddingSubdeck, setIsAddingSubdeck] = useState(false)

  return (
    /*
     * An argubaly more logical approach is to add CardList to Subdeck, and conditionally render it based on a isSelected prop.
     * This approach may reduce coupling, and making state management easier.
     * However, it would require a less straight-forward CSS layout method than `grid`.
     */
    <div className="grid grid-cols-[1fr_6fr] gap-2">
      <div className="border-r-4 flex flex-col">
        <SubdeckList
          groupedSubdeckRows={groupedSubdeckRows}
          courseId={courseId}
          selectedSubdeckOrder={selectedSubdeckOrder}
          setSelectedSubdeckOrder={setSelectedSubdeckOrder}
        />

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
            order={groupedSubdeckRows ? Object.keys(groupedSubdeckRows).length : 0}
            setIsAddingSubdeck={setIsAddingSubdeck}
          />
        )}
      </div>

      {/* 
        We want to reset states (selectedCardRows, specifically) in CardList when selectedSubdeckRows changes without using useEffect.
        Ref: https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
        Ref: https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key
      */}
      {groupedSubdeckRows !== undefined && selectedSubdeckOrder !== undefined && (
        <CardList key={selectedSubdeckOrder} selectedSubdeckRows={groupedSubdeckRows[selectedSubdeckOrder as number]} />
      )}
    </div>
  )

  function hasSubdeck(deckRows: DeckRow[]) {
    return deckRows[0].lessonOrder !== null
  }
}

interface SubdecksProps {
  courseId: number
  groupedSubdeckRows: GroupedSubdeckRows | undefined
  selectedSubdeckOrder: number | undefined
  setSelectedSubdeckOrder: (order: number) => void
}

/*
 * Operations on Cards are traversed as well as authorized via Subdeck.
 * Operations on Subdeck, in turn, are traversed as well as authorized via Course.
 * One approach is to pass Course Id and Lesson Order down the tree to the component where the operations are executed.
 * Another approach is to treat Course as an aggregate root (DDD), and operations are called back the tree.
 * We decided to used the latter approach.
 */
function SubdeckList({ groupedSubdeckRows, courseId, selectedSubdeckOrder, setSelectedSubdeckOrder }: SubdecksProps) {
  return (
    <div className="flex flex-col gap-2">
      {groupedSubdeckRows &&
        Object.keys(groupedSubdeckRows).map((subdeckOrder) => {
          return (
            <div
              key={subdeckOrder}
              className={`${parseInt(subdeckOrder) === selectedSubdeckOrder ? 'bg-orange-200' : 'hover:bg-orange-100'}`}
            >
              <SubdeckListItem
                subdeckOrder={parseInt(subdeckOrder)}
                subdeckTitle={groupedSubdeckRows[subdeckOrder][0].lessonTitle as string}
                setSelectedSubdeckOrder={setSelectedSubdeckOrder}
                editSubdeckTitle={(subdeckOrder, newSubdeckTitle) =>
                  editSubdeckTitle(courseId, subdeckOrder, newSubdeckTitle)
                }
                deleteSubdeck={(order) => deleteSubdeck(courseId, order)}
              />
            </div>
          )
        })}
    </div>
  )
}

interface SubdeckProps {
  subdeckOrder: number
  subdeckTitle: string
  setSelectedSubdeckOrder: (order: number) => void
  editSubdeckTitle: (subdeckOrder: number, newSubdeckTitle: string) => void
  deleteSubdeck: (subdeckOrder: number) => void
}

function SubdeckListItem({
  subdeckOrder,
  subdeckTitle,
  setSelectedSubdeckOrder,
  editSubdeckTitle,
  deleteSubdeck,
}: SubdeckProps) {
  const [isEditingSubdeckTitle, setIsEditingSubdeckTitle] = useState(false)

  return (
    <div>
      {!isEditingSubdeckTitle ? (
        <div className={`m-1 rounded flex justify-between items-center`}>
          <p onClick={() => setSelectedSubdeckOrder(subdeckOrder)} className="flex-1 cursor-pointer p-2 rounded">
            {subdeckTitle}
          </p>
          <KebabMenu
            menuOptions={[
              {
                id: 'edit',
                label: 'Edit',
                icon: <Edit color="hsl(180, 70%, 50%)" />,
                onSelect: (id) => setIsEditingSubdeckTitle(true),
              },
              {
                id: 'delete',
                label: 'Delete',
                icon: <XSquare color="red" />,
                onSelect: (id) => deleteSubdeck(subdeckOrder),
              },
            ]}
          />
        </div>
      ) : (
        <EditSubdeckTitleForm
          currentSubdeckTitle={subdeckTitle}
          setIsEditingSubdeckTitle={setIsEditingSubdeckTitle}
          editSubdeckTitle={(newSubdeckTitle: string) => editSubdeckTitle(subdeckOrder, newSubdeckTitle)}
        />
      )}
    </div>
  )
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

interface EditSubdeckTitleFormProps {
  currentSubdeckTitle: string
  setIsEditingSubdeckTitle: (isEditing: boolean) => void
  editSubdeckTitle: (title: string) => void
}

function EditSubdeckTitleForm({
  currentSubdeckTitle,
  setIsEditingSubdeckTitle,
  editSubdeckTitle,
}: EditSubdeckTitleFormProps) {
  const editSubdeckTitleInputRef = useRef<HTMLInputElement>(null)
  const [newSubdeckTitle, setNewSubdeckTitle] = useState(currentSubdeckTitle)

  useEffect(() => editSubdeckTitleInputRef.current!.focus())

  return (
    <div className="flex">
      <form
        onSubmit={() => {
          setIsEditingSubdeckTitle(false)
          editSubdeckTitle(newSubdeckTitle)
        }}
        className="flex-1"
      >
        <Input
          name="title"
          ref={editSubdeckTitleInputRef}
          value={newSubdeckTitle}
          onChange={(e) => setNewSubdeckTitle(e.target.value)}
        />
      </form>
      <Button
        variant="outline"
        className="w-20 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
        onClick={() => setIsEditingSubdeckTitle(false)}
      >
        Cancel
      </Button>
    </div>
  )
}
