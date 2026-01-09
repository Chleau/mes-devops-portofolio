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

  it('shows success message upon submission', async () => {
    render(<ContactSection />)
    
    const nameInput = screen.getByLabelText(/Votre nom/i)
    const emailInput = screen.getByLabelText(/Votre email/i)
    const messageInput = screen.getByLabelText(/Votre message/i)
    const submitBtn = screen.getByRole('button', { name: /Envoyer mon message/i })

    // Fill the form
    fireEvent.change(nameInput, { target: { value: 'Jean Dupont' } })
    fireEvent.change(emailInput, { target: { value: 'jean@example.com' } })
    fireEvent.change(messageInput, { target: { value: 'Hello !' } })

    // Submit
    fireEvent.click(submitBtn)

    // Check for success message
    expect(await screen.findByText(/Message envoyé!/i)).toBeInTheDocument()
    expect(screen.getByText(/Merci d'avoir pris le temps de m'écrire/i)).toBeInTheDocument()
  })
})
