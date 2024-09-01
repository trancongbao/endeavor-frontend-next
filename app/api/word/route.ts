import { kysely } from '@/app/db/kysely'
import { sql } from 'kysely'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  const response = await kysely
    .selectFrom('word')
    .selectAll()
    .where(sql`to_tsvector(word)`, '@@', sql`to_tsquery(${query})`)
    .execute()

  console.log('response: ', response)

  return Response.json([
    {
      id: 1,
      text: 'word1',
      definition: 'definition',
      phonetic: 'phonetic',
      part_of_speech: 'part_of_speech',
      audio_uri: 'audio_uri',
      image_uri: 'image_uri',
    },
    {
      id: 1,
      text: 'word2',
      definition: 'definition',
      phonetic: 'phonetic',
      part_of_speech: 'part_of_speech',
      audio_uri: 'audio_uri',
      image_uri: 'image_uri',
    },
  ])
}
