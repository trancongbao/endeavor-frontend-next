import { useEffect, useRef, useState } from 'react'
import { DeckRow } from '../page'
import { addCard, deleteCard, editCardText } from '@/app/actions'
import { highlightTargetWords } from './highlightTargetWords'
import KebabMenu from './KebabMenu'
import { Edit, XSquare } from 'react-feather'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Card from './Card'
import _ from 'lodash'

/*
 * CardList is moved to its own file due to its complexity.
 */
export default function CardList({ selectedSubdeckRows }: { selectedSubdeckRows: DeckRow[] }) {
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
                targetWordPositions={groupedCardRows[cardOrder].map((row) => ({
                  start: row.wordStartIndex as number,
                  end: row.wordEndIndex as number,
                }))}
                isSelected={selectedCardOrder === parseInt(cardOrder)}
                onClick={() => setSelectedCardOrder(parseInt(cardOrder))}
                deleteCard={() => {
                  if (parseInt(cardOrder) === selectedCardOrder) {
                    if (selectedCardOrder === getFirstCardOrder(groupedCardRows)) {
                      setSelectedCardOrder(getFirstCardOrder(groupedCardRows) + 1)
                    } else {
                      setSelectedCardOrder(getFirstCardOrder(groupedCardRows))
                    }
                  }
                  deleteCard(courseId, lessonOrder as number, parseInt(cardOrder))
                }}
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
  [key: string]: DeckRow[]
}

function getFirstCardOrder(groupedCardRows: GroupedCardRows) {
  return _.min(Object.keys(groupedCardRows).map(Number)) as number
}

function hasCard(selectedSubdeckRows: DeckRow[]) {
  return selectedSubdeckRows[0]['cardOrder'] !== null
}

interface CardTextListItemProps {
  cardText: string
  targetWordPositions: { start: number; end: number }[]
  isSelected: boolean
  onClick: () => void
  deleteCard: () => void
  editCardText: (newCardText: string) => void
}

function CardTextListItem({
  cardText,
  targetWordPositions,
  isSelected,
  onClick,
  deleteCard,
  editCardText,
}: CardTextListItemProps) {
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
              __html: highlightTargetWords(cardText as string, targetWordPositions),
            }}
          ></p>
          <KebabMenu
            menuOptions={[
              {
                id: 'edit',
                label: 'Edit',
                icon: <Edit color="hsl(180, 70%, 50%)" />,
                onSelect: (id) => setIsEditingCardText(true),
              },
              {
                id: 'delete',
                label: 'Delete',
                icon: <XSquare color="red" />,
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
