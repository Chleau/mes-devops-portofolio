'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setFormData({ name: '', email: '', message: '' });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 md:px-8 py-20 md:py-32 bg-gradient-to-b from-white/40 to-almond-light/30">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-pale-oak/15 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-dusty-olive/10 rounded-full blur-3xl -z-10"></div>

      <motion.div
        className="max-w-2xl w-full mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {/* Section header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-dark-spruce mb-4">
            Parlons de votre projet
          </h2>
          <p className="text-lg text-grey-olive">
            Vous avez une idée ou un projet en tête? Je serais ravie d'en discuter.
          </p>
        </motion.div>

        {/* Form */}
        <motion.div variants={itemVariants} className="glass p-10 md:p-14 rounded-3xl">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="form"
                onSubmit={handleSubmit}
                className="space-y-8"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Name field */}
                <div>
                  <label htmlFor="name" className="block text-base font-bold text-dark-spruce mb-3">
                    Votre nom
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jean Dupont"
                    className="w-full px-5 py-4 bg-white/50 border-2 border-pale-oak/30 rounded-xl text-dark-spruce placeholder-grey-olive/50 focus:border-dusty-olive focus:outline-none transition-colors font-medium text-base"
                    required
                  />
                </div>

                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-base font-bold text-dark-spruce mb-3">
                    Votre email
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jean@example.com"
                    className="w-full px-5 py-4 bg-white/50 border-2 border-pale-oak/30 rounded-xl text-dark-spruce placeholder-grey-olive/50 focus:border-dusty-olive focus:outline-none transition-colors font-medium text-base"
                    required
                  />
                </div>

                {/* Message field */}
                <div>
                  <label htmlFor="message" className="block text-base font-bold text-dark-spruce mb-3">
                    Votre message
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.02 }}
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Parlez-moi de votre projet..."
                    rows={5}
                    className="w-full px-5 py-4 bg-white/50 border-2 border-pale-oak/30 rounded-xl text-dark-spruce placeholder-grey-olive/50 focus:border-dusty-olive focus:outline-none transition-colors resize-none font-medium text-base"
                    required
                  />
                </div>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full py-5 bg-gradient-to-r from-dusty-olive to-dark-spruce text-white font-bold text-lg rounded-xl flex items-center justify-center gap-2 hover:shadow-2xl transition-all"
                >
                  <Send className="w-5 h-5" />
                  Envoyer mon message
                </motion.button>

                <p className="text-center text-sm text-grey-olive">
                  Je vous répondrai dans les 24-48h. Merci pour votre intérêt! 🌟
                </p>
              </motion.form>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                >
                  <CheckCircle className="w-20 h-20 text-dusty-olive mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-dark-spruce mb-2">Message envoyé!</h3>
                <p className="text-grey-olive text-center">
                  Merci d'avoir pris le temps de m'écrire. Je vous répondrai rapidement.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Social links */}
        <motion.div variants={itemVariants} className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4 text-center">
          <div className="glass p-4 rounded-xl">
            <p className="text-2xl mb-2">💼</p>
            <p className="text-sm text-grey-olive font-medium">LinkedIn</p>
          </div>
          <div className="glass p-4 rounded-xl">
            <p className="text-2xl mb-2">🐙</p>
            <p className="text-sm text-grey-olive font-medium">GitHub</p>
          </div>
          <div className="glass p-4 rounded-xl">
            <p className="text-2xl mb-2">✉️</p>
            <p className="text-sm text-grey-olive font-medium">Email</p>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
