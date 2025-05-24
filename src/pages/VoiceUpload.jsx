import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { ThemeContext } from '../context/ThemeContext'
import { useInView } from '../hooks/useInView'
import AnimatedSection from '../components/AnimatedSection'
import { 
  Upload, 
  User, 
  Calendar, 
  MapPin, 
  FileText, 
  FileAudio, 
  Activity, 
  AlertCircle, 
  CheckCircle,
  Play,
  Pause
} from 'lucide-react'

const VoiceUpload = () => {
  const { theme } = useContext(ThemeContext)
  const { elementRef: headerRef, isInView: headerInView } = useInView()
  const { elementRef: formRef, isInView: formInView } = useInView()
  const { elementRef: visualRef, isInView: visualInView } = useInView()
  
  const [formData, setFormData] = useState({
    caseId: 'CF-2024-001',
    suspectName: 'John Doe',
    dateRecorded: '2024-01-15',
    location: 'Mumbai, India',
    description: 'Fraudulent banking call attempting to steal credentials',
    officerName: 'Inspector Smith',
    voiceFile: null
  })

  const [uploadComplete, setUploadComplete] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  // Generate mock waveform data
  const waveformBars = Array.from({ length: 50 }, () => Math.random() * 100 + 20)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        voiceFile: file
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      setUploadComplete(true)
    }, 3000)
  }

  const features = [
    {
      title: 'Voice Fingerprinting',
      desc: 'Extracting unique vocal characteristics',
      progress: 85
    },
    {
      title: 'Noise Reduction',
      desc: 'Removing background interference',
      progress: 92
    },
    {
      title: 'Quality Enhancement',
      desc: 'Improving audio clarity',
      progress: 78
    },
    {
      title: 'Pattern Analysis',
      desc: 'Identifying speech patterns',
      progress: 95
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={headerInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Voice Sample Upload</h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Upload and process voice samples for fraud investigation</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form with scroll animation */}
        <motion.div
          ref={formRef}
          initial={{ opacity: 0, x: -50 }}
          animate={formInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
          transition={{ duration: 0.6 }}
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-8`}
        >
          <div className="flex items-center mb-6">
            <Upload className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Upload Details</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <User size={16} className="mr-2" />
                  Case ID
                </label>
                <input
                  type="text"
                  name="caseId"
                  value={formData.caseId}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                />
              </div>

              <div>
                <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <User size={16} className="mr-2" />
                  Suspect Name
                </label>
                <input
                  type="text"
                  name="suspectName"
                  value={formData.suspectName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                />
              </div>

              <div>
                <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <Calendar size={16} className="mr-2" />
                  Date Recorded
                </label>
                <input
                  type="date"
                  name="dateRecorded"
                  value={formData.dateRecorded}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                />
              </div>

              <div>
                <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                  <MapPin size={16} className="mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all`}
                />
              </div>
            </div>

            <div>
              <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <FileText size={16} className="mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none`}
              />
            </div>

            {/* File Upload */}
            <div>
              <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <FileAudio size={16} className="mr-2" />
                Audio File
              </label>
              <div className={`border-2 border-dashed ${theme === 'dark' ? 'border-gray-600 hover:border-purple-400' : 'border-gray-300 hover:border-purple-400'} rounded-lg p-8 text-center transition-colors`}>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className={`mx-auto w-16 h-16 ${theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-full flex items-center justify-center mb-4`}>
                    <Upload className={`h-8 w-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                  </div>
                  <p className={`text-lg font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}>Drop your audio file here</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>or click to browse</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'} mt-2`}>Supports MP3, WAV, M4A up to 50MB</p>
                </label>
              </div>
            </div>

            {/* Success Message */}
            {uploadComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`${theme === 'dark' ? 'bg-green-900/50 border-green-700' : 'bg-green-50 border-green-200'} border rounded-lg p-4`}
              >
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className={`${theme === 'dark' ? 'text-green-400' : 'text-green-800'} font-medium`}>
                    Voice sample uploaded and processed successfully!
                  </span>
                </div>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={!formData.voiceFile || isUploading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                'Upload & Process'
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Audio Visualization with scroll animation */}
        <motion.div
          ref={visualRef}
          initial={{ opacity: 0, x: 50 }}
          animate={visualInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          {/* Audio Player */}
          <div className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-8`}>
            <div className="flex items-center mb-6">
              <Activity className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
              <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Audio Preview</h2>
            </div>

            {formData.voiceFile ? (
              <div className="space-y-6">
                {/* Waveform Visualization */}
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-6`}>
                  <div className="flex items-end justify-center space-x-1 h-32">
                    {waveformBars.map((height, index) => (
                      <motion.div
                        key={index}
                        className="bg-purple-500 rounded-t"
                        style={{ 
                          width: '4px',
                          height: `${height}px`,
                        }}
                        animate={visualInView && isPlaying ? {
                          height: [`${height}px`, `${height * 1.5}px`, `${height}px`]
                        } : { height: `${height}px` }}
                        transition={{
                          duration: 1,
                          repeat: visualInView && isPlaying ? Infinity : 0,
                          delay: index * 0.05
                        }}
                      />
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-center mt-4">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className={`p-3 rounded-full ${theme === 'dark' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-600 hover:bg-purple-700'} text-white transition-colors`}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>
                  </div>
                </div>

                {/* File Info */}
                <div className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4`}>
                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>File Information</h4>
                  <div className={`space-y-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>Name: {formData.voiceFile.name}</p>
                    <p>Size: {(formData.voiceFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    <p>Type: {formData.voiceFile.type}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileAudio className={`h-16 w-16 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-300'} mx-auto mb-4`} />
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Upload an audio file to see waveform preview</p>
              </div>
            )}
          </div>

          {/* Processing Features with scroll animation */}
          <div className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-8`}>
            <div className="flex items-center mb-6">
              <AlertCircle className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
              <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI Processing</h2>
            </div>

            <AnimatedSection animation="fadeLeft" stagger={0.1}>
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4 mb-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h4>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{feature.progress}%</span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>{feature.desc}</p>
                  <div className={`w-full ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'} rounded-full h-2`}>
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${feature.progress}%` }}
                      transition={{ duration: 1.5, delay: index * 0.2 }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatedSection>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VoiceUpload
