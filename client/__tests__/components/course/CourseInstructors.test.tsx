import { render, screen } from '@testing-library/react'
import { CourseInstructors } from '@/components/features/course/CourseInstructors'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt, fill, className, sizes }: any) => {
    return <img src={src} alt={alt} className={className} data-testid="instructor-image" />
  }
})

// Mock DOMPurify
jest.mock('dompurify', () => ({
  sanitize: (input: string) => input,
}))

describe('CourseInstructors', () => {
  const mockInstructor = {
    name: 'Տիգրան Կոստանյան',
    role: 'Wildberries Մենթոր',
    desc: '<p>Փորձառու մենթոր WB-ի մասին:</p>',
    imageUrl: '/instructor.jpg',
    ratingText: '4.9/5',
    coursesText: '12 դասընթաց',
  }

  it('renders instructor information correctly', () => {
    render(<CourseInstructors instructor={mockInstructor} />)

    expect(screen.getByText('Տիգրան Կոստանյան')).toBeInTheDocument()
    expect(screen.getByText('Wildberries Մենթոր')).toBeInTheDocument()
    expect(screen.getByText('12 դասընթաց')).toBeInTheDocument()
    expect(screen.getByText('4.9/5')).toBeInTheDocument()
  })

  it('renders instructor image', () => {
    render(<CourseInstructors instructor={mockInstructor} />)

    const image = screen.getByTestId('instructor-image')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', '/instructor.jpg')
    expect(image).toHaveAttribute('alt', 'Տիգրան Կոստանյան')
  })

  it('sanitizes and renders HTML description', () => {
    render(<CourseInstructors instructor={mockInstructor} />)

    // Should contain the description text (sanitized HTML)
    expect(screen.getByText(/փորձառու մենթոր/i)).toBeInTheDocument()
  })

  it('renders link to instructor section', () => {
    render(<CourseInstructors instructor={mockInstructor} />)

    const link = screen.getByText('Տեսնել մենթորին').closest('a')
    expect(link).toHaveAttribute('href', '/#instructor')
  })

  it('renders rating badge', () => {
    render(<CourseInstructors instructor={mockInstructor} />)

    // Check for rating text in the badge
    const ratingElements = screen.getAllByText('4.9/5')
    expect(ratingElements.length).toBeGreaterThan(0)
  })

  it('returns null when instructor is null', () => {
    const { container } = render(<CourseInstructors instructor={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders with incomplete instructor data gracefully', () => {
    const incompleteInstructor = {
      name: 'Անհայտ',
      role: 'Մենթոր',
      desc: '',
      imageUrl: '',
      ratingText: '0/5',
      coursesText: '0 դասընթաց',
    }

    render(<CourseInstructors instructor={incompleteInstructor} />)

    expect(screen.getByText('Անհայտ')).toBeInTheDocument()
  })

  it('has proper responsive classes', () => {
    render(<CourseInstructors instructor={mockInstructor} />)

    const container = screen.getByText('Դասավանդող').parentElement
    expect(container).toHaveClass('space-y-6')
  })

  it('renders icons correctly', () => {
    render(<CourseInstructors instructor={mockInstructor} />)

    // Check for icon containers
    expect(screen.getByText('12 դասընթաց')).toBeInTheDocument()
    expect(screen.getByText('4.9/5')).toBeInTheDocument()
  })
})
