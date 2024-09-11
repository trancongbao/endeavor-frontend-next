import { kysely } from '@/app/db/kysely'
import { sql } from 'kysely'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest, { params }: { params: { text: string } }) {
  console.log('params: ', params)
  const response = await kysely
    .selectFrom('lesson')
    .selectAll()
    .where(sql`to_tsvector(content)`, '@@', sql`to_tsquery(${params.text})`)
    .execute()

  return Response.json(response)
}
