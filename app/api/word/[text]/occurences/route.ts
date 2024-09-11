import { kysely } from '@/app/db/kysely'
import { sql } from 'kysely'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { text: string } }) {
  console.log('params: ', params)
  const response = await kysely
    .selectFrom('lesson')
    .select(
      sql`ts_headline('english', content, to_tsquery(${params.text}), 'StartSel=<b>, StopSel=</b> ShortWord=0 MinWords=19 MaxWords=20')`.as(
        'snippet'
      )
    )
    .where(sql`to_tsvector(content)`, '@@', sql`to_tsquery(${params.text})`)
    .execute()

  console.log('response: ', response)
  return Response.json(response)
}
