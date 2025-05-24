import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import VoiceUpload from './pages/VoiceUpload'
import VoiceMatching from './pages/VoiceMatching'
import VoiceDatabase from './pages/VoiceDatabase'
import Analytics from './pages/Analytics'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e0e7ff' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <Navbar />
          <main className="pt-16 pb-8"> {/* Adjusted padding top to prevent content hiding behind navbar */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<VoiceUpload />} />
              <Route path="/matching" element={<VoiceMatching />} />
              <Route path="/database" element={<VoiceDatabase />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
          <Footer />
        </motion.div>
      </div>
    </Router>
  )
}

export default App
