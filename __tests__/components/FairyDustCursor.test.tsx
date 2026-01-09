import { render, act, fireEvent } from '@testing-library/react'
import FairyDustCursor from '@/components/FairyDustCursor'

// Mock Framer Motion's AnimatePresence to avoid animation delays in tests
jest.mock('framer-motion', () => ({
  ...jest.requireActual('framer-motion'),
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('FairyDustCursor', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('renders without crashing', () => {
    const { container } = render(<FairyDustCursor />)
    expect(container).toBeInTheDocument()
  })

  it('creates sparkles on mouse move', () => {
    // Mock Math.random to ensure sparkle creation (random > 0.5 returns false to not skip)
    // The code is: if (Math.random() > 0.5) return;
    // So we need Math.random() <= 0.5
    jest.spyOn(Math, 'random').mockReturnValue(0.1)

    const { container } = render(<FairyDustCursor />)

    // Simulate mouse move
    act(() => {
      fireEvent.mouseMove(window, { clientX: 100, clientY: 100 })
    })

    // Check if a sparkle is added (it's a div with absolute position)
    // We can check by class name or style
    const sparkles = container.querySelectorAll('.absolute.w-2.h-2')
    expect(sparkles.length).toBeGreaterThan(0)
  })

  it('removes sparkles after delay', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1)
    const { container } = render(<FairyDustCursor />)

    // Create sparkle
    act(() => {
      fireEvent.mouseMove(window, { clientX: 100, clientY: 100 })
    })

    expect(container.querySelectorAll('.absolute.w-2.h-2').length).toBeGreaterThan(0)

    // Advance timer by 2000ms (1000ms delay + 800ms animation exit)
    act(() => {
      jest.advanceTimersByTime(2000)
    })

    // Sparkle should be removed
    expect(container.querySelectorAll('.absolute.w-2.h-2').length).toBe(0)
  })
})
