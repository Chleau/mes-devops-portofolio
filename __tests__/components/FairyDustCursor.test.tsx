import { render, screen } from '@testing-library/react'
import FairyDustCursor from '@/components/FairyDustCursor'

describe('FairyDustCursor', () => {
  it('renders without crashing', () => {
    const { container } = render(<FairyDustCursor />)
    expect(container).toBeInTheDocument()
  })
})
