'use client';

import { motion } from 'framer-motion';
import { Code2, Package } from 'lucide-react';

export default function ExperiencesSection() {
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
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8 },
    },
  };

  const experiences = [
    {
      id: 1,
      company: 'Worldline',
      role: 'Développeuse Full-stack',
      period: '2022 - 2023',
      description: 'Développement d\'applications web modernes avec TypeScript, React et Node.js. Participation à des projets innovants dans le domaine des paiements numériques.',
      technologies: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
      icon: Code2,
    },
    {
      id: 2,
      company: 'NewDeal',
      role: 'Développeuse PHP / Laravel',
      period: '2021 - 2022',
      description: 'Création et maintenance d\'applications web avec Laravel. Travail sur l\'architecture backend et optimisation des performances.',
      technologies: ['PHP', 'Laravel', 'MySQL', 'Vue.js'],
      icon: Package,
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20 md:py-32 bg-white/40 backdrop-blur-sm">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-almond-light/30 rounded-full blur-3xl -z-10"></div>

      <motion.div
        className="max-w-5xl w-full mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="mb-20">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-spruce mb-4">
            Mes Expériences
          </h2>
          <p className="text-lg text-grey-olive">
            3 ans d'alternance dans des entreprises innovantes, développant des compétences solides en Full-stack.
          </p>
        </motion.div>

        {/* Experiences grid */}
        <div className="space-y-8">
          {experiences.map((exp) => {
            const IconComponent = exp.icon;
            return (
              <motion.div
                key={exp.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group glass p-8 rounded-2xl cursor-pointer transition-all hover:shadow-glass-lg"
              >
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  {/* Icon */}
                  <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-gradient-to-br from-dusty-olive to-dusty-olive flex items-center justify-center shadow-lg">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-dark-spruce mb-1">{exp.company}</h3>
                        <p className="text-dusty-olive font-semibold text-lg">{exp.role}</p>
                      </div>
                      <span className="inline-block px-4 py-2 bg-almond-light/60 text-dark-spruce rounded-lg text-sm font-bold whitespace-nowrap">
                        {exp.period}
                      </span>
                    </div>

                    <p className="text-grey-olive mb-8 leading-relaxed text-base">
                      {exp.description}
                    </p>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-3">
                      {exp.technologies.map((tech, idx) => (
                        <motion.span
                          key={idx}
                          whileHover={{ scale: 1.1, y: -2 }}
                          className="px-4 py-2 bg-dusty-olive/10 text-dusty-olive rounded-lg text-sm font-bold hover:bg-dusty-olive/20 transition-all shadow-sm"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
