import { useEffect, useRef, useState } from 'react'
import { highlightTargetWords } from './highlightTargetWords'
import { Separator } from '@/components/ui/separator'
import {
  addWord,
  addWordToCard,
  removeWordFromCard,
  replaceWordInCard,
  updateWord,
  uploadWordImage,
} from '@/app/actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit, XSquare } from 'react-feather'
import { CardRow, WordRow, WordRowMode } from './types'
import Image from 'next/image'

type SelectionInfo = { text: string; startIndex: number; endIndex: number; position: { top: number; left: number } }
/*
 * Card is moved to its own file due to its complexity.
 */
export default function Card({ selectedCardRows }: { selectedCardRows: CardRow[] }) {
  console.log('Card: selectedCardRows=', selectedCardRows)
  const { courseId, lessonOrder, cardOrder, cardText } = selectedCardRows[0]

  const [wordRows, setWordRows] = useState<WordRow[]>(
    selectedCardRows.filter((row) => row.wordStartIndex !== null).map((row) => ({ ...row, mode: 'view' })) as WordRow[]
  )
  const [selectionInfo, setSelectionInfo] = useState<SelectionInfo | null>(null)
  const [suggestedWordsVisible, setSuggestedWordsVisible] = useState(false)

  useEffect(() => {
    setWordRows(selectedCardRows.filter((row) => row.wordStartIndex !== null) as WordRow[])
  }, [selectedCardRows])

  return (
    <div className="p-2 w-full flex flex-col items-center gap-3">
      <p
        className="text-center text-lg"
        dangerouslySetInnerHTML={{
          __html: highlightTargetWords(
            cardText,
            selectedCardRows
              .filter((row) => row.wordText !== null)
              .map((row) => ({
                start: row.wordStartIndex as number,
                end: row.wordEndIndex as number,
              }))
          ),
        }}
        /*
         * We want to show suggested words only when the user finishes selecting a text.
         * Therefore, onMouseUp is used instead of onSelectChange.
         */
        onMouseUp={(event) => {
          const paragraph = event.currentTarget
          /*
           * We are using Selection and Range API. Ref: https://javascript.info/selection-range
           */
          const range = window.getSelection()!.getRangeAt(0)
          console.log(`onMouseUp: paragraph=${paragraph}, selection=${range}`)

          /*
           * We need to check for selected text length, to account for the double-click selection.
           * Also, We need to ignore the case where the selection overlaps with a target word.
           */
          if (range.toString().length > 0 && !isOverlappingTargetWord(paragraph, range)) {
            /* The range is extended to select whole words */
            extendSelectionToWordBoundaries(range)
            setSelectionInfo({
              text: range.toString(),
              ...determineSelectionPosition(paragraph, range),
              position: determineSuggestedWordsPosition(range),
            })
            setSuggestedWordsVisible(true)
          }
        }}
      ></p>

      {suggestedWordsVisible && (
        <SuggestedWords
          selectionInfo={selectionInfo!}
          open={suggestedWordsVisible}
          onOpenChange={setSuggestedWordsVisible}
          onSelect={(wordText: string, wordDefinition: string) => {
            addWordToCard(
              courseId,
              lessonOrder,
              cardOrder,
              wordText,
              wordDefinition,
              selectionInfo!.startIndex,
              selectionInfo!.endIndex
            )
            setSuggestedWordsVisible(false)
          }}
          onAddWord={() => {
            setWordRows((previousWordRows) =>
              [
                ...previousWordRows,
                {
                  ...selectedCardRows[0],
                  mode: 'add' as WordRowMode,
                  wordText: selectionInfo!.text,
                  wordDefinition: '',
                  wordStartIndex: selectionInfo!.startIndex,
                  wordEndIndex: selectionInfo!.endIndex,
                },
              ].sort((a, b) => a.wordStartIndex - b.wordStartIndex)
            )
            setSuggestedWordsVisible(false)
          }}
        />
      )}

      <Separator className="w-full h-1 bg-gray-200" />

      {/* List of words */}
      <div className="w-full flex flex-col items-center gap-3">
        {selectedCardRows[0].wordText !== null &&
          wordRows
            .sort((a, b) => (a.wordStartIndex as number) - (b.wordStartIndex as number))
            .map((wordRow, index) => {
              switch (wordRow.mode) {
                case 'add':
                  return (
                    <WordForm
                      key={index}
                      wordRow={wordRow}
                      onSave={async (text: string, definition: string) => {
                        await addWordToCard(
                          courseId,
                          lessonOrder,
                          cardOrder,
                          text,
                          definition,
                          selectionInfo!.startIndex,
                          selectionInfo!.endIndex
                        )
                      }}
                      onCancel={() =>
                        setWordRows(selectedCardRows.filter((row) => row.wordStartIndex !== null) as WordRow[])
                      }
                    />
                  )
                case 'edit':
                  return (
                    <WordForm
                      key={index}
                      wordRow={wordRow}
                      onCancel={() =>
                        setWordRows(selectedCardRows.filter((row) => row.wordStartIndex !== null) as WordRow[])
                      }
                      onSave={async (text: string, definition: string) => {
                        await replaceWordInCard(
                          {
                            courseId,
                            lessonOrder,
                            cardOrder,
                            text: wordRow.wordText,
                            definition: wordRow.wordDefinition,
                          },
                          {
                            courseId,
                            lessonOrder,
                            cardOrder,
                            text,
                            definition,
                            startIndex: wordRow.wordStartIndex,
                            endIndex: wordRow.wordEndIndex,
                          }
                        )
                      }}
                    />
                  )
                default:
                  return (
                    <Word
                      key={index}
                      wordRow={wordRow}
                      onEdit={(wordRow: WordRow) => {
                        setWordRows((previousWordRows) => {
                          previousWordRows[index] = { ...wordRow, mode: 'edit' }
                          return [...previousWordRows]
                        })
                      }}
                    />
                  )
              }
            })}
      </div>
    </div>
  )

  function isOverlappingTargetWord(paragraph: HTMLParagraphElement, range: Range) {
    let isOverlappingTargetWord = false

    /* For each of the target words, there is a <b> node nested within a <p> node. */
    const selectionRect = range.getBoundingClientRect()
    paragraph.querySelectorAll('b').forEach((boldElement) => {
      const targetWordRect = boldElement.getBoundingClientRect()
      if (
        selectionRect.right > targetWordRect.left &&
        selectionRect.left < targetWordRect.right &&
        selectionRect.bottom > targetWordRect.top &&
        selectionRect.top < targetWordRect.bottom
      ) {
        isOverlappingTargetWord = true
      }
    })
    console.log('isOverlappingTargetWord: ', isOverlappingTargetWord)
    return isOverlappingTargetWord
  }

  function extendSelectionToWordBoundaries(range: Range) {
    const textContent = range.commonAncestorContainer.textContent!
    const startOffset = range.startOffset
    const endOffset = range.endOffset
    console.log(
      `extendSelectionToWordBoundaries: textContent=${textContent}, startOffset=${startOffset}, endOffset=${endOffset}`
    )

    // Use regex to extend to word boundaries
    const wordBoundaryRegex = /\w/

    // Move start to the nearest word boundary
    let newStartOffset = startOffset
    console.log(`newStartOffset test: ${wordBoundaryRegex.test(textContent[newStartOffset - 1])}`)
    while (newStartOffset > 0 && wordBoundaryRegex.test(textContent[newStartOffset - 1])) {
      newStartOffset--
    }

    // Move end to the nearest word boundary
    let newEndOffset = endOffset
    while (newEndOffset < textContent.length && wordBoundaryRegex.test(textContent[newEndOffset])) {
      newEndOffset++
    }

    // Adjust the range
    range.setStart(range.startContainer, newStartOffset)
    range.setEnd(range.endContainer, newEndOffset)
  }

  function determineSelectionPosition(paragraph: EventTarget & HTMLParagraphElement, range: Range) {
    /*
     * We traverse the paragragh's child nodes to find the start/end indices of the selection, and the word order.
     * If the child node is not the startContainer, we add the text length of the node to the startIndex and endIndex,and increment wordOrder.
     * If the child node is the startContainer, we add the startOffset to the startIndex and endOffset to endIndex, and stop the loop.
     * We only care about the startContainer, and not the endContainer, because in practice, only Firefox allows to select multiple ranges.
     */
    const childNodes = paragraph.childNodes
    console.log('childNodes: ', childNodes.values())
    // const range = selection.getRangeAt(0)
    // console.log('range: ', range)
    const startContainer = range.startContainer
    console.log('startContainer: ', startContainer)
    const startOffset = range.startOffset
    console.log('startOffset: ', startOffset)
    const endOffset = range.endOffset
    console.log('endOffset: ', endOffset)

    let startIndex = 0
    let endIndex = 0

    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i]
      /*
       * If the child node is not the startContainer, we add the text length of the node to the startIndex and endIndex,and increment wordOrder.
       * If the child node is the startContainer, we add the startOffset to the startIndex and endOffset to endIndex, and stop the loop.
       * We only care about the startContainer, and not the endContainer, because there won't be overlaps with any target words.
       */
      if (childNode !== startContainer) {
        startIndex += childNode.textContent!.length
        endIndex += childNode.textContent!.length
      } else {
        startIndex += startOffset
        endIndex += endOffset
        break
      }
    }

    console.log(`selectionPosition: startIndex = ${startIndex}, endIndex = ${endIndex}`)
    return { startIndex, endIndex }
  }

  function determineSuggestedWordsPosition(range: Range) {
    // const range = selection.getRangeAt(0)
    const boundingClientRect = range.getBoundingClientRect()
    console.log('boundingClientRect: ', boundingClientRect)
    return {
      top: boundingClientRect.bottom + window.scrollY,
      left: boundingClientRect.left + window.scrollX,
    }
  }
}

function SuggestedWords({
  selectionInfo,
  open,
  onOpenChange,
  onSelect,
  onAddWord,
}: {
  selectionInfo: SelectionInfo
  open: boolean
  onOpenChange: (value: boolean) => void
  onSelect: (wordText: string, wordDefinition: string) => void
  onAddWord: () => void
}) {
  const [suggestedWords, setSuggestedWords] = useState<{ text: string; definition: string }[] | null>(null)

  useEffect(() => {
    fetch(`/api/word/search?query=${encodeURIComponent(selectionInfo.text)}`).then(async (response) => {
      if (response.ok) {
        const suggestedWords = await response.json()
        console.log('suggestedWords: ', suggestedWords)
        setSuggestedWords(suggestedWords)
      } else {
        console.error('Failed to fetch suggestions')
      }
    })
  }, [selectionInfo.text])

  return (
    suggestedWords !== null && (
      <DropdownMenu open={open} onOpenChange={onOpenChange}>
        <DropdownMenuContent className={`fixed bg-primary-50 border border-gray-500`} style={selectionInfo.position}>
          {suggestedWords.map(({ text, definition }, index) => (
            <DropdownMenuItem
              key={index}
              onSelect={() => onSelect(text, definition)}
              className="w-full px-1 py-0 border-solid border-b-2  hover:bg-primary-300"
            >
              <Button variant="ghost" className="px-1 py-0 hover:bg-primary-300">
                <span>{`${text} :: ${definition}`}</span>
              </Button>
            </DropdownMenuItem>
          ))}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="self-start w-20 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
              onClick={() => onAddWord()}
            >
              Add Word
            </Button>
            <Button
              variant="outline"
              className="self-start w-20 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
              onClick={() => onAddWord()}
            >
              See occurrences
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  )
}

function Word({ wordRow, onEdit }: { wordRow: WordRow; onEdit: (wordRow: WordRow) => void }) {
  console.log('Word: wordRow=', wordRow)

  return (
    <div className="w-full grid grid-cols-[1fr_8fr_1fr] items-start">
      <div></div>
      <div className="flex flex-col items-center gap-2">
        <div>
          <span className="font-bold text-primary-600">{wordRow.wordText}</span>
          <span className=""> :: {wordRow.wordDefinition}</span>
        </div>
        {wordRow.wordImageUri && (
          <Image src={wordRow.wordImageUri} alt={wordRow.wordText} width={200} height={100}></Image>
        )}
      </div>
      <div className="flex flex-col">
        <Button variant="ghost" size={'sm'} onClick={() => onEdit(wordRow)}>
          <Edit color="hsl(180, 70%, 40%)" />
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            removeWordFromCard(
              wordRow.courseId,
              wordRow.lessonOrder,
              wordRow.cardOrder,
              wordRow.wordText,
              wordRow.wordDefinition
            )
          }
        >
          <XSquare color="red" />
        </Button>
      </div>
    </div>
  )
}

function WordForm({
  wordRow,
  onSave,
  onCancel,
}: {
  wordRow: WordRow
  onSave: (text: string, definition: string) => void
  onCancel: () => void
}) {
  const textInputRef = useRef<HTMLInputElement>(null)
  const definitionInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [text, setText] = useState(wordRow.wordText.toLowerCase())
  const [definition, setDefinition] = useState(wordRow.wordDefinition.toLowerCase())

  useEffect(() => textInputRef.current!.focus(), [])

  return (
    <form className="flex flex-col gap-3 items-center p-4 border-2 border-violet-900 border-dotted">
      <div className="flex gap-2 items-center">
        <Input
          name="text"
          ref={textInputRef}
          placeholder="word text"
          value={text} //TODO: readonly in edit mode
          onChange={(e) => setText(e.target.value)}
        />
        <span>::</span>
        <Input
          name="definition"
          ref={definitionInputRef}
          placeholder="word definition"
          value={definition}
          onChange={(e) => setDefinition(e.target.value)}
        />
      </div>
      <Input name="file" ref={fileInputRef} type="file" accept="image/*" />
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          className="w-28 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
          onClick={async (event) => {
            event.preventDefault()
            await handleSaveButtonClick()
          }}
        >
          Save
        </Button>
        <Button
          variant="outline"
          className="w-28 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
          onClick={() => onCancel()}
        >
          Cancel
        </Button>
      </div>
    </form>
  )

  async function handleSaveButtonClick() {
    const formData = new FormData()
    formData.append('text', textInputRef.current!.value)
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      formData.append('image', fileInputRef.current?.files![0])
      const imageSrc = await uploadWordImage(formData)
      if (imageSrc) {
        formData.append('imageSrc', imageSrc as string)
      }
    }
    formData.append('definition', definitionInputRef.current!.value)
    if (wordRow.mode === 'add') {
      addWord(formData)
      onSave(text, definition)
    } else {
      const { addedWord } = await updateWord(formData)
      console.log('addedWord: ', addedWord)
      if (addedWord) {
        onSave(addedWord.text, addedWord.definition)
      }
    }
  }
}
