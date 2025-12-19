'use client';

import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-12 px-4 md:px-8 bg-white/20 backdrop-blur-sm border-t border-white/30">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="font-display text-lg font-bold text-dark-spruce mb-3">Chloé</h3>
            <p className="text-grey-olive text-sm leading-relaxed">
              Développeuse 
            </p>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-semibold text-dark-spruce mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-grey-olive">
              <li>
                <a href="#hero" className="hover:text-dusty-olive transition-colors">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-dusty-olive transition-colors">
                  Expériences
                </a>
              </li>
              <li>
                <a href="#stack" className="hover:text-dusty-olive transition-colors">
                  Stack Tech
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-dusty-olive transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-semibold text-dark-spruce mb-3">Me suivre</h4>
            <div className="flex gap-4">
              <motion.a
                whileHover={{ scale: 1.2, rotate: 10 }}
                href="#"
                className="text-dusty-olive hover:text-dark-spruce transition-colors"
                aria-label="LinkedIn"
              >
                <span className="text-2xl">💼</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 10 }}
                href="#"
                className="text-dusty-olive hover:text-dark-spruce transition-colors"
                aria-label="GitHub"
              >
                <span className="text-2xl">🐙</span>
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.2, rotate: 10 }}
                href="#"
                className="text-dusty-olive hover:text-dark-spruce transition-colors"
                aria-label="Email"
              >
                <span className="text-2xl">✉️</span>
              </motion.a>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          className="h-px bg-gradient-to-r from-transparent via-dusty-olive to-transparent my-8"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        />

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center"
        >
          <p className="text-grey-olive text-sm flex items-center justify-center gap-2">
            © {currentYear} Chloé. Créé avec <Heart className="w-4 h-4 text-dusty-olive" /> et un peu de magie ✨
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
