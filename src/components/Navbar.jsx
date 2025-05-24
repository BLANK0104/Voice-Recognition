import React, { useState, useContext } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Mic, 
  Search, 
  Database, 
  BarChart3, 
  Menu, 
  X,
  Zap,
  Sun,
  Moon
} from 'lucide-react'
import { ThemeContext } from '../context/ThemeContext'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useContext(ThemeContext)

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Shield },
    { path: '/upload', label: 'Voice Upload', icon: Mic },
    { path: '/matching', label: 'Voice Matching', icon: Search },
    { path: '/database', label: 'Database', icon: Database },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  ]

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 ${
        theme === 'dark' 
          ? 'bg-gray-900/90 border-gray-700/50' 
          : 'bg-white/90 border-purple-200/50'
      } backdrop-blur-lg border-b`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="flex items-center space-x-3"
            >
              <div className="relative">
                <Zap className={`h-8 w-8 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                <div className={`absolute inset-0 ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-600'} opacity-20 blur-lg rounded-full`}></div>
              </div>
              <div>
                <h1 className={`text-xl font-bold ${theme === 'dark' ? 'text-purple-300' : 'text-purple-800'}`}>VRS</h1>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Voice Recognition System</p>
              </div>
            </motion.div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path
              return (
                <motion.div key={path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to={path}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `${theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'} shadow-lg`
                        : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800 hover:text-purple-400' : 'text-gray-700 hover:bg-purple-50 hover:text-purple-600'}`
                    }`}
                  >
                    <Icon size={18} />
                    <span className="font-medium">{label}</span>
                  </Link>
                </motion.div>
              )
            })}
            
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg ml-2 transition-all duration-200 ${
                theme === 'dark' 
                  ? 'text-yellow-400 hover:bg-gray-800 hover:text-yellow-300' 
                  : 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
              }`}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-yellow-400 hover:bg-gray-800' 
                  : 'text-purple-600 hover:bg-purple-50'
              }`}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </motion.button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' 
                  ? 'text-gray-300 hover:bg-gray-800' 
                  : 'text-gray-700 hover:bg-purple-50'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className={`md:hidden ${
            theme === 'dark' 
              ? 'bg-gray-900/95 border-gray-700/50' 
              : 'bg-white/95 border-purple-200/50'
          } backdrop-blur-lg border-t`}
        >
          <div className="px-4 py-2 space-y-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path
              return (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? `${theme === 'dark' ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'}`
                      : `${theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-purple-50'}`
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{label}</span>
                </Link>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}

export default Navbar

{}
<style>
  {`
    body {
      padding-top: 4rem; /* Adjust based on your navbar height */
    }
  `}
</style>
