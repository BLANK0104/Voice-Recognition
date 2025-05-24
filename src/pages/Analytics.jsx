import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  Calendar,
  Target,
  Clock,
  Users,
  FileAudio
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts'
import { ThemeContext } from '../context/ThemeContext'

const Analytics = () => {
  const { theme } = useContext(ThemeContext)
  
  const monthlyData = [
    { month: 'Jan', matches: 12, uploads: 45, accuracy: 85 },
    { month: 'Feb', matches: 19, uploads: 52, accuracy: 88 },
    { month: 'Mar', matches: 15, uploads: 38, accuracy: 82 },
    { month: 'Apr', matches: 22, uploads: 67, accuracy: 91 },
    { month: 'May', matches: 28, uploads: 84, accuracy: 94 },
    { month: 'Jun', matches: 31, uploads: 92, accuracy: 96 },
  ]

  const caseData = [
    { name: 'Fraud Cases', value: 45, color: '#ef4444' },
    { name: 'Scam Calls', value: 32, color: '#f97316' },
    { name: 'Identity Theft', value: 18, color: '#eab308' },
    { name: 'Other', value: 5, color: '#84cc16' },
  ]

  const accuracyData = [
    { range: '90-100%', count: 45 },
    { range: '80-89%', count: 32 },
    { range: '70-79%', count: 18 },
    { range: '60-69%', count: 8 },
    { range: '<60%', count: 3 },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.9,
      rotateX: 10
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 15,
        duration: 0.7
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        {/* Background glow effect */}
        <div className={`absolute -inset-6 ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100/60'} rounded-3xl blur-2xl opacity-40`}></div>
        
        <div className="relative z-10">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6"
          >
            <div className={`w-16 h-16 ${theme === 'dark' ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-gradient-to-r from-purple-600 to-blue-600'} rounded-2xl flex items-center justify-center shadow-2xl`}>
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 bg-clip-text text-transparent`}
          >
            Analytics & Reports
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={`text-lg sm:text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-3xl mx-auto leading-relaxed`}
          >
            Comprehensive insights into voice recognition performance and trends
          </motion.p>

          {/* Floating analytics icons */}
          <div className="absolute inset-0 pointer-events-none">
            {[TrendingUp, BarChart3, PieChart, Target].map((Icon, i) => (
              <motion.div
                key={i}
                className={`absolute ${theme === 'dark' ? 'text-purple-400/20' : 'text-purple-300/30'}`}
                style={{
                  left: `${15 + i * 18}%`,
                  top: `${20 + (i % 2) * 50}%`,
                }}
                animate={{
                  y: [-15, 15, -15],
                  rotate: [0, 180, 360],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              >
                <Icon size={24} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Key Metrics */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
      >
        {{
          label: 'System Accuracy', 
          value: '94.2%', 
          icon: Target, 
          color: 'from-green-500 to-emerald-600', 
          trend: '+2.1%',
          description: 'Voice matching precision'
        },
        { 
          label: 'Processing Speed', 
          value: '2.3s', 
          icon: Clock, 
          color: 'from-blue-500 to-blue-600', 
          trend: '-0.5s',
          description: 'Average analysis time'
        },
        { 
          label: 'Database Size', 
          value: '12.4K', 
          icon: Users, 
          color: 'from-purple-500 to-purple-600', 
          trend: '+15%',
          description: 'Voice samples stored'
        },
        { 
          label: 'Active Cases', 
          value: '89', 
          icon: FileAudio, 
          color: 'from-orange-500 to-orange-600', 
          trend: '+7',
          description: 'Currently investigating'
        }
        ].map((metric, index) => (
          <motion.div
            key={metric.label}
            variants={itemVariants}
            whileHover={{ 
              scale: 1.05, 
              y: -8,
              rotateY: 5,
              transition: { duration: 0.3 }
            }}
            whileTap={{ scale: 0.95 }}
            className={`${theme === 'dark' ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/70 border-white/30'} backdrop-blur-2xl border rounded-2xl p-6 relative overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}
          >
            {/* Animated gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${metric.color} opacity-5 group-hover:opacity-15 transition-opacity duration-300`}></div>
            
            {/* Shimmer effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 animate-shimmer"></div>
            </div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  className={`p-3 rounded-xl bg-gradient-to-r ${metric.color} text-white shadow-lg`}
                  whileHover={{ 
                    rotate: [0, -10, 10, 0],
                    scale: 1.1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <metric.icon size={24} />
                </motion.div>
                
                <motion.span 
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  className={`text-sm font-bold px-2 py-1 rounded-full ${
                    metric.trend.startsWith('+') || metric.trend.startsWith('-0') 
                      ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30' 
                      : 'text-orange-700 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30'
                  }`}
                >
                  {metric.trend}
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
                  {metric.value}
                </motion.span>
              </motion.h3>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className={`${theme === 'dark' ? 'text-white' : 'text-gray-900'} text-sm font-semibold mb-1`}
              >
                {metric.label}
              </motion.p>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-xs`}
              >
                {metric.description}
              </motion.p>

              {/* Animated progress indicator */}
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1.2 + index * 0.1, duration: 0.8 }}
                className="mt-4"
              >
                <div className={`h-1.5 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${80 + index * 5}%` }}
                    transition={{ delay: 1.4 + index * 0.1, duration: 1.2, ease: "easeOut" }}
                    className={`h-full bg-gradient-to-r ${metric.color} rounded-full shadow-lg`}
                  />
                </div>
              </motion.div>
            </div>

            {/* Corner accent with pulse */}
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${metric.color} opacity-10 rounded-bl-3xl`}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile status indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="block sm:hidden text-center mb-8"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.05, 1],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`inline-flex items-center px-4 py-2 rounded-full ${theme === 'dark' ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-100 text-blue-700'} text-sm font-medium`}
        >
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              backgroundColor: ["#3b82f6", "#8b5cf6", "#3b82f6"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 bg-blue-500 rounded-full mr-2"
          />
          Live analytics dashboard
        </motion.div>
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trends */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
        >
          <div className="flex items-center mb-6">
            <TrendingUp className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Monthly Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Line 
                type="monotone" 
                dataKey="matches" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 6 }}
                name="Matches"
              />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ fill: '#10b981', strokeWidth: 2, r: 6 }}
                name="Accuracy %"
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Case Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
        >
          <div className="flex items-center mb-6">
            <PieChart className="h-6 w-6 text-primary-600 mr-3" />
            <h3 className="text-xl font-semibold text-gray-900">Case Type Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={caseData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {caseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {caseData.map((item, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Accuracy Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
      >
        <div className="flex items-center mb-6">
          <BarChart3 className="h-6 w-6 text-primary-600 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900">Match Accuracy Distribution</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={accuracyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="range" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Bar 
              dataKey="count" 
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  )
}

export default Analytics
