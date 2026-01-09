import { render, screen } from '@testing-library/react'
import HeroSection from '@/components/HeroSection'

describe('HeroSection', () => {
  it('renders the heading elements', () => {
    render(<HeroSection />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent(/Développeuse Full-stack/i)
  })

  it('renders the introduction text', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Salut, je suis/i)).toBeInTheDocument()
    expect(screen.getByText(/Chloé/i)).toBeInTheDocument()
  })

  it('renders the experience mention', () => {
    render(<HeroSection />)
    expect(screen.getByText(/Worldline/i)).toBeInTheDocument()
    expect(screen.getByText(/NewDeal/i)).toBeInTheDocument()
  })
})
