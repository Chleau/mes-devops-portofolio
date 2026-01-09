import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/Header'

describe('Header', () => {
  it('renders the logo and navigation links', () => {
    render(<Header />)
    
    // Check Logo
    expect(screen.getByText('✨ Chloé')).toBeInTheDocument()

    // Check Desktop Navigation items
    const navItems = ['Accueil', 'Expériences', 'Stack', 'Contact']
    navItems.forEach(item => {
      // Assuming desktop links are visible or exist in DOM (might be hidden on mobile but present)
      // Since we simulate desktop resolution usually in JSDOM unless configured otherwise
      const links = screen.getAllByText(item)
      expect(links.length).toBeGreaterThan(0)
    })
  })

  it('renders "Me contacter" button', () => {
    render(<Header />)
    expect(screen.getByRole('link', { name: /Me contacter/i })).toBeInTheDocument()
  })
})
