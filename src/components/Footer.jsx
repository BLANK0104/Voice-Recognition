import React from 'react'
import { motion } from 'framer-motion'
import { Heart, Trophy, Users } from 'lucide-react'

const Footer = () => {
  const teamMembers = [
    { name: 'Utsav Chandra', role: 'Full Stack Developer' },
    { name: 'Aaliya Khan', role: 'UI/UX Designer' },
    { name: 'Yukta Rajput', role: 'Frontend Developer' },
    { name: 'Lakhan Agrawal', role: 'System Architect' }
  ]

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative mt-24"
    >
      {/* Gradient separator line */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-primary-500 to-transparent mb-12"></div>
      
      {/* Main footer content */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            {/* Hackathon Badge */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center bg-gradient-to-r from-primary-600 to-accent-600 text-white px-8 py-4 rounded-full font-semibold text-xl mb-8 shadow-2xl border border-white/20"
            >
              <Trophy className="h-6 w-6 mr-3" />
              Cyber Hackathon 2025
            </motion.div>

            {/* Project Title */}
            <h3 className="text-3xl font-bold text-white mb-3">
              Voice Recognition System for Cyber Fraud Detection
            </h3>
            <p className="text-gray-300 text-lg mb-10 max-w-3xl mx-auto leading-relaxed">
              Empowering Law Enforcement Agencies with AI-powered voice analysis to combat cybercrime and protect innocent victims from fraudulent activities.
            </p>

            {/* Team Section */}
            <div className="mb-12">
              <div className="flex items-center justify-center mb-8">
                <div className="w-12 h-px bg-gradient-to-r from-transparent to-primary-400"></div>
                <div className="flex items-center mx-6 bg-gray-800 px-6 py-3 rounded-full border border-gray-700">
                  <Users className="h-6 w-6 text-primary-400 mr-3" />
                  <span className="text-xl font-semibold text-white">Development Team</span>
                </div>
                <div className="w-12 h-px bg-gradient-to-l from-transparent to-primary-400"></div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={member.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:border-primary-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h4 className="font-semibold text-white text-lg mb-1">{member.name}</h4>
                    <p className="text-gray-400 text-sm">{member.role}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Made with Love */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center text-gray-300 font-medium text-lg mb-8 bg-gray-800/50 px-6 py-3 rounded-full border border-gray-700"
            >
              Made with
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                className="mx-3"
              >
                <Heart className="h-6 w-6 text-red-500 fill-current" />
              </motion.div>
              for justice and cybersecurity
            </motion.div>

            {/* Separator line */}
            <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-8"></div>

            {/* Copyright */}
            <div className="text-center">
              <p className="text-gray-400 text-base mb-2">
                © 2025 Voice Recognition System. Built for Cyber Hackathon 2025.
              </p>
              <p className="text-gray-500 text-sm">
                This is a demonstration project for educational and competition purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-primary-600 via-accent-600 to-primary-600"></div>
      </div>
    </motion.footer>
  )
}

export default Footer
