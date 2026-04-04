'use client'

import { Component, ReactNode } from 'react'
import { logger } from '@/lib/logger'

interface TabErrorBoundaryProps {
  children: ReactNode
  tabName: string
  fallback?: ReactNode
}

interface TabErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

/**
 * Tab-specific error boundary
 * Isolates errors to individual tabs without crashing the entire dashboard
 */
export class TabErrorBoundary extends Component<TabErrorBoundaryProps, TabErrorBoundaryState> {
  constructor(props: TabErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): TabErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error(`TabErrorBoundary [${this.props.tabName}]:`, error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="p-6 bg-white rounded-2xl border border-red-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">
                {this.props.tabName} - Սխալ է տեղի ունեցել
              </h3>
              <p className="text-sm text-slate-500 mb-4">
                {process.env.NODE_ENV === 'development'
                  ? this.state.error?.message
                  : 'Այս բաժնի բեռնումը ձախողվեց։ Խնդրում ենք փորձել կրկին։'}
              </p>
              <button
                onClick={this.handleReset}
                className="px-4 py-2 bg-violet-600 text-white text-sm rounded-lg font-medium hover:bg-violet-700 transition-colors"
              >
                Փորձել կրկին
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
