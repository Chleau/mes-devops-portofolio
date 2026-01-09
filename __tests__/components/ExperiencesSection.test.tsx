import { render, screen } from '@testing-library/react'
import ExperiencesSection from '@/components/ExperiencesSection'

describe('ExperiencesSection', () => {
  it('renders the experience cards', () => {
    render(<ExperiencesSection />)
    expect(screen.getByText('Worldline')).toBeInTheDocument()
    expect(screen.getByText('NewDeal')).toBeInTheDocument()
  })

  it('renders role descriptions', () => {
    render(<ExperiencesSection />)
    expect(screen.getByText(/Développeuse Full-stack/i)).toBeInTheDocument()
    expect(screen.getByText(/Développeuse PHP \/ Laravel/i)).toBeInTheDocument()
  })
})
