import { useEffect, useState } from "react"
import type { Rig } from "@/models/Rig"

export function useRig(rigId: string | undefined, enabled = true) {
  const [rig, setRig] = useState<Rig | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!enabled || !rigId) return

    const controller = new AbortController()
    setIsLoading(true)
    setError(null)

    async function load() {
      try {
        const response = await fetch(`/api/rigs?id=${encodeURIComponent(rigId!)}`, {
          signal: controller.signal,
        })
        if (!response.ok) throw new Error("Failed to load rig details")

        const [data] = (await response.json()) as Rig[]
        if (!data) throw new Error("Rig not found")
        if (!controller.signal.aborted) setRig(data)
      } catch (cause) {
        if (!controller.signal.aborted) {
          setError(cause instanceof Error ? cause.message : "Failed to load rig details")
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    void load()
    return () => controller.abort()
  }, [rigId, enabled])

  return { rig, isLoading, error }
}
