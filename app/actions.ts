'use server'
import { revalidatePath } from 'next/cache'
import { kysely } from './db/kysely'

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

export async function addWord(text: string, definition: string) {
  console.log(`addWord: text = ${text}, definition = ${definition}`)
  const addedWord = await kysely
    .insertInto('word')
    .values({ text, definition })
    .returningAll()
    .executeTakeFirstOrThrow()

  return addedWord
}

export async function uploadImage(formData: FormData) {
  console.log('uploadImage: formData = ', formData)
  const file = formData.get('file') as File | null
  console.log('uploadImage: file=', file)
}
