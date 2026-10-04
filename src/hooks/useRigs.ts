import { useState, useEffect } from "react"
import type { Rig } from "@/models/Rig"

export function useRigs() {
  const [rigs, setRigs] = useState<Rig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRigs()
  }, [])

  return {
    rigs,
    isLoading,
    error,
    loadRigs,
  }
  
  async function loadRigs() {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/rigs")

      if (!response.ok) {
        throw new Error(`Error fetching rigs: ${response.statusText}`)
      }

      const data = await response.json()
      setRigs(data)
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      )
    } finally {
      setIsLoading(false)
    }
  }
}

