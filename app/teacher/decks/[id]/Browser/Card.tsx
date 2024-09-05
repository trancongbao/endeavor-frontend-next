import { FormEvent, useEffect, useRef, useState } from 'react'
import { highlightTargetWords } from './highlightTargetWords'
import { Separator } from '@/components/ui/separator'
import { addWord, addWordToCard, removeWordFromCard } from '@/app/actions'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Edit, Upload, XSquare } from 'react-feather'
import { Row } from '../page'
import Image from 'next/image'
import { FileUpload } from '@/components/file-upload'
import { Label } from '@/components/ui/label'

/*
 * Card is moved to its own file due to its complexity.
 */
export default function Card({ selectedCardRows }: { selectedCardRows: Row[] }) {
  console.log('Card: selectedCardRows=', selectedCardRows)
  const { courseId, lessonOrder, cardOrder } = selectedCardRows[0]

  // TODO: selection state
  const [selectionPosition, setSelectionPosition] = useState({ startIndex: 0, endIndex: 0 })
  const [suggestedWords, setSuggestedWords] = useState([])
  const [suggestedWordsVisible, setSuggestedWordsVisible] = useState(false)
  const [suggestedWordsPosition, setSuggestedWordsPosition] = useState({ top: 0, left: 0 })

  const targetWordPositions = selectedCardRows.map((row) => ({
    start: row.wordStartIndex as number,
    end: row.wordEndIndex as number,
  }))
  console.log('CardFront: targetWordPositions=', targetWordPositions)

  const [isAddingWord, setIsAddingWord] = useState(false)
  const [selectedText, setSelectedText] = useState<string | null>(null)

  return (
    <div className="p-2 w-full flex flex-col items-center gap-3">
      <p
        className="text-center text-lg"
        dangerouslySetInnerHTML={{
          __html: highlightTargetWords(selectedCardRows[0].cardText as string, targetWordPositions),
        }}
        /* TODO: select whole words: select to the nearst whitespaces */
        /*
         * We want to show suggested words only when the user finishes selecting a text.
         * Therefore, onMouseUp is used instead of onSelectChange.
         * Also, we need to check for selected text length, to account for the double-click selection.
         */
        onMouseUp={(event) => {
          const paragraph = event.currentTarget
          const selection = window.getSelection()!
          const selectedText = selection.toString()
          console.log(`onMouseUp: paragraph=${paragraph}, selection=${selection}, selectedText=${selectedText}`)

          /*
           * For each of the target words, there is a <b> node nested within a <p> node.
           * We ignore the case where the selection overlaps with a target word.
           * Ref: https://javascript.info/selection-range
           */
          if (selectedText.length > 0 && !isOverlappingTargetWord(paragraph, selection)) {
            setSelectedText(selectedText)
            fetchSuggestedWords(selectedText)
            setSelectionPosition(determineSelectionPosition(paragraph, selection))
            setSuggestedWordsPosition(determineSuggestedWordsPosition(selection))
            setSuggestedWordsVisible(true)
          }
        }}
      ></p>

      <SuggestedWords
        open={suggestedWordsVisible}
        onOpenChange={setSuggestedWordsVisible}
        position={suggestedWordsPosition}
        suggestedWords={suggestedWords}
        onSelect={(wordText: string, wordDefinition: string) => {
          addWordToCard(
            courseId as number,
            lessonOrder as number,
            cardOrder as number,
            wordText as string,
            wordDefinition as string,
            selectionPosition.startIndex,
            selectionPosition.endIndex
          )
          setSuggestedWordsVisible(false)
        }}
        onAddWord={() => {
          setIsAddingWord(true)
          setSuggestedWordsVisible(false)
        }}
      />

      <Separator className="w-full h-1 bg-gray-200" />

      {/* List of words */}
      <div className="w-full flex flex-col items-center gap-3">
        {selectedCardRows[0].wordText !== null &&
          selectedCardRows.map((wordRow, index) => <Word key={index} wordRow={wordRow} />)}
      </div>

      {isAddingWord && (
        <AddWordForm
          text={selectedText as string}
          onSave={async (text: string, definition: string) => {
            const addedWord = await addWord(text, definition)
            console.log('addedWord: ', addedWord)
            await addWordToCard(
              courseId,
              lessonOrder as number,
              cardOrder as number,
              text,
              definition,
              selectionPosition.startIndex,
              selectionPosition.endIndex
            )
            setIsAddingWord(false)
          }}
          onCancel={() => console.log('cancel')}
        />
      )}
    </div>
  )

  function isOverlappingTargetWord(paragraph: HTMLParagraphElement, selection: Selection) {
    let isOverlappingTargetWord = false

    const selectionRect = selection.getRangeAt(0).getBoundingClientRect()
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

  function determineSelectionPosition(paragraph: EventTarget & HTMLParagraphElement, selection: Selection) {
    /*
     * We traverse the paragragh's child nodes to find the start/end indices of the selection, and the word order.
     * If the child node is not the startContainer, we add the text length of the node to the startIndex and endIndex,and increment wordOrder.
     * If the child node is the startContainer, we add the startOffset to the startIndex and endOffset to endIndex, and stop the loop.
     * We only care about the startContainer, and not the endContainer, because in practice, only Firefox allows to select multiple ranges.
     */
    const childNodes = paragraph.childNodes
    console.log('childNodes: ', childNodes.values())
    const range = selection.getRangeAt(0)
    console.log('range: ', range)
    const startContainer = range.startContainer
    console.log('startContainer: ', startContainer)
    const startOffset = range.startOffset
    console.log('startOffset: ', startOffset)
    const endOffset = range.endOffset
    console.log('endOffset: ', endOffset)

    let wordOrder = 0
    let startIndex = 0
    let endIndex = 0

    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i]
      /*
       * If the child node is not the startContainer, we add the text length of the node to the startIndex and endIndex,and increment wordOrder.
       * If the child node is the startContainer, we add the startOffset to the startIndex and endOffset to endIndex, and stop the loop.
       * We only care about the startContainer, and not the endContainer, because in practice, only Firefox allows to select multiple ranges.
       */
      if (childNode !== startContainer) {
        wordOrder++
        startIndex += childNode.textContent!.length
        endIndex += childNode.textContent!.length
      } else {
        startIndex += startOffset
        endIndex += endOffset
        break
      }
    }

    console.log(`selectionPosition: wordOrder = ${wordOrder}, startIndex = ${startIndex}, endIndex = ${endIndex}`)
    return { wordOrder, startIndex, endIndex }
  }

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

  function determineSuggestedWordsPosition(selection: Selection) {
    const range = selection.getRangeAt(0)
    const boundingClientRect = range.getBoundingClientRect()
    console.log('boundingClientRect: ', boundingClientRect)
    return {
      top: boundingClientRect.bottom + window.scrollY,
      left: boundingClientRect.left + window.scrollX,
    }
  }
}

function SuggestedWords({
  open,
  onOpenChange,
  position,
  suggestedWords,
  onSelect,
  onAddWord,
}: {
  open: boolean
  onOpenChange: (value: boolean) => void
  position: { top: number; left: number }
  suggestedWords: { id: number; text: string; definition: string }[]
  onSelect: (wordText: string, wordDefinition: string) => void
  onAddWord: () => void
}) {
  return (
    <DropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuContent
        className={`fixed bg-white border border-gray-500`}
        style={{ top: position.top, left: position.left }}
      >
        {suggestedWords.map(({ text, definition }, index) => (
          <DropdownMenuItem key={index} onSelect={() => onSelect(text, definition)}>
            <Button variant="ghost" className="flex items-center gap-2">
              <span>{`${text} :: ${definition}`}</span>
            </Button>
          </DropdownMenuItem>
        ))}
        <Button
          variant="outline"
          className="self-start w-20 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
          onClick={() => onAddWord()}
        >
          Add Word
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function Word({ wordRow }: { wordRow: Row }) {
  console.log('Word: wordRow=', wordRow)

  const [isEditingWord, setIsEditingWord] = useState(false)

  return (
    <div className="w-full grid grid-cols-[1fr_8fr_1fr] items-start">
      <div></div>
      <div className="flex flex-col items-center">
        <div>
          <span className="font-bold text-primary-600">{wordRow.wordText}</span>
          <span className=""> :: {wordRow.wordDefinition}</span>
        </div>
        {wordRow.wordImageUri && (
          <Image src={wordRow.wordImageUri} alt={wordRow.wordText as string} width={200} height={100}></Image>
        )}
      </div>
      <div className="flex flex-col">
        <Button variant="ghost" size={'sm'} onClick={() => setIsEditingWord(true)}>
          <Edit />
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            removeWordFromCard(
              wordRow.courseId,
              wordRow.lessonOrder as number,
              wordRow.cardOrder as number,
              wordRow.wordText as string,
              wordRow.wordDefinition as string
            )
          }
        >
          <XSquare />
        </Button>
      </div>
    </div>
  )
}

function AddWordForm({
  text,
  onSave,
  onCancel,
}: {
  text: string
  onSave: (text: string, definition: string) => void
  onCancel: () => void
}) {
  const definitionInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => definitionInputRef.current!.focus(), [])

  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="flex gap-2 items-center">
        <p>{text}</p>
        <span>::</span>
        <Input name="text" ref={definitionInputRef} placeholder="definition" />
      </div>
      <ImageUpload />
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          className="w-28 bg-orange-400  text-white text-md hover:bg-orange-300 hover:text-black py-2 px-4 rounded"
          onClick={() => onSave(text || '', definitionInputRef.current?.value || '')}
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
    </div>
  )
}

const ImageUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState('')

  return (
    <form className="flex gap-2">
      <form onSubmit={handleSubmit}>
        <Input type="file" onChange={handleFileChange} accept="image/*" />
        <Button type="submit">Upload</Button>
      </form>
      {uploadStatus && <p>{uploadStatus}</p>}
    </form>
  )

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log('handleFileChange: event.target.files[0]=', event.target.files![0])
    setSelectedFile(event.target.files![0])
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    console.log(`handleSubmit: selectedFile=${selectedFile}`)
    event.preventDefault()
    if (!selectedFile) {
      setUploadStatus('No file selected')
      return
    }

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (res.ok) {
        setUploadStatus('File uploaded successfully!')
      } else {
        setUploadStatus('File upload failed.')
      }
    } catch (error) {
      console.error('Error uploading the file:', error)
      setUploadStatus('File upload failed.')
    }
  }
}
