import { render, screen, fireEvent } from '@testing-library/react'
import ContactSection from '@/components/ContactSection'

describe('ContactSection', () => {
  it('renders the form fields', () => {
    render(<ContactSection />)
    expect(screen.getByLabelText(/Votre nom/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Votre email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Votre message/i)).toBeInTheDocument()
    
    expect(screen.getByRole('button', { name: /Envoyer mon message/i })).toBeInTheDocument()
  })

  it('allows entering text', () => {
    render(<ContactSection />)
    const nameInput = screen.getByLabelText(/Votre nom/i)
    fireEvent.change(nameInput, { target: { value: 'Jean Test' } })
    expect(nameInput).toHaveValue('Jean Test')
  })
})
