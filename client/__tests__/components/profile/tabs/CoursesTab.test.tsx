import { render, screen, fireEvent } from '@testing-library/react'
import { CoursesTab } from '@/components/features/profile/tabs/CoursesTab'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt }: any) => {
    return <img src={src} alt={alt} data-testid="course-image" />
  }
})

describe('CoursesTab', () => {
  const mockCourses = [
    {
      id: '1',
      title: 'Wildberries Basics',
      desc: 'Հիմնական դասընթաց WB-ի մասին',
      status: 'Ակտիվ',
      lessons: 10,
      progress: 60,
      color: 'bg-violet-50',
      borderColor: 'border-violet-100',
    },
    {
      id: '2',
      title: 'Advanced Marketing',
      desc: 'Առաջադեմ մարկետինգ',
      status: 'Նոր',
      lessons: 15,
      progress: 0,
      color: 'bg-blue-50',
      borderColor: 'border-blue-100',
    },
  ]

  const defaultProps = {
    courses: mockCourses,
    totalCourses: 5,
  }

  it('renders course list correctly', () => {
    render(<CoursesTab {...defaultProps} />)

    expect(screen.getByText('Wildberries Basics')).toBeInTheDocument()
    expect(screen.getByText('Advanced Marketing')).toBeInTheDocument()
  })

  it('renders course descriptions', () => {
    render(<CoursesTab {...defaultProps} />)

    expect(screen.getByText('Հիմնական դասընթաց WB-ի մասին')).toBeInTheDocument()
    expect(screen.getByText('Առաջադեմ մարկետինգ')).toBeInTheDocument()
  })

  it('displays progress for each course', () => {
    render(<CoursesTab {...defaultProps} />)

    expect(screen.getByText('60%')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })

  it('shows course status badges', () => {
    render(<CoursesTab {...defaultProps} />)

    expect(screen.getByText('Ակտիվ')).toBeInTheDocument()
    expect(screen.getByText('Նոր')).toBeInTheDocument()
  })

  it('displays lesson counts', () => {
    render(<CoursesTab {...defaultProps} />)

    expect(screen.getByText(/10 դաս/i)).toBeInTheDocument()
    expect(screen.getByText(/15 դաս/i)).toBeInTheDocument()
  })

  it('renders empty state when no courses', () => {
    render(<CoursesTab courses={[]} totalCourses={0} />)

    expect(screen.getByText(/դասընթացներ չկան/i)).toBeInTheDocument()
  })

  it('shows total courses count', () => {
    render(<CoursesTab {...defaultProps} />)

    expect(screen.getByText(/5 դասընթաց/i)).toBeInTheDocument()
  })

  it('renders continue learning button for active courses', () => {
    render(<CoursesTab {...defaultProps} />)

    expect(screen.getByText(/շարունակել/i)).toBeInTheDocument()
  })

  it('renders start button for new courses', () => {
    render(<CoursesTab {...defaultProps} />)

    expect(screen.getByText(/սկսել/i)).toBeInTheDocument()
  })

  it('displays course cards with proper styling', () => {
    const { container } = render(<CoursesTab {...defaultProps} />)

    const cards = container.querySelectorAll('[class*="rounded"]')
    expect(cards.length).toBeGreaterThan(0)
  })
})
