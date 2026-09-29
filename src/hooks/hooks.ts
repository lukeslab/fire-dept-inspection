import { useState, useEffect, useCallback } from "react"
import type { Rig } from "@/models/Rig"

export function useRigs(enabled = true) {
  const [rigs, setRigs] = useState<Rig[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadRigs = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("/api/rigs")
      if (!response.ok) throw new Error(`Error fetching rigs: ${response.statusText}`)

      setRigs(await response.json())
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (enabled) void loadRigs()
  }, [enabled, loadRigs])

  return {
    rigs,
    isLoading,
    error,
    loadRigs,
  }
}
