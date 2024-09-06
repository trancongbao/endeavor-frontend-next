'use server'
import { revalidatePath } from 'next/cache'
import { kysely } from './db/kysely'
import path from 'path'
import { promises as fs } from 'fs'

export async function addSubdeck(formData: FormData) {
  const addedSubdeck = await kysely
    .insertInto('lesson')
    .values({
      course_id: parseInt(formData.get('courseId') as string),
      order: parseInt(formData.get('order') as string),
      title: formData.get('title') as string,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  console.log('Added subdeck: ', addedSubdeck)
  revalidatePath('/teacher/decks/[id]', 'page')
}

export async function deleteSubdeck(courseId: number, subdeckOrder: number) {
  console.log(`deleteSubdeck: courseId = ${courseId}, subdeckOrder = ${subdeckOrder}`)
  const deletedSubdeck = await kysely
    .deleteFrom('lesson')
    .where('course_id', '=', courseId)
    .where('order', '=', subdeckOrder)
    .returningAll()
    .executeTakeFirstOrThrow()
  console.log('Deleted subdeck: ', deletedSubdeck)
  revalidatePath('/teacher/decks/[id]', 'page')
  //TODO: Delete all cards in the subdeck
}

export async function editSubdeckTitle(courseId: number, subdeckOrder: number, newSubdeckTitle: string) {
  console.log('editSubdeckTitle: courseId = ', courseId)
  const updatedSubdeck = await kysely
    .updateTable('lesson')
    .where('course_id', '=', courseId)
    .where('order', '=', subdeckOrder)
    .set({
      title: newSubdeckTitle,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
  console.log('Updated subdeck: ', updatedSubdeck)
  revalidatePath('/teacher/decks/[id]', 'page')
}

export async function addCard(formData: FormData) {
  console.log('addCard: formData = ', formData)
  const addedCard = await kysely
    .insertInto('card')
    .values({
      course_id: parseInt(formData.get('courseId') as string),
      lesson_order: parseInt(formData.get('lessonOrder') as string),
      order: parseInt(formData.get('order') as string),
      text: formData.get('text') as string,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  console.log('Added card: ', addedCard)
  revalidatePath('/teacher/decks/[id]', 'page')
}

export async function deleteCard(courseId: number, subdeckOrder: number, cardOrder: number) {
  console.log(`deleteCard: courseId = ${courseId}, subdeckOrder = ${subdeckOrder}, cardOrder = ${cardOrder}`)
  const deletedSubdeck = await kysely
    .deleteFrom('card')
    .where('course_id', '=', courseId)
    .where('lesson_order', '=', subdeckOrder)
    .where('order', '=', cardOrder)
    .returningAll()
    .executeTakeFirstOrThrow()
  console.log('Deleted subdeck: ', deletedSubdeck)
  revalidatePath('/teacher/decks/[id]', 'page')
}

export async function editCardText(courseId: number, subdeckOrder: number, cardOrder: number, newCardText: string) {
  console.log('editCardText: courseId = ', courseId)
  const updatedCard = await kysely
    .updateTable('card')
    .where('course_id', '=', courseId)
    .where('lesson_order', '=', subdeckOrder)
    .where('order', '=', cardOrder)
    .set({
      text: newCardText,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
  console.log('Updated card: ', updatedCard)
  revalidatePath('/teacher/decks/[id]', 'page')
}

export async function addWordToCard(
  courseId: number,
  lessonOrder: number,
  cardOrder: number,
  wordText: string,
  wordDefinition: string,
  startIndex: number,
  endIndex: number
) {
  console.log(
    `addWordToCard: courseId = ${courseId}, lessonOrder = ${lessonOrder}, cardOrder = ${cardOrder}, wordText = ${wordText}, wordDefinition = ${wordDefinition}, startIndex = ${startIndex}, endIndex = ${endIndex}`
  )
  const addedCardWord = await kysely
    .insertInto('card_word')
    .values({
      course_id: courseId,
      lesson_order: lessonOrder,
      card_order: cardOrder,
      word_text: wordText,
      word_definition: wordDefinition,
      start_index: startIndex,
      end_index: endIndex,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
  console.log('Added card word: ', addedCardWord)
  revalidatePath('/teacher/decks/[id]', 'page')
}

export async function removeWordFromCard(
  courseId: number,
  lessonOrder: number,
  cardOrder: number,
  wordText: string,
  wordDefinition: string
) {
  console.log(
    `removeWordFromCard: courseId = ${courseId}, lessonOrder = ${lessonOrder}, cardOrder = ${cardOrder}, wordText = ${wordText}, wordDefinition = ${wordDefinition}`
  )
  const deletedCardWord = await kysely
    .deleteFrom('card_word')
    .where('course_id', '=', courseId)
    .where('lesson_order', '=', lessonOrder)
    .where('card_order', '=', cardOrder)
    .where('word_text', '=', wordText)
    .where('word_definition', '=', wordDefinition)
    .returningAll()
    .executeTakeFirstOrThrow()
  console.log('Deleted card word: ', deletedCardWord)
  revalidatePath('/teacher/decks/[id]', 'page')
}

export async function addWord(formData: FormData) {
  console.log(`addWord: formData = ${formData}`)
  const addedWord = await kysely
    .insertInto('word')
    .values({
      text: formData.get('text') as string,
      definition: formData.get('definition') as string,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  const file = formData.get('file') as File | null
  console.log('uploadImage: file=', file)

  if (!file) {
    return 'No file selected'
  }

  const uploadDir = path.join(process.cwd(), 'public', 'words')

  // Ensure the uploads directory exists
  await fs.mkdir(uploadDir, { recursive: true })

  // Save the file
  try {
    await fs.writeFile(
      await generateUniqueFilePath(uploadDir, formData.get('text') as string, path.parse(file.name).ext),
      new Uint8Array(await file.arrayBuffer())
    )
    return 'File uploaded successfully!'
  } catch (error) {
    console.error('Error uploading the file:', error)
    return 'File upload failed.'
  }

  // Helper function to generate a unique file name by adding a suffix if needed
  async function generateUniqueFilePath(uploadDir: string, fileName: string, fileExtension: string): Promise<string> {
    let counter = 1
    let uniqueFilePath = path.join(uploadDir, `${fileName}${fileExtension}`)

    // Check if the file already exists
    while (await fileExists(uniqueFilePath)) {
      // Add a suffix (e.g., _2, _3) if a file with the same name exists
      uniqueFilePath = path.join(uploadDir, `${fileName}_${counter}${fileExtension}`)
      counter++
    }

    return uniqueFilePath
  }

  // Check if a file exists
  async function fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath)
      return true
    } catch (error) {
      return false // File does not exist
    }
  }
}
