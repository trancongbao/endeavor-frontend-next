'use server'
import { kysely } from './db/kysely'

export async function addSubdeck(formData: FormData) {
  console.log('addSubdeck: ', formData.get('title') as string)

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
}
