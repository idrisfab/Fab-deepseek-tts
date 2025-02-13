import { Deepgram } from '@deepgram/sdk'

export async function POST(req: Request) {
  const { text, voice, rate } = await req.json()
  
  try {
    const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY)
    
    const response = await deepgram.speak.request(
      { text },
      {
        model: voice,
        encoding: 'mp3',
        container: 'mp3',
        rate: rate
      }
    )

    if (!response) {
      throw new Error('Failed to generate audio')
    }

    const stream = await response.getStream()
    const blob = await stream.blob()
    
    return new Response(blob, {
      headers: {
        'Content-Type': 'audio/mpeg',
      }
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    )
  }
}
