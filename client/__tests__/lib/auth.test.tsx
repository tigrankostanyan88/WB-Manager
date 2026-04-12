import { render, screen, waitFor, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '@/lib/auth'
import { userService } from '@/lib/api'

// Mock the API module
jest.mock('@/lib/api', () => ({
  userService: {
    getMe: jest.fn(),
  },
}))

// Mock window.location
const mockHref = jest.fn()
Object.defineProperty(window, 'location', {
  value: { href: { set: mockHref }, pathname: '/' },
  writable: true,
})

// Mock document.cookie
Object.defineProperty(document, 'cookie', {
  writable: true,
  value: '',
})

// Test component that uses useAuth
function TestComponent() {
  const { user, isLoaded, isLoggedIn, logout } = useAuth()
  
  if (!isLoaded) return <div>Loading...</div>
  
  return (
    <div>
      <div data-testid="user">{user ? user.name : 'No user'}</div>
      <div data-testid="loggedIn">{isLoggedIn ? 'Yes' : 'No'}</div>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    document.cookie = ''
  })

  it('shows loading state initially', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('fetches user on mount', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '',
      address: '',
      role: 'user',
      avatar: '',
    }
    
    ;(userService.getMe as jest.Mock).mockResolvedValueOnce({ data: { user: mockUser } })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user')).toHaveTextContent('John Doe')
    })
    
    expect(screen.getByTestId('loggedIn')).toHaveTextContent('Yes')
  })

  it('handles 401 unauthorized', async () => {
    ;(userService.getMe as jest.Mock).mockRejectedValueOnce({
      response: { status: 401 },
    })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('loggedIn')).toHaveTextContent('No')
    })
    
    expect(document.cookie).toContain('jwt=')
  })

  it('handles logout', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '',
      address: '',
      role: 'user',
      avatar: '',
    }
    
    ;(userService.getMe as jest.Mock).mockResolvedValueOnce({ data: { user: mockUser } })
    global.fetch = jest.fn().mockResolvedValueOnce({ ok: true })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('loggedIn')).toHaveTextContent('Yes')
    })
    
    await act(async () => {
      screen.getByText('Logout').click()
    })
    
    await waitFor(() => {
      expect(screen.getByTestId('loggedIn')).toHaveTextContent('No')
    })
    
    expect(document.cookie).toContain('jwt=')
    expect(mockHref).toHaveBeenCalledWith('/')
  })

  it('renders with initialUser', () => {
    const initialUser = {
      id: '1',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '',
      address: '',
      role: 'user',
      avatar: '',
    }
    
    render(
      <AuthProvider initialUser={initialUser}>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('user')).toHaveTextContent('Jane Doe')
    expect(screen.getByTestId('loggedIn')).toHaveTextContent('Yes')
  })

  it('throws error when useAuth is used outside AuthProvider', () => {
    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    
    function OutsideComponent() {
      useAuth()
      return null
    }
    
    expect(() => {
      render(<OutsideComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')
    
    consoleSpy.mockRestore()
  })
})
