import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EmptyState } from '@/components/ui/empty-state'
import { UserX, Search } from 'lucide-react'

describe('EmptyState', () => {
  it('renders with title only', () => {
    render(<EmptyState title="Ոչինչ չի գտնվել" />)
    
    expect(screen.getByText('Ոչինչ չի գտնվել')).toBeInTheDocument()
  })

  it('renders with title and description', () => {
    render(
      <EmptyState 
        title="Օգտվողներ չկան" 
        description="Այս պահին օգտվողներ չկան" 
      />
    )
    
    expect(screen.getByText('Օգտվողներ չկան')).toBeInTheDocument()
    expect(screen.getByText('Այս պահին օգտվողներ չկան')).toBeInTheDocument()
  })

  it('renders with custom icon', () => {
    render(<EmptyState title="Սխալ" icon={UserX} />)
    
    expect(screen.getByText('Սխալ')).toBeInTheDocument()
    // Icon should be rendered (visual test)
  })

  it('applies custom className', () => {
    const { container } = render(
      <EmptyState title="Test" className="custom-class" />
    )
    
    expect(container.firstChild).toHaveClass('custom-class')
  })
})
