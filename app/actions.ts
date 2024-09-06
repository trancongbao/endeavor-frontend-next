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

export async function uploadWordImage(formData: FormData): Promise<string | undefined> {
  const text = formData.get('text') as string
  const image = formData.get('image') as File
  console.log(`uploadWordImage: text=${text} image=${image}`)
  const uploadDir = path.join(process.cwd(), 'public', 'words')

  // Ensure the uploads directory exists
  await fs.mkdir(uploadDir, { recursive: true })

  const uniqueFilename = await generateUniqueFilename(uploadDir, text, path.parse(image.name).ext)

  // Save the file
  try {
    await fs.writeFile(path.join(uploadDir, uniqueFilename), new Uint8Array(await image.arrayBuffer()))
    return uniqueFilename
  } catch (error) {
    console.error('Error uploading the file:', error)
    return undefined
  }

  // Helper function to generate a unique file name by adding a suffix if needed
  async function generateUniqueFilename(uploadDir: string, fileName: string, fileExtension: string): Promise<string> {
    let counter = 1
    let uniqueFilename = `${fileName}${fileExtension}`

    // Check if the file already exists
    while (await fileExists(path.join(uploadDir, uniqueFilename))) {
      // Add a suffix (e.g., _2, _3) if a file with the same name exists
      counter++
      uniqueFilename = `${fileName}_${counter}${fileExtension}`
    }
    return uniqueFilename
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

export async function addWord(text: string, definition: string, imageFilename: string | undefined) {
  console.log(`addWord: text=${text}, definition=${definition}, imageFilename=${imageFilename}`)
  const addedWord = await kysely
    .insertInto('word')
    .values({
      text,
      definition,
      image_uri: `/world/${imageFilename}`,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  revalidatePath('/teacher/decks/[id]', 'page')
  return addedWord
}
