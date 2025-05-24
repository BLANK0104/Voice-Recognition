import React, { useState, useContext } from 'react'
import { motion } from 'framer-motion'
import { ThemeContext } from '../context/ThemeContext'
import { 
  Upload, 
  FileAudio, 
  User, 
  Calendar, 
  MapPin, 
  Play, 
  Pause,
  Volume2,
  Activity,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

const VoiceUpload = () => {
  const { theme } = useContext(ThemeContext)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [formData, setFormData] = useState({
    caseId: 'CF-2024-001',
    suspectName: 'John Doe',
    dateRecorded: '2024-01-15',
    location: 'Mumbai, India',
    description: 'Voice sample recorded during fraudulent phone call attempting to steal banking credentials. Caller claimed to be from State Bank and requested OTP verification.',
    voiceFile: { name: 'suspect_voice_sample.mp3', size: 2048000 } // Mock file object
  })

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setFormData(prev => ({ ...prev, voiceFile: file }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadComplete(true)
          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // Mock waveform data
  const waveformBars = Array.from({ length: 50 }, (_, i) => 
    Math.floor(Math.random() * 40) + 10
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>Voice Sample Upload</h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Upload and process voice samples for fraud investigation</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
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
                  placeholder="e.g., CF-2024-001"
                  required
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
                  placeholder="Name or identifier"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  required
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
                  placeholder="Recording location"
                />
              </div>
            </div>

            <div>
              <label className={`flex items-center text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                <FileAudio size={16} className="mr-2" />
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className={`w-full px-4 py-3 border ${theme === 'dark' ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-200 bg-white text-gray-900'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none`}
                placeholder="Additional details about the voice sample..."
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

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isUploading || !formData.voiceFile}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold py-4 px-6 rounded-lg hover:from-primary-700 hover:to-primary-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing... {uploadProgress}%
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <Upload size={20} className="mr-2" />
                  Upload & Analyze
                </div>
              )}
            </motion.button>

            {/* Upload Progress */}
            {isUploading && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div 
                  className="bg-primary-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}

            {/* Success Message */}
            {uploadComplete && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
          </form>
        </motion.div>

        {/* Audio Visualization */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
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
                        className="bg-primary-500 rounded-t"
                        style={{ 
                          width: '4px',
                          height: `${height}px`,
                        }}
                        animate={{
                          height: isPlaying ? [`${height}px`, `${height * 1.5}px`, `${height}px`] : `${height}px`
                        }}
                        transition={{
                          duration: 1,
                          repeat: isPlaying ? Infinity : 0,
                          delay: index * 0.05
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Audio Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-primary-600 text-white p-4 rounded-full hover:bg-primary-700 transition-colors shadow-lg"
                  >
                    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
                  </motion.button>
                  <div className="flex items-center space-x-2">
                    <Volume2 size={20} className="text-gray-600" />
                    <div className="w-32 h-2 bg-gray-200 rounded-full">
                      <div className="w-3/4 h-2 bg-primary-600 rounded-full"></div>
                    </div>
                  </div>
                </div>

                {/* File Info */}
                <div className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4`}>
                  <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}>File Information</h4>
                  <div className={`space-y-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>Duration: 2:34</p>
                    <p>Sample Rate: 44.1 kHz</p>
                    <p>Bit Rate: 320 kbps</p>
                    <p>Format: MP3</p>
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

          {/* Processing Features */}
          <div className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-8`}>
            <div className="flex items-center mb-6">
              <AlertCircle className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
              <h2 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>AI Processing</h2>
            </div>

            <div className="space-y-4">
              {[
                { title: 'Noise Reduction', desc: 'Advanced algorithms remove background noise and enhance voice clarity', progress: 95 },
                { title: 'Voice Fingerprinting', desc: 'Extract unique vocal characteristics for identification', progress: 87 },
                { title: 'Quality Enhancement', desc: 'Improve audio quality for better analysis', progress: 92 },
                { title: 'Metadata Extraction', desc: 'Generate forensic metadata and audio properties', progress: 78 }
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className={`${theme === 'dark' ? 'bg-gray-700/50' : 'bg-white/50'} rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h4>
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{feature.progress}%</span>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3`}>{feature.desc}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-primary-500 to-primary-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${feature.progress}%` }}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VoiceUpload
