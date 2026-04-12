import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProfileTab } from '@/components/features/profile/tabs/profile/ProfileTab'

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt, className }: any) => {
    return <img src={src} alt={alt} className={className} data-testid="avatar-image" />
  }
})

describe('ProfileTab', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    phone: '+37499123456',
    address: 'Yerevan',
    role: 'student',
    avatar: '/avatar.jpg',
    isPaid: true,
  }

  const mockStats = {
    currentLessons: '2/5',
    progress: 40,
    points: 250,
    certificates: '1',
  }

  const defaultProps = {
    user: mockUser,
    stats: mockStats,
    isUpdating: false,
    onSubmit: jest.fn(),
    onShowPasswordModal: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders user profile information', () => {
    render(<ProfileTab {...defaultProps} />)

    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('test@example.com')).toBeInTheDocument()
    expect(screen.getByText('+37499123456')).toBeInTheDocument()
  })

  it('renders avatar image', () => {
    render(<ProfileTab {...defaultProps} />)

    const avatar = screen.getByTestId('avatar-image')
    expect(avatar).toBeInTheDocument()
    expect(avatar).toHaveAttribute('src', '/avatar.jpg')
  })

  it('renders stats correctly', () => {
    render(<ProfileTab {...defaultProps} />)

    expect(screen.getByText('2/5')).toBeInTheDocument()
    expect(screen.getByText('40%')).toBeInTheDocument()
    expect(screen.getByText('250')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('calls onShowPasswordModal when password button clicked', () => {
    render(<ProfileTab {...defaultProps} />)

    const passwordButton = screen.getByText('Փոխել գաղտնաբառը')
    fireEvent.click(passwordButton)

    expect(defaultProps.onShowPasswordModal).toHaveBeenCalled()
  })

  it('calls onSubmit when form is submitted', async () => {
    render(<ProfileTab {...defaultProps} />)

    const form = screen.getByRole('form') || document.querySelector('form')
    if (form) {
      fireEvent.submit(form)

      await waitFor(() => {
        expect(defaultProps.onSubmit).toHaveBeenCalled()
      })
    }
  })

  it('displays loading state when isUpdating is true', () => {
    render(<ProfileTab {...defaultProps} isUpdating={true} />)

    expect(screen.getByText('Պահպանվում է...')).toBeInTheDocument()
  })

  it('renders form fields', () => {
    render(<ProfileTab {...defaultProps} />)

    expect(screen.getByLabelText(/անուն/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/էլ\. փոստ/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/հեռախոսահամար/i)).toBeInTheDocument()
  })

  it('handles user without avatar gracefully', () => {
    render(<ProfileTab {...defaultProps} user={{ ...mockUser, avatar: null }} />)

    // Should render fallback or placeholder
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })

  it('displays user role badge', () => {
    render(<ProfileTab {...defaultProps} />)

    expect(screen.getByText(/ուսանող/i)).toBeInTheDocument()
  })

  it('renders save button', () => {
    render(<ProfileTab {...defaultProps} />)

    expect(screen.getByText('Պահպանել')).toBeInTheDocument()
  })
})
