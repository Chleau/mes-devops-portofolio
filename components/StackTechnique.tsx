'use client';

import { motion } from 'framer-motion';
import {
  SiNextdotjs,
  SiTailwindcss,
  SiTypescript,
  SiPhp,
  SiLaravel,
  SiReact,
  SiPostgresql,
  SiMysql,
} from 'react-icons/si';

export default function StackTechnique() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const technologies = [
    { name: 'Next.js', Icon: SiNextdotjs, color: 'from-dark-spruce to-dusty-olive' },
    { name: 'TypeScript', Icon: SiTypescript, color: 'from-dusty-olive to-pale-oak' },
    { name: 'Tailwind CSS', Icon: SiTailwindcss, color: 'from-pale-oak to-grey-olive' },
    { name: 'React', Icon: SiReact, color: 'from-grey-olive to-dusty-olive' },
    { name: 'Laravel', Icon: SiLaravel, color: 'from-dusty-olive to-dark-spruce' },
    { name: 'PHP', Icon: SiPhp, color: 'from-dark-spruce to-dusty-olive' },
    { name: 'PostgreSQL', Icon: SiPostgresql, color: 'from-dusty-olive to-pale-oak' },
    { name: 'MySQL', Icon: SiMysql, color: 'from-pale-oak to-dusty-olive' },
  ];

  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-1/4 left-0 w-96 h-96 bg-dusty-olive/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-pale-oak/20 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Section header */}
          <motion.div variants={itemVariants} className="text-center mb-16 md:mb-24">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-spruce mb-6">
              Ma Stack Technique
            </h2>
            <p className="text-lg text-grey-olive max-w-2xl mx-auto leading-relaxed">
              Les technologies et outils que j&apos;utilise pour créer des applications web modernes et performantes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Tech grid - Takes up 7 columns on large screens */}
            <motion.div 
              className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-6"
              variants={containerVariants}
            >
              {technologies.map((tech, index) => {
                const { Icon } = tech;
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group glass p-6 rounded-2xl flex flex-col items-center gap-4 cursor-pointer hover:shadow-xl transition-all border border-white/40"
                  >
                    <div className={`w-14 h-14 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="font-bold text-dark-spruce text-center text-sm">
                      {tech.name}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Summary - Takes up 5 columns on large screens */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-5 lg:sticky lg:top-32"
            >
              <div className="glass p-8 md:p-10 rounded-3xl border border-white/50 shadow-lg relative overflow-hidden">
                {/* Decorative gradient inside card */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-dusty-olive/20 to-transparent rounded-bl-full -z-10"></div>
                
                <h3 className="text-2xl font-display font-bold text-dark-spruce mb-6">
                  Expertise & Approche
                </h3>
                
                <p className="text-grey-olive text-lg mb-8 leading-relaxed">
                  Je suis spécialisée dans la création d&apos;expériences web <span className="font-bold text-dark-spruce">modernes et fluides</span>. Mon approche combine une architecture technique robuste avec une attention particulière à l&apos;<span className="font-bold text-dark-spruce">accessibilité</span> et la <span className="font-bold text-dark-spruce">performance</span>.
                </p>
                
                <div className="flex flex-wrap gap-3">
                  {['Frontend', 'Backend', 'Databases', 'DevOps'].map((badge, idx) => (
                    <motion.span
                      key={idx}
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-white/60 border border-white/60 text-dark-spruce rounded-lg text-sm font-bold shadow-sm hover:bg-white hover:shadow-md transition-all cursor-default"
                    >
                      {badge}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
