import { useState } from 'react'
import { Mic, Download, Sun, Moon } from 'lucide-react'

interface TTSFormProps {
  darkMode: boolean
  toggleDarkMode: () => void
}

export default function TTSForm({ darkMode, toggleDarkMode }: TTSFormProps) {
  const [text, setText] = useState('')
  const [voice, setVoice] = useState('aura-asteria-en')
  const [rate, setRate] = useState(1.0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [audioUrl, setAudioUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (text.length < 10 || text.length > 5000) {
      setError('Text must be between 10 and 5000 characters')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          rate
        })
      })

      if (!response.ok) throw new Error('Failed to generate audio')
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setAudioUrl(url)
    } catch (err) {
      setError(err.message || 'Failed to generate audio')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Text-to-Speech Generator</h1>
        <button 
          onClick={toggleDarkMode}
          className="p-2 rounded-full hover:bg-opacity-20"
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 font-medium">Voice</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value)}
              className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600"
            >
              <option value="aura-asteria-en">Female (Asteria)</option>
              <option value="aura-luna-en">Female (Luna)</option>
              <option value="aura-stella-en">Male (Stella)</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Speech Rate</label>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-sm">{rate}x</span>
          </div>
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Generating...' : (
            <>
              <Mic className="inline-block mr-2" />
              Generate Audio
            </>
          )}
        </button>
      </form>

      {audioUrl && (
        <div className="mt-6 space-y-4">
          <audio controls src={audioUrl} className="w-full" />
          <a
            href={audioUrl}
            download="generated-audio.mp3"
            className="block w-full bg-green-500 text-white p-3 rounded-lg text-center hover:bg-green-600"
          >
            <Download className="inline-block mr-2" />
            Download Audio
          </a>
        </div>
      )}

      <footer className="mt-8 text-center text-sm text-gray-500">
        Powered by <a href="https://developers.deepgram.com/docs/text-to-speech" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Deepgram TTS API</a>
      </footer>
    </div>
  )
}
