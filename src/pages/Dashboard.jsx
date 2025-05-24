import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  FileAudio, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp,
  Activity,
  Shield,
  Zap,
  BarChart3
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { ThemeContext } from '../context/ThemeContext'

const Dashboard = () => {
  const { theme } = useContext(ThemeContext)
  
  const stats = [
    { icon: Users, label: 'Suspects in Database', value: '247', change: '+12%', color: 'from-blue-500 to-blue-600' },
    { icon: FileAudio, label: 'Voice Samples', value: '1,428', change: '+8%', color: 'from-green-500 to-green-600' },
    { icon: CheckCircle, label: 'Successful Matches', value: '89', change: '+24%', color: 'from-purple-500 to-purple-600' },
    { icon: AlertTriangle, label: 'Pending Analysis', value: '23', change: '-5%', color: 'from-orange-500 to-orange-600' },
  ]

  const chartData = [
    { name: 'Jan', matches: 12, samples: 45 },
    { name: 'Feb', matches: 19, samples: 52 },
    { name: 'Mar', matches: 15, samples: 38 },
    { name: 'Apr', matches: 22, samples: 67 },
    { name: 'May', matches: 28, samples: 84 },
    { name: 'Jun', matches: 31, samples: 92 },
  ]

  const pieData = [
    { name: 'High Match', value: 35, color: '#ef4444' },
    { name: 'Good Match', value: 28, color: '#f97316' },
    { name: 'Moderate Match', value: 20, color: '#eab308' },
    { name: 'Low Match', value: 17, color: '#84cc16' },
  ]

  const recentActivity = [
    { type: 'upload', message: 'Voice sample uploaded', case: 'CF-2024-001', time: '2 min ago', icon: FileAudio },
    { type: 'match', message: 'High similarity match found (94.2%)', case: 'CF-2024-012', time: '15 min ago', icon: CheckCircle },
    { type: 'process', message: 'Noise reduction completed', case: 'CF-2024-003', time: '1 hr ago', icon: Activity },
    { type: 'alert', message: 'New suspect added to database', case: 'CF-2024-015', time: '2 hrs ago', icon: Users },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.8
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
        duration: 0.6
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header with floating animation */}
      <motion.div 
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        {/* Background glow effect */}
        <div className={`absolute -inset-4 ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100/60'} rounded-3xl blur-xl opacity-50`}></div>
        
        <div className="relative z-10">
          <motion.div
            animate={{ 
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6"
          >
            <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-600'} rounded-2xl flex items-center justify-center shadow-2xl`}>
              <Shield className="h-8 w-8 text-white" />
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent`}
          >
            Voice Recognition System
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}
          >
            Advanced AI-powered voice analysis for cyber fraud detection and criminal identification
          </motion.p>

          {/* Floating particles effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute w-2 h-2 ${theme === 'dark' ? 'bg-purple-400/30' : 'bg-purple-300/40'} rounded-full`}
                style={{
                  left: `${20 + i * 12}%`,
                  top: `${30 + (i % 2) * 40}%`,
                }}
                animate={{
                  y: [-10, 10, -10],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Stats Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.08, 
              y: -8,
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            className={`${theme === 'dark' ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/70 border-white/30'} backdrop-blur-2xl border rounded-2xl p-6 relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}
          >
            {/* Animated gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white shadow-lg`}
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <stat.icon size={24} />
                </motion.div>
                
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  className={`text-sm font-bold px-2 py-1 rounded-full ${
                    stat.change.startsWith('+') 
                      ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                      : 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                  }`}
                >
                  {stat.change}
                </motion.span>
              </div>

              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className={`text-2xl sm:text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}
              >
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + index * 0.1, duration: 1 }}
                >
                  {stat.value}
                </motion.span>
              </motion.h3>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm font-medium`}
              >
                {stat.label}
              </motion.p>

              {/* Progress indicator */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                className="mt-4"
              >
                <div className={`h-1 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${70 + index * 10}%` }}
                    transition={{ delay: 1.4 + index * 0.1, duration: 1, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                  />
                </div>
              </motion.div>
            </div>

            {/* Corner accent */}
            <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${stat.color} opacity-10 rounded-bl-3xl`}></div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add pulse animation for mobile focus */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="block sm:hidden text-center mb-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`inline-flex items-center px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-100 text-purple-700'} text-sm font-medium`}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-2 h-2 bg-purple-500 rounded-full mr-2"
          />
          Real-time system monitoring
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Line Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
        >
          <div className="flex items-center mb-6">
            <TrendingUp className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Analysis Trends</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Line 
                type="monotone" 
                dataKey="matches" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="samples" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
        >
          <div className="flex items-center mb-6">
            <BarChart3 className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Match Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {pieData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`lg:col-span-2 ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
        >
          <div className="flex items-center mb-6">
            <Activity className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h3>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className={`flex items-start space-x-4 p-4 ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700/70' : 'bg-white/50 hover:bg-white/70'} rounded-lg transition-colors`}
              >
                <div className={`p-2 ${theme === 'dark' ? 'bg-purple-900/50' : 'bg-purple-100'} rounded-lg`}>
                  <activity.icon size={20} className={`${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div className="flex-1">
                  <p className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>{activity.message}</p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Case: {activity.case}</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'} mt-1`}>{activity.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
        >
          <div className="flex items-center mb-6">
            <Shield className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>System Status</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>API Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-600 font-medium">Online</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Database</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-600 font-medium">Connected</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>AI Engine</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-600 font-medium">Active</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Storage</span>
              <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} font-medium`}>78% Used</span>
            </div>
            <div className={`w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
              <div className={`${theme === 'dark' ? 'bg-purple-600' : 'bg-purple-600'} h-2 rounded-full`} style={{ width: '78%' }}></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Dashboard
