import express from 'express'
import { Deepgram } from '@deepgram/sdk'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(express.json())

const deepgram = new Deepgram(process.env.DEEPGRAM_API_KEY)

app.post('/api/tts', async (req, res) => {
  const { text, voice, rate } = req.body

  try {
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

    res.setHeader('Content-Type', 'audio/mpeg')
    res.send(blob)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const port = process.env.PORT || 5173
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
