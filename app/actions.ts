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
  revalidatePath('/teacher/decks/[id]')
}

export async function addCard(formData: FormData) {
  console.log('addCard: formData = ', formData)
}
