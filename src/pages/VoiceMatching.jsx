import React, { useState, useContext } from 'react'
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
import { ThemeContext } from '../context/ThemeContext'
import { useInView } from '../hooks/useInView'
import AnimatedSection from '../components/AnimatedSection'

const VoiceMatching = () => {
  const { theme } = useContext(ThemeContext)
  const { elementRef: resultsRef, isInView: resultsInView } = useInView()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  const mockResults = [
    { 
      id: 'VRS-001', 
      name: 'Rajesh Kumar', 
      similarity: 94.2, 
      caseId: 'CF-2024-001', 
      status: 'High Match',
      location: 'Mumbai, Maharashtra',
      lastSeen: '2024-01-15',
      confidence: 'Very High',
      phoneNumber: '+91-98765-43210',
      age: 34,
      occupation: 'Former Bank Employee'
    },
    { 
      id: 'VRS-045', 
      name: 'Amit Sharma', 
      similarity: 87.8, 
      caseId: 'CF-2024-012', 
      status: 'Good Match',
      location: 'Delhi, NCR',
      lastSeen: '2024-01-18',
      confidence: 'High',
      phoneNumber: '+91-87654-32109',
      age: 28,
      occupation: 'Call Center Operator'
    },
    { 
      id: 'VRS-123', 
      name: 'Priya Mehta', 
      similarity: 82.3, 
      caseId: 'CF-2023-089', 
      status: 'Good Match',
      location: 'Bangalore, Karnataka',
      lastSeen: '2023-12-10',
      confidence: 'High',
      phoneNumber: '+91-76543-21098',
      age: 31,
      occupation: 'Telemarketing Executive'
    },
    { 
      id: 'VRS-267', 
      name: 'Suresh Patel', 
      similarity: 76.9, 
      caseId: 'CF-2024-003', 
      status: 'Moderate Match',
      location: 'Chennai, Tamil Nadu',
      lastSeen: '2024-01-05',
      confidence: 'Medium',
      phoneNumber: '+91-65432-10987',
      age: 42,
      occupation: 'Insurance Agent'
    },
    { 
      id: 'VRS-189', 
      name: 'Vikram Singh', 
      similarity: 71.5, 
      caseId: 'CF-2023-156', 
      status: 'Moderate Match',
      location: 'Pune, Maharashtra',
      lastSeen: '2023-11-22',
      confidence: 'Medium',
      phoneNumber: '+91-54321-09876',
      age: 36,
      occupation: 'Real Estate Broker'
    },
    { 
      id: 'VRS-298', 
      name: 'Deepak Gupta', 
      similarity: 68.1, 
      caseId: 'CF-2024-007', 
      status: 'Low Match',
      location: 'Kolkata, West Bengal',
      lastSeen: '2024-01-12',
      confidence: 'Low',
      phoneNumber: '+91-43210-98765',
      age: 39,
      occupation: 'Sales Representative'
    },
  ]

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    setSelectedFile(file)
  }

  // Add hardcoded file simulation
  const simulateFileUpload = (fileName) => {
    const mockFile = new File([''], fileName, { type: 'audio/mp3' })
    setSelectedFile(mockFile)
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

  const getMatchColor = (similarity) => {
    if (similarity >= 90) return { bg: 'bg-red-500', text: 'text-red-600', border: 'border-red-200' }
    if (similarity >= 80) return { bg: 'bg-orange-500', text: 'text-orange-600', border: 'border-orange-200' }
    if (similarity >= 70) return { bg: 'bg-yellow-500', text: 'text-yellow-600', border: 'border-yellow-200' }
    return { bg: 'bg-green-500', text: 'text-green-600', border: 'border-green-200' }
  }

  const getConfidenceIcon = (confidence) => {
    switch(confidence) {
      case 'Very High': return '🔴'
      case 'High': return '🟠'
      case 'Medium': return '🟡'
      default: return '🟢'
    }
  }

  const handleViewDetails = (result) => {
    alert(`Viewing details for ${result.name}\n\nSimilarity: ${result.similarity}%\nCase ID: ${result.caseId}\nLocation: ${result.location}\nPhone: ${result.phoneNumber}\nOccupation: ${result.occupation}`)
  }

  const handleExport = (result) => {
    const reportData = {
      timestamp: new Date().toISOString(),
      testSample: selectedFile?.name || 'Unknown',
      matchedSuspect: result.name,
      similarity: result.similarity,
      confidence: result.confidence,
      caseId: result.caseId,
      location: result.location,
      phoneNumber: result.phoneNumber,
      age: result.age,
      occupation: result.occupation
    }
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `voice_match_report_${result.id}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Voice Matching & Analysis</h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Compare voice samples against the database using AI-powered analysis</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-8 mb-8`}
      >
        <div className="flex items-center mb-6">
          <Target className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
          <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upload Test Sample</h2>
        </div>

        {/* Quick Test Buttons */}
        <div className="mb-6">
          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>Quick Test with Sample Files:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => simulateFileUpload('suspect_voice_high_match.mp3')}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm hover:bg-red-200 transition-colors"
            >
              High Match Sample
            </button>
            <button
              onClick={() => simulateFileUpload('suspect_voice_medium_match.mp3')}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors"
            >
              Medium Match Sample
            </button>
            <button
              onClick={() => simulateFileUpload('suspect_voice_low_match.mp3')}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors"
            >
              Low Match Sample
            </button>
          </div>
        </div>

        <div className={`border-2 border-dashed ${theme === 'dark' ? 'border-gray-600 hover:border-purple-400' : 'border-gray-300 hover:border-purple-400'} rounded-lg p-8 text-center transition-colors mb-6`}>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="test-file-upload"
          />
          <label htmlFor="test-file-upload" className="cursor-pointer">
            <div className={`mx-auto w-16 h-16 ${theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-full flex items-center justify-center mb-4`}>
              <Upload className={`h-8 w-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
            </div>
            <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>Upload test voice sample</p>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Drop your audio file here or click to browse</p>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>Or use quick test buttons above</p>
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

      {/* Analysis Progress */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-8 mb-8`}
          >
            <div className="text-center">
              <div className={`mx-auto w-20 h-20 ${theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-full flex items-center justify-center mb-6`}>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Search className="h-10 w-10 text-primary-600" />
                </motion.div>
              </div>
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>Analyzing Voice Sample</h3>
              <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-6`}>Processing voice fingerprint and comparing against database...</p>
              
              <div className="max-w-md mx-auto">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Processing...</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 2.5 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {showResults && (
        <motion.div
          ref={resultsRef}
          initial={{ opacity: 0, y: 50 }}
          animate={resultsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-8`}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <BarChart3 className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
              <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Matching Results</h2>
            </div>
            <div className={`flex items-center space-x-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <span>Found {mockResults.length} potential matches</span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          <div className={`${theme === 'dark' ? 'bg-blue-900/50 border-blue-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-4 mb-6`}>
            <p className={`${theme === 'dark' ? 'text-blue-300' : 'text-blue-800'}`}>
              <strong>Analysis Complete:</strong> Voice sample "{selectedFile?.name}" processed successfully. 
              Results are sorted by similarity score and confidence level.
            </p>
          </div>

          <AnimatedSection animation="slideUp" stagger={0.1} className="space-y-4">
            {mockResults.map((result, index) => {
              const colors = getMatchColor(result.similarity)
              return (
                <motion.div
                  key={result.id}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white'} rounded-lg border-l-4 ${colors.border} p-6 shadow-sm hover:shadow-md transition-all duration-200`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                            {result.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{result.name}</h3>
                            <p className="text-gray-600">ID: {result.id} • Case: {result.caseId}</p>
                            <p className="text-sm text-gray-500">Age: {result.age} • {result.occupation}</p>
                          </div>
                        </div>
                        <div className="ml-auto flex items-center space-x-2">
                          <span className="text-2xl">{getConfidenceIcon(result.confidence)}</span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.text} bg-opacity-10`} style={{ backgroundColor: `${colors.bg.replace('bg-', '')}20` }}>
                            {result.status}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          {result.location}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar size={16} className="mr-2" />
                          Last seen: {result.lastSeen}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <User size={16} className="mr-2" />
                          Phone: {result.phoneNumber}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-3xl font-bold text-gray-900">{result.similarity}%</div>
                          <div className="text-sm text-gray-600">
                            <p>Voice Similarity</p>
                            <p className="text-xs">Confidence: {result.confidence}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:space-x-2 min-w-0">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleViewDetails(result)}
                            className="bg-primary-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-primary-700 transition-colors flex items-center justify-center whitespace-nowrap"
                          >
                            <Eye size={14} className="mr-1" />
                            <span className="hidden sm:inline">View Details</span>
                            <span className="sm:hidden">View</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleExport(result)}
                            className="bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-700 transition-colors flex items-center justify-center whitespace-nowrap"
                          >
                            <Download size={14} className="mr-1" />
                            <span className="hidden sm:inline">Export</span>
                            <span className="sm:hidden">Export</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatedSection>
        </motion.div>
      )}
    </div>
  )
}

export default VoiceMatching
