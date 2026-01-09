import { render } from '@testing-library/react'
import FloatingParticles from '@/components/FloatingParticles'

describe('FloatingParticles', () => {
  it('renders without crashing', () => {
    const { container } = render(<FloatingParticles />)
    expect(container).toBeInTheDocument()
  })
})
