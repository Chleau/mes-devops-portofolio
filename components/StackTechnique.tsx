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
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20 md:py-32">
      {/* Decorative background */}
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-dusty-olive/10 rounded-full blur-3xl -z-10"></div>
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-pale-oak/10 rounded-full blur-3xl -z-10"></div>

      <motion.div
        className="max-w-5xl w-full mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-spruce mb-4">
            Ma Stack Technique
          </h2>
          <p className="text-lg text-grey-olive max-w-2xl mx-auto">
            Les technologies et outils que j'utilise pour créer des applications web modernes et performantes.
          </p>
        </motion.div>

        {/* Tech grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
          variants={containerVariants}
        >
          {technologies.map((tech, index) => {
            const { Icon } = tech;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="group glass p-8 rounded-2xl flex flex-col items-center gap-5 cursor-pointer hover:shadow-2xl transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <p className="font-bold text-dark-spruce text-center text-sm md:text-base">
                  {tech.name}
                </p>
                <div className={`h-1 w-8 bg-gradient-to-r ${tech.color} rounded-full opacity-0 group-hover:opacity-100 transition-opacity`} />
              </motion.div>
            );
          })}
        </motion.div>
        </motion.div>

        {/* Summary */}
        <motion.div
          variants={itemVariants}
          className="mt-20 glass p-10 rounded-2xl text-center"
        >
          <p className="text-grey-olive text-lg mb-6 leading-relaxed">
            Je suis spécialisée dans la création d'expériences web <span className="font-bold text-dark-spruce">modernes et fluides</span> avec une attention particulière à l'<span className="font-bold text-dark-spruce">accessibilité</span> et la <span className="font-bold text-dark-spruce">performance</span>.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {['Frontend', 'Backend', 'Databases', 'DevOps'].map((badge, idx) => (
              <motion.span
                key={idx}
                whileHover={{ scale: 1.15, y: -3 }}
                className="px-5 py-3 bg-gradient-to-r from-dusty-olive to-dark-spruce text-white rounded-lg text-sm font-bold shadow-lg"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
