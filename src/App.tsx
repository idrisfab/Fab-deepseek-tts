import { useState } from 'react'
import TTSForm from './components/TTSForm'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gradient-to-b from-gray-900 to-gray-800' : 'bg-gradient-to-b from-white to-blue-100'}`}>
      <TTSForm darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
    </div>
  )
}

export default App
