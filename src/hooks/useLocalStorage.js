import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const prefixedKey = `stormglide_${key}`

  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(prefixedKey)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(prefixedKey, JSON.stringify(storedValue))
    } catch {
      // ignore
    }
  }, [prefixedKey, storedValue])

  return [storedValue, setStoredValue]
}
