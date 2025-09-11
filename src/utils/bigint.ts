/**
 * Utility functions for handling BigInt values in React applications
 * React Query and JSON.stringify cannot handle BigInt values natively
 */

/**
 * Recursively converts BigInt values to strings in an object
 * This is useful for React Query keys and anywhere JSON serialization is needed
 */
export function serializeBigInts(obj: any): any {
  if (obj === null || obj === undefined) {
    return obj
  }
  
  if (typeof obj === 'bigint') {
    return obj.toString()
  }
  
  if (Array.isArray(obj)) {
    return obj.map(serializeBigInts)
  }
  
  if (typeof obj === 'object') {
    const serialized: any = {}
    for (const [key, value] of Object.entries(obj)) {
      serialized[key] = serializeBigInts(value)
    }
    return serialized
  }
  
  return obj
}

/**
 * Safely stringify objects that may contain BigInt values
 * Useful for debugging and logging
 */
export function safeStringify(obj: any, space?: number): string {
  try {
    return JSON.stringify(serializeBigInts(obj), null, space)
  } catch (error) {
    console.warn('Failed to stringify object:', error)
    return '[Object with unstringifiable values]'
  }
}

/**
 * Create a React Query key from objects that may contain BigInt values
 */
export function createQueryKey(...args: any[]): any[] {
  return args.map(serializeBigInts)
}

/**
 * Safe console.log for objects that may contain BigInt values
 */
export function safeLog(message: string, ...args: any[]) {
  const serializedArgs = args.map(arg => 
    typeof arg === 'object' ? serializeBigInts(arg) : arg
  )
  console.log(message, ...serializedArgs)
}
