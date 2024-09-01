import { kysely } from '@/app/db/kysely'
import { sql } from 'kysely'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const response = await kysely
    .selectFrom('word')
    .selectAll()
    .where(sql`to_tsvector(text)`, '@@', sql`to_tsquery(${request.nextUrl.searchParams.get('query')})`)
    .execute()

  return Response.json(response)
}
