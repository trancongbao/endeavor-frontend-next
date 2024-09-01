import { type NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')

  return Response.json([
    {
      id: 1,
      text: 'text',
      definition: 'definition',
      phonetic: 'phonetic',
      part_of_speech: 'part_of_speech',
      audio_uri: 'audio_uri',
      image_uri: 'image_uri',
    },
  ])
}
