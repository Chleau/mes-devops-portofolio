'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  const floatingVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1 },
    },
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20 md:py-32 overflow-hidden">
      {/* Gradient background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-dusty-olive/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pale-oak/20 rounded-full blur-3xl"></div>

      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Decorative badge */}
        <motion.div variants={itemVariants}>
          <div className="inline-block glass px-8 py-3 rounded-full mb-12">
            <p className="text-sm md:text-base font-medium text-dark-spruce">
              👋 Salut, je suis <span className="font-semibold">Chloé</span>
            </p>
          </div>
        </motion.div>

        {/* Main title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-dark-spruce mb-8 leading-tight"
        >
          Développeuse Full-stack
          <br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-dusty-olive via-dark-spruce to-dusty-olive animate-gradient-x bg-[length:200%_auto]">
              avec un peu de magie ✨
            </span>
            <motion.span 
              className="absolute -top-4 -right-6 text-2xl"
              animate={{ 
                rotate: [0, 15, -15, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              🧚‍♀️
            </motion.span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-grey-olive mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          56 ans d'expérience en alternance chez <span className="font-semibold text-dark-spruce">Worldline</span> et{' '}
          <span className="font-semibold text-dark-spruce">NewDeal</span>. Je crée des expériences web modernes, élégantes et fluides.
        </motion.p>

        {/* CTA Button */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.08, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-10 py-5 bg-gradient-to-r from-dusty-olive to-dark-spruce text-white rounded-xl font-bold text-lg flex items-center gap-3 overflow-hidden shadow-xl hover:shadow-2xl transition-all"
          >
            <span className="relative z-10">Découvrir mon travail</span>
            <ArrowRight className="w-6 h-6 relative z-10 group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-spruce to-dusty-olive opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.08, backgroundColor: 'rgba(92, 116, 87, 0.1)', y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="px-10 py-5 border-2 border-dusty-olive text-dusty-olive rounded-xl font-bold text-lg hover:bg-dusty-olive/5 transition-all"
          >
            Me contacter
          </motion.button>
        </motion.div>

        {/* Floating elements */}
        <motion.div
          className="mt-20 grid grid-cols-3 gap-4 md:gap-10 max-w-2xl mx-auto"
          variants={containerVariants}
        >
          <motion.div
            variants={floatingVariants}
            animate="animate"
            className="glass p-8 rounded-2xl hover:shadow-lg transition-all"
          >
            <p className="text-4xl font-bold text-dusty-olive">3+</p>
            <p className="text-base font-medium text-grey-olive mt-3">Ans d'exp</p>
          </motion.div>

          <motion.div
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 0.1 }}
            className="glass p-8 rounded-2xl hover:shadow-lg transition-all"
          >
            <p className="text-4xl font-bold text-dusty-olive">2</p>
            <p className="text-base font-medium text-grey-olive mt-3">Entreprises</p>
          </motion.div>

          <motion.div
            variants={floatingVariants}
            animate="animate"
            transition={{ delay: 0.2 }}
            className="glass p-8 rounded-2xl hover:shadow-lg transition-all"
          >
            <p className="text-4xl font-bold text-dusty-olive">∞</p>
            <p className="text-base font-medium text-grey-olive mt-3">Passion</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm text-grey-olive font-medium">Scroll</p>
          <div className="w-6 h-10 border-2 border-dusty-olive rounded-full flex justify-center">
            <motion.div
              className="w-1 h-2 bg-dusty-olive rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
