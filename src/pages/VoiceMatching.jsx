import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Upload, 
  FileAudio, 
  Target,
  Zap,
  User,
  Calendar,
  MapPin,
  BarChart3,
  Play,
  Eye,
  Download
} from 'lucide-react'

const VoiceMatching = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const mockResults = [
    { 
      id: 'VRS-001', 
      name: 'Suspect Alpha', 
      similarity: 94.2, 
      caseId: 'CF-2024-001', 
      status: 'High Match',
      location: 'Mumbai, India',
      lastSeen: '2024-01-15',
      confidence: 'Very High'
    },
    { 
      id: 'VRS-045', 
      name: 'Suspect Beta', 
      similarity: 87.8, 
      caseId: 'CF-2024-012', 
      status: 'Good Match',
      location: 'Delhi, India',
      lastSeen: '2024-01-18',
      confidence: 'High'
    },
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
  }

  const handleAnalyze = () => {
    if (!selectedFile) return
    
    setIsAnalyzing(true)
    setShowResults(false)
    
    setTimeout(() => {
      setIsAnalyzing(false)
      setShowResults(true)
    }, 3000)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Voice Matching & Analysis</h1>
        <p className="text-xl text-gray-600">Compare voice samples against the database using AI-powered analysis</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-xl p-8 mb-8"
      >
        <div className="flex items-center mb-6">
          <Target className="h-6 w-6 text-primary-600 mr-3" />
          <h2 className="text-2xl font-semibold text-gray-900">Upload Test Sample</h2>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-400 transition-colors mb-6">
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="test-file-upload"
          />
          <label htmlFor="test-file-upload" className="cursor-pointer">
            <div className="mx-auto w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <Upload className="h-8 w-8 text-primary-600" />
            </div>
            <p className="text-lg font-medium text-gray-900 mb-1">Upload test voice sample</p>
            <p className="text-gray-500">Drop your audio file here or click to browse</p>
          </label>
        </div>

        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileAudio className="h-5 w-5 text-green-600 mr-2" />
                <div>
                  <p className="text-green-800 font-medium">{selectedFile.name}</p>
                  <p className="text-green-600 text-sm">Ready for analysis</p>
                </div>
              </div>
              <Play className="h-5 w-5 text-green-600" />
            </div>
          </motion.div>
        )}

        <motion.button
          onClick={handleAnalyze}
          disabled={!selectedFile || isAnalyzing}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          {isAnalyzing ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Analyzing Voice Pattern...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Search size={20} className="mr-2" />
              Analyze & Match
            </div>
          )}
        </motion.button>
      </motion.div>

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-xl p-8"
        >
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Matching Results</h2>
          </div>

          <div className="space-y-4">
            {mockResults.map((result, index) => (
              <motion.div
                key={result.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border-l-4 border-red-200 p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
                    <p className="text-gray-600">ID: {result.id} • Case: {result.caseId}</p>
                    <p className="text-sm text-gray-500 mt-1">Similarity: {result.similarity}%</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 rounded-full text-sm font-medium text-red-600 bg-red-100">
                      {result.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default VoiceMatching
