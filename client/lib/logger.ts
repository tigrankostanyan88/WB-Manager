/**
 * Conditional logger for development-only debugging
 * Prevents console output in production builds
 */

interface Logger {
  log: (...args: unknown[]) => void
  warn: (...args: unknown[]) => void
  error: (...args: unknown[]) => void
  info: (...args: unknown[]) => void
  debug: (...args: unknown[]) => void
}

const NO_OP = () => {}

const isDev = process.env.NODE_ENV === 'development'

/**
 * Development-only logger
 * All methods are no-ops in production to prevent console noise
 * Use for debugging complex logic without worrying about production cleanup
 */
export const logger: Logger = {
  log: isDev ? console.log : NO_OP,
  warn: isDev ? console.warn : NO_OP,
  error: console.error, // Always log errors (they need attention)
  info: isDev ? console.info : NO_OP,
  debug: isDev ? console.debug : NO_OP,
}

/**
 * Create a namespaced logger for component/feature specific logging
 * @param namespace - Prefix for all log messages (e.g., 'Auth', 'API', 'Course')
 * @returns Logger with prefixed messages
 */
export function createLogger(namespace: string): Logger {
  const prefix = `[${namespace}]`
  
  return {
    log: isDev ? (...args) => console.log(prefix, ...args) : NO_OP,
    warn: isDev ? (...args) => console.warn(prefix, ...args) : NO_OP,
    error: (...args) => console.error(prefix, ...args),
    info: isDev ? (...args) => console.info(prefix, ...args) : NO_OP,
    debug: isDev ? (...args) => console.debug(prefix, ...args) : NO_OP,
  }
}

export default logger
