import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProfileSidebar } from '@/components/features/profile/ProfileSidebar'
import { User, LayoutDashboard, Wallet, MessageSquare, FileText } from 'lucide-react'

// Mock next/link
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>
  }
})

// Mock next/image
jest.mock('next/image', () => {
  return ({ src, alt, fill, className, sizes }: any) => {
    return <img src={src} alt={alt} className={className} data-testid="profile-image" />
  }
})

describe('ProfileSidebar', () => {
  const mockUser = {
    name: 'Test User',
    role: 'student',
    avatar: '/test-avatar.jpg',
    files: null,
  }

  const mockSidebarLinks = [
    { id: 'profile', label: 'Պրոֆիլ', icon: User },
    { id: 'courses', label: 'Իմ դասընթացները', icon: LayoutDashboard },
    { id: 'payments', label: 'Վճարումներ', icon: Wallet },
    { id: 'comments', label: 'Կարծիքներ', icon: MessageSquare },
    { id: 'documents', label: 'Փաստաթղթեր', icon: FileText },
  ]

  const defaultProps = {
    user: mockUser,
    activeTab: 'profile',
    isUploadingAvatar: false,
    avatarPreview: null,
    sidebarLinks: mockSidebarLinks,
    onTabChange: jest.fn(),
    onAvatarUpload: jest.fn(),
    onShowPaymentModal: jest.fn(),
    onLogout: jest.fn(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders user information correctly', () => {
    render(<ProfileSidebar {...defaultProps} />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('Ուսանող')).toBeInTheDocument()
  })

  it('renders avatar image when available', () => {
    render(<ProfileSidebar {...defaultProps} />)
    
    const avatarImage = screen.getByTestId('profile-image')
    expect(avatarImage).toBeInTheDocument()
    expect(avatarImage).toHaveAttribute('src', '/test-avatar.jpg')
  })

  it('shows upload spinner when isUploadingAvatar is true', () => {
    render(<ProfileSidebar {...defaultProps} isUploadingAvatar={true} />)
    
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('calls onTabChange when sidebar link is clicked', () => {
    render(<ProfileSidebar {...defaultProps} />)
    
    const coursesLink = screen.getByText('Իմ դասընթացները')
    fireEvent.click(coursesLink)
    
    expect(defaultProps.onTabChange).toHaveBeenCalledWith('courses')
  })

  it('calls onLogout when logout button is clicked', () => {
    render(<ProfileSidebar {...defaultProps} />)
    
    const logoutButton = screen.getByText('Դուրս գալ')
    fireEvent.click(logoutButton)
    
    expect(defaultProps.onLogout).toHaveBeenCalled()
  })

  it('calls onAvatarUpload when file is selected', () => {
    render(<ProfileSidebar {...defaultProps} />)
    
    const fileInput = screen.getByLabelText('', { selector: 'input[type="file"]' })
    const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' })
    
    fireEvent.change(fileInput, { target: { files: [file] } })
    
    expect(defaultProps.onAvatarUpload).toHaveBeenCalledWith(file)
  })

  it('renders fallback user icon when no avatar', () => {
    render(<ProfileSidebar {...defaultProps} user={{ ...mockUser, avatar: null }} />)
    
    expect(screen.getByRole('img', { hidden: true })).toBeInTheDocument()
  })

  it('marks active tab correctly', () => {
    render(<ProfileSidebar {...defaultProps} activeTab="courses" />)
    
    const activeLink = screen.getByText('Իմ դասընթացները').closest('button')
    expect(activeLink).toHaveClass('bg-slate-900')
  })

  it('shows avatar preview when provided', () => {
    render(<ProfileSidebar {...defaultProps} avatarPreview="/preview.jpg" />)
    
    const avatarImage = screen.getByTestId('profile-image')
    expect(avatarImage).toHaveAttribute('src', '/preview.jpg')
  })

  it('renders all sidebar links', () => {
    render(<ProfileSidebar {...defaultProps} />)
    
    mockSidebarLinks.forEach(link => {
      expect(screen.getByText(link.label)).toBeInTheDocument()
    })
  })

  it('handles user without name gracefully', () => {
    render(<ProfileSidebar {...defaultProps} user={{ ...mockUser, name: null }} />)
    
    expect(document.querySelector('[data-testid="profile-image"]')).toHaveAttribute('alt', 'User')
  })
})
