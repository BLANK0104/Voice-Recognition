import React, { useContext } from 'react'
import { motion } from 'framer-motion'
import { ThemeContext } from '../context/ThemeContext'
import { useInView } from '../hooks/useInView'
import AnimatedSection from '../components/AnimatedSection'
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Users, 
  Activity, 
  Zap,
  Database,
  FileText,
  PieChart,
  Calendar
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Cell
} from 'recharts'

const Analytics = () => {
  const { theme } = useContext(ThemeContext)
  const { elementRef: headerRef, isInView: headerInView } = useInView()
  
  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', matches: 65, accuracy: 92 },
    { month: 'Feb', matches: 78, accuracy: 94 },
    { month: 'Mar', matches: 85, accuracy: 91 },
    { month: 'Apr', matches: 92, accuracy: 95 },
    { month: 'May', matches: 89, accuracy: 94 },
    { month: 'Jun', matches: 96, accuracy: 96 }
  ]

  const caseTypes = [
    { name: 'Banking Fraud', value: 45, color: '#8b5cf6' },
    { name: 'Phone Scams', value: 30, color: '#06b6d4' },
    { name: 'Identity Theft', value: 15, color: '#10b981' },
    { name: 'Other', value: 10, color: '#f59e0b' }
  ]

  const accuracyDistribution = [
    { range: '90-95%', count: 142 },
    { range: '95-98%', count: 284 },
    { range: '98-100%', count: 156 }
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

  const metrics = [
    { 
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
      icon: Zap, 
      color: 'from-yellow-500 to-orange-600', 
      trend: '-0.4s',
      description: 'Average analysis time'
    },
    { 
      label: 'Database Size', 
      value: '12.4K', 
      icon: Database, 
      color: 'from-blue-500 to-cyan-600', 
      trend: '+15%',
      description: 'Voice samples stored'
    },
    { 
      label: 'Active Cases', 
      value: '89', 
      icon: FileText, 
      color: 'from-purple-500 to-pink-600', 
      trend: '+7',
      description: 'Currently investigating'
    }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Enhanced Header with scroll animation */}
      <motion.div
        ref={headerRef}
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={headerInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: -30, scale: 0.95 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center mb-16 relative"
      >
        {/* Background glow effect */}
        <motion.div 
          className={`absolute -inset-6 ${theme === 'dark' ? 'bg-purple-900/20' : 'bg-purple-100/60'} rounded-3xl blur-2xl opacity-40`}
          animate={headerInView ? { scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] } : {}}
          transition={{ duration: 3, repeat: headerInView ? Infinity : 0 }}
        />
        
        <div className="relative z-10">
          <motion.div
            animate={headerInView ? { 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            } : {}}
            transition={{ 
              duration: 8,
              repeat: headerInView ? Infinity : 0,
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
                animate={headerInView ? {
                  y: [-15, 15, -15],
                  rotate: [0, 180, 360],
                  opacity: [0.2, 0.6, 0.2],
                } : { opacity: 0 }}
                transition={{
                  duration: 4 + i * 0.5,
                  repeat: headerInView ? Infinity : 0,
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

      {/* Enhanced Key Metrics with scroll animation */}
      <AnimatedSection 
        animation="slideUp"
        stagger={0.12}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12"
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
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
      </AnimatedSection>

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

      {/* Charts Section with scroll animation */}
      <AnimatedSection animation="fadeUp" delay={0.2} className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Trends */}
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
        >
          <div className="flex items-center mb-6">
            <TrendingUp className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Monthly Performance</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="month" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="matches" stroke="#8b5cf6" strokeWidth={3} />
              <Line type="monotone" dataKey="accuracy" stroke="#06b6d4" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Case Distribution */}
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
        >
          <div className="flex items-center mb-6">
            <PieChart className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Case Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px'
                }}
              />
              <RechartsPieChart data={caseTypes} cx="50%" cy="50%" outerRadius={80} dataKey="value">
                {caseTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </RechartsPieChart>
            </RechartsPieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {caseTypes.map((item, index) => (
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
      </AnimatedSection>

      {/* Accuracy Distribution */}
      <AnimatedSection animation="fadeUp" delay={0.4}>
        <motion.div
          className={`${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white/50 border-white/20'} backdrop-blur-xl border rounded-xl p-6`}
        >
          <div className="flex items-center mb-6">
            <BarChart3 className={`h-6 w-6 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'} mr-3`} />
            <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Accuracy Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="range" stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </AnimatedSection>
    </div>
  )
}

export default Analytics
