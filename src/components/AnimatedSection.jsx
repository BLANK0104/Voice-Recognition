import React from 'react'
import { motion } from 'framer-motion'
import { useInView } from '../hooks/useInView'

const AnimatedSection = ({ 
  children, 
  className = '',
  animation = 'fadeUp',
  delay = 0,
  duration = 0.6,
  stagger = 0.1,
  once = true
}) => {
  const { elementRef, isInView, hasBeenInView } = useInView({ threshold: 0.1 })

  const animations = {
    fadeUp: {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0 }
    },
    fadeDown: {
      hidden: { opacity: 0, y: -50 },
      visible: { opacity: 1, y: 0 }
    },
    fadeLeft: {
      hidden: { opacity: 0, x: -50 },
      visible: { opacity: 1, x: 0 }
    },
    fadeRight: {
      hidden: { opacity: 0, x: 50 },
      visible: { opacity: 1, x: 0 }
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 }
    },
    slideUp: {
      hidden: { opacity: 0, y: 100, scale: 0.9 },
      visible: { opacity: 1, y: 0, scale: 1 }
    }
  }

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay
      }
    }
  }

  const shouldAnimate = once ? hasBeenInView : isInView

  return (
    <motion.div
      ref={elementRef}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? "visible" : "hidden"}
      transition={{ duration, ease: "easeOut" }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={animations[animation]}
          transition={{ duration, delay: index * stagger }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  )
}

export default AnimatedSection
