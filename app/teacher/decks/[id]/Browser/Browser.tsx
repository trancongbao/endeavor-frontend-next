'use client'

import _ from 'lodash'
import { useState } from 'react'
import { Row, GroupedSubdeckRows } from '../page'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRef, useEffect } from 'react'
import { addCard, addSubdeck, deleteCard, deleteSubdeck, editCardText, editSubdeckTitle } from '@/app/actions'
import KebabMenu from './KebabMenu'
import { styleNewWord } from './styleNewWord'
import Toggle from './Toggle'
import Image from 'next/image'
import { Edit, Delete } from 'react-feather'
import { DropdownMenu, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import { DropdownMenuContent } from '@radix-ui/react-dropdown-menu'
import { Separator } from '@/components/ui/separator'

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

  return (
    /*
     * An argubaly more logical approach is to add CardList to Subdeck, and conditionally render it based on a isSelected prop.
     * This approach may reduce coupling, and making state management easier.
     * However, it would require a less straight-forward CSS layout method than `grid`.
     */
    <div className="grid grid-cols-[1fr_6fr] gap-2">
      <SubdeckList
        groupedSubdeckRows={groupedSubdeckRows}
        courseId={courseId}
        selectedSubdeckOrder={selectedSubdeckOrder}
        setSelectedSubdeckOrder={setSelectedSubdeckOrder}
      />

      {/* 
        We want to reset states (selectedCardRows, specifically) in CardList when selectedSubdeckRows changes without using useEffect.
        Ref: https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
        Ref: https://react.dev/learn/preserving-and-resetting-state#option-2-resetting-state-with-a-key
      */}
      <CardTextList key={selectedSubdeckOrder} selectedSubdeckRows={groupedSubdeckRows[selectedSubdeckOrder]} />
    </div>
  )
}

interface SubdecksProps {
  courseId: number
  groupedSubdeckRows: GroupedSubdeckRows
  selectedSubdeckOrder: number
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
  const [isAddingSubdeck, setIsAddingSubdeck] = useState(false)

  return (
    <div className="basis-80 border-r-4 flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {Object.keys(groupedSubdeckRows).map((subdeckOrder) => {
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
      {!isAddingSubdeck ? (
        <AddSubdeckButton setIsAddingSubdeck={setIsAddingSubdeck} />
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

function AddSubdeckButton({
  setIsAddingSubdeck,
}: {
  setIsAddingSubdeck: React.Dispatch<React.SetStateAction<boolean>>
}) {
  return (
    <Button
      variant="outline"
      className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
      onClick={() => setIsAddingSubdeck(true)}
    >
      Add subdeck
    </Button>
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
              { id: 'edit', label: 'Edit', icon: <Edit />, onSelect: (id) => setIsEditingSubdeckTitle(true) },
              {
                id: 'delete',
                label: 'Delete',
                icon: <Delete />,
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

/*
 * TODO: Determine if data rows should be passed down the tree or only the necessary data.
 * This requires experience working with many-to-many relationships, for example card-word.
 */
function CardTextList({ selectedSubdeckRows }: { selectedSubdeckRows: Row[] }) {
  const { courseId, lessonOrder } = selectedSubdeckRows[0]
  console.log('CardList: selectedSubdeckRows = ', selectedSubdeckRows)
  console.log('CardList: hasCard = ', hasCard(selectedSubdeckRows))
  const groupedCardRows = hasCard(selectedSubdeckRows) ? _.groupBy(selectedSubdeckRows, 'cardOrder') : undefined
  console.log('CardList: groupedCardRows = ', groupedCardRows)
  /*
   * Using selectedCardRows as state necessitates updating it when deckRows changes, even when selectedCardOrder does not.
   * An example is when a card is added, which changes deckRows, which causes rerendering even though selectedCardOrder stays the same.
   */
  const [selectedCardOrder, setSelectedCardOrder] = useState(
    groupedCardRows ? getFirstCardOrder(groupedCardRows) : undefined
  )
  console.log('CardList: selectedCardOrder = ', selectedCardOrder)

  const [isAddingCard, setIsAddingCard] = useState(false)

  return (
    <div className="grid grid-cols-[1fr_2fr]">
      <div className="border-r-4">
        {/*
         * Card list is defined inline here, as extracting it to a separate component would introduce tight coupling regarding the state management of selectedCardRows.
         */}
        {groupedCardRows && (
          <ul className="flex flex-col gap-2">
            {Object.keys(groupedCardRows).map((cardOrder) => (
              <CardTextListItem
                key={cardOrder}
                cardText={groupedCardRows[cardOrder][0].cardText as string}
                isSelected={selectedCardOrder === parseInt(cardOrder)}
                onClick={() => setSelectedCardOrder(parseInt(cardOrder))}
                deleteCard={() => deleteCard(courseId, lessonOrder as number, parseInt(cardOrder))}
                editCardText={(newCardText: string) => {
                  editCardText(courseId, lessonOrder as number, parseInt(cardOrder), newCardText)
                }}
              />
            ))}
          </ul>
        )}
        {!isAddingCard ? (
          <AddCardButton setIsAddingCard={setIsAddingCard} />
        ) : (
          <AddCardForm
            courseId={courseId}
            lessonOrder={lessonOrder as number}
            order={groupedCardRows ? Object.keys(groupedCardRows).length : 0}
            setIsAddingCard={setIsAddingCard}
          />
        )}
      </div>
      {selectedCardOrder !== undefined && <Card selectedCardRows={groupedCardRows![selectedCardOrder]} />}
    </div>
  )
}

type GroupedCardRows = {
  [key: string]: Row[]
}

function getFirstCardOrder(groupedCardRows: GroupedCardRows) {
  return _.min(Object.keys(groupedCardRows).map(Number)) as number
}

function hasCard(selectedSubdeckRows: Row[]) {
  return selectedSubdeckRows[0]['cardOrder'] !== null
}

interface CardTextListItemProps {
  cardText: string
  isSelected: boolean
  onClick: () => void
  deleteCard: () => void
  editCardText: (newCardText: string) => void
}

function CardTextListItem({ cardText, isSelected, onClick, deleteCard, editCardText }: CardTextListItemProps) {
  const [isEditingCardText, setIsEditingCardText] = useState(false)

  return (
    <div>
      {!isEditingCardText ? (
        <li
          className={`p-2 rounded cursor-pointer ${isSelected ? 'bg-orange-200' : 'hover:bg-orange-100'} flex justify-between gap-2`}
        >
          {/* onClick is not put in <li> to prevent the card list item from being selected upon kebab menu option being clicked. */}
          <p
            onClick={() => onClick()}
            dangerouslySetInnerHTML={{
              __html: styleNewWord(cardText as string),
            }}
          ></p>
          <KebabMenu
            menuOptions={[
              {
                id: 'edit',
                label: 'Edit',
                icon: <Edit />,
                onSelect: (id) => setIsEditingCardText(true),
              },
              {
                id: 'delete',
                label: 'Delete',
                icon: <Delete />,
                onSelect: (id) => deleteCard(),
              },
            ]}
          />
        </li>
      ) : (
        <EditCardTextForm
          currentCardText={cardText}
          setIsEditingCardText={setIsEditingCardText}
          editCardText={(newCardText: string) => editCardText(newCardText)}
        />
      )}
    </div>
  )
}

function AddCardButton({ setIsAddingCard }: { setIsAddingCard: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <Button
      variant="outline"
      className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
      onClick={() => setIsAddingCard(true)}
    >
      Add card
    </Button>
  )
}

interface AddCardFormProps {
  courseId: string | number
  lessonOrder: number
  order: number
  setIsAddingCard: (value: boolean) => void
}

function AddCardForm({ courseId, lessonOrder, order, setIsAddingCard }: AddCardFormProps) {
  const cardTextInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => cardTextInputRef.current!.focus(), [])

  return (
    <div>
      <form action={addCard} onSubmit={() => setIsAddingCard(false)}>
        <Input type="hidden" name="courseId" value={courseId} />
        <Input type="hidden" name="lessonOrder" value={lessonOrder as number} />
        <Input type="hidden" name="order" value={order} />
        <Input name="text" ref={cardTextInputRef} placeholder="Enter the card text and press Return." />
      </form>
      <Button
        variant="outline"
        className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
        onClick={() => setIsAddingCard(false)}
      >
        Cancel
      </Button>
    </div>
  )
}

interface EditCardTextFormProps {
  currentCardText: string
  setIsEditingCardText: (isEditing: boolean) => void
  editCardText: (text: string) => void
}

function EditCardTextForm({ currentCardText, setIsEditingCardText, editCardText }: EditCardTextFormProps) {
  const cardTextInputRef = useRef<HTMLInputElement>(null)
  const [newCardText, setNewCardText] = useState(currentCardText)

  useEffect(() => cardTextInputRef.current!.focus())

  return (
    <div className="flex">
      <form
        onSubmit={() => {
          setIsEditingCardText(false)
          editCardText(newCardText)
        }}
        className="flex-1"
      >
        <Input
          name="title"
          ref={cardTextInputRef}
          value={newCardText}
          onChange={(e) => setNewCardText(e.target.value)}
        />
      </form>
      <Button
        variant="outline"
        className="w-20 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
        onClick={() => setIsEditingCardText(false)}
      >
        Cancel
      </Button>
    </div>
  )
}

//TODO: use start and end indices to denote new words
function Card({ selectedCardRows }: { selectedCardRows: Row[] }) {
  console.log('selectedCardRows: ', selectedCardRows)

  return (
    <div className="p-2 w-full flex flex-col items-center gap-3">
      <CardFront cardText={selectedCardRows[0].cardText as string} />
      <Separator className="w-full h-1 bg-gray-200" />
      <CardBack selectedCardRows={selectedCardRows} />
    </div>
  )
}

function CardFront({ cardText }: { cardText: string }) {
  const [suggestedWords, setSuggestedWords] = useState([])
  const [suggestedWordsVisible, setSuggestedWordsVisible] = useState(false)
  const [suggestedWordsPosition, setSuggestedWordsPosition] = useState({ top: 0, left: 0 })

  return (
    <div>
      <p
        className="text-center text-lg"
        dangerouslySetInnerHTML={{
          __html: styleNewWord(cardText as string),
        }}
        /* TODO: select whole words: select to the nearst whitespaces */
        onMouseUp={(e) => {
          const selection = window.getSelection()
          console.log('selection: ', selection)
          if (selection !== null) {
            const selectedText = selection.toString()
            if (selectedText.length > 0) {
              const range = selection?.getRangeAt(0)
              console.log('range: ', range)
              const boundingClientRect = range.getBoundingClientRect()
              console.log('boundingClientRect: ', boundingClientRect)
              console.log('selected text: ', selectedText)
              fetchSuggestedWords(selectedText)
              setSuggestedWordsPosition({
                top: boundingClientRect.bottom + window.scrollY,
                left: boundingClientRect.left + window.scrollX,
              })
              setSuggestedWordsVisible(true)
            }
          }
        }}
      ></p>

      <SuggestedWords
        open={suggestedWordsVisible}
        onOpenChange={setSuggestedWordsVisible}
        position={suggestedWordsPosition}
        suggestedWords={suggestedWords}
        onSelect={(id: number) => console.log('suggested word selected: ', id)}
      />
    </div>
  )

  async function fetchSuggestedWords(selectedText: string) {
    try {
      const response = await fetch(`/api/word/search?query=${encodeURIComponent(selectedText)}`)

      if (response.ok) {
        const suggestedWords = await response.json()
        console.log('suggestedWords: ', suggestedWords)
        setSuggestedWords(suggestedWords)
      } else {
        console.error('Failed to fetch suggestions')
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }
}

function CardBack({ selectedCardRows }: { selectedCardRows: Row[] }) {
  const [isAddingWord, setIsAddingWord] = useState(false)

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {selectedCardRows.map((word, index) => (
        <Word key={index} word={word} />
      ))}
      {!isAddingWord ? (
        <Button
          variant="outline"
          className="self-start w-20 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
          onClick={() => setIsAddingWord(true)}
        >
          Add Word
        </Button>
      ) : (
        <div>Word Form</div>
      )}
    </div>
  )
}

function Word({ word }: { word: Row }) {
  return (
    <div className="flex flex-col items-center">
      <div>
        <span className="font-bold text-primary-600">{word.wordText}</span>
        <span className=""> :: {word.wordDefinition}</span>
      </div>
      {word.wordImageUri && (
        <Image src={word.wordImageUri} alt={word.wordText as string} width={200} height={100}></Image>
      )}
    </div>
  )
}

function SuggestedWords({
  open,
  onOpenChange,
  position,
  suggestedWords,
  onSelect,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  position: { top: number; left: number }
  suggestedWords: { id: number; text: string; definition: string }[]
  onSelect: (id: number) => void
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuContent
        className={`fixed bg-white border border-gray-500`}
        style={{ top: position.top, left: position.left }}
      >
        {suggestedWords.map(({ id, text, definition }, index) => (
          <DropdownMenuItem key={index} onSelect={() => onSelect(id)}>
            <Button variant="ghost" className="flex items-center gap-2">
              <span>{`${text} :: ${definition}`}</span>
            </Button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface AddWordFormProps {
  courseId: string | number
  lessonOrder: number
  order: number
  setIsAddingCard: (value: boolean) => void
}

function AddWordForm({ courseId, lessonOrder, order, setIsAddingCard }: AddCardFormProps) {
  const cardTextInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => cardTextInputRef.current!.focus(), [])

  return (
    <div>
      <form action={addCard} onSubmit={() => setIsAddingCard(false)}>
        <Input type="hidden" name="courseId" value={courseId} />
        <Input type="hidden" name="lessonOrder" value={lessonOrder as number} />
        <Input type="hidden" name="order" value={order} />
        <Input name="text" ref={cardTextInputRef} placeholder="Enter the card text and press Return." />
      </form>
      <Button
        variant="outline"
        className="w-36 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
        onClick={() => setIsAddingCard(false)}
      >
        Cancel
      </Button>
    </div>
  )
}
