import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

describe('Footer', () => {
  it('renders current year copyright or branding', () => {
    render(<Footer />)
    expect(screen.getByText('Chloé')).toBeInTheDocument()
    expect(screen.getByText(/Développeuse/i)).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<Footer />)
    const links = ['Accueil', 'Expériences', 'Stack Tech', 'Contact']
    
    links.forEach(linkText => {
      const linkElement = screen.getByRole('link', { name: linkText })
      expect(linkElement).toBeInTheDocument()
    })
  })

  it('renders social links', () => {
    render(<Footer />)
    expect(screen.getByLabelText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
  })
})
