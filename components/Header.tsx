'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Accueil', href: '#hero' },
    { label: 'Expériences', href: '#experiences' },
    { label: 'Stack', href: '#stack' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'py-3 glass shadow-glass' : 'py-6 bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-5xl mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <motion.a
          href="#"
          className="font-display text-2xl font-bold text-dark-spruce"
          whileHover={{ scale: 1.05 }}
        >
          ✨ Chloé
        </motion.a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item, idx) => (
            <motion.a
              key={idx}
              href={item.href}
              className="text-grey-olive hover:text-dusty-olive font-medium transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              {item.label}
            </motion.a>
          ))}
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-2 bg-gradient-to-r from-dusty-olive to-dark-spruce text-white rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Me contacter
          </motion.a>
        </nav>

        {/* Mobile menu button */}
        <motion.button
          className="md:hidden text-dark-spruce"
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.9 }}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-2 mx-4 rounded-2xl overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-3">
              {navItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-grey-olive hover:text-dusty-olive font-medium py-2 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  {item.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="w-full px-4 py-2 bg-gradient-to-r from-dusty-olive to-dark-spruce text-white rounded-lg font-semibold text-center hover:shadow-lg transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Me contacter
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
