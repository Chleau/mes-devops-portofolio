import { render, screen } from '@testing-library/react'
import StackTechnique from '@/components/StackTechnique'

describe('StackTechnique', () => {
  it('renders the technology list', () => {
    render(<StackTechnique />)
    expect(screen.getByText('Next.js')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Laravel')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
  })
})
