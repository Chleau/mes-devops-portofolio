import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock des composants enfants pour tester l'intégration
jest.mock('@/components/HeroSection', () => () => <div data-testid="hero-section">Hero</div>)
jest.mock('@/components/ExperiencesSection', () => () => <div data-testid="experiences-section">Experiences</div>)
jest.mock('@/components/StackTechnique', () => () => <div data-testid="stack-section">Stack</div>)
jest.mock('@/components/ContactSection', () => () => <div data-testid="contact-section">Contact</div>)
jest.mock('@/components/Header', () => () => <div data-testid="header">Header</div>)
jest.mock('@/components/Footer', () => () => <div data-testid="footer">Footer</div>)
jest.mock('@/components/FloatingParticles', () => () => <div data-testid="floating-particles" />)
jest.mock('@/components/FairyDustCursor', () => () => <div data-testid="fairy-dust-cursor" />)

describe('Home Page', () => {
  it('renders all main sections', () => {
    render(<Home />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByTestId('experiences-section')).toBeInTheDocument()
    expect(screen.getByTestId('stack-section')).toBeInTheDocument()
    expect(screen.getByTestId('contact-section')).toBeInTheDocument()
  })
})
