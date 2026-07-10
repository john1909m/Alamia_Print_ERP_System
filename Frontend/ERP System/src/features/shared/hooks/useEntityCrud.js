import { useState, useCallback, useEffect } from 'react'

export function useEntityCrud(service) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const result = await service.getAll()
        if (!cancelled) setData(result)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [service, reloadKey])

  const create = useCallback(
    async (values) => {
      await service.create(values)
      reload()
    },
    [service, reload],
  )

  const update = useCallback(
    async (id, values) => {
      await service.update(id, values)
      reload()
    },
    [service, reload],
  )

  const remove = useCallback(
    async (id) => {
      await service.delete(id)
      reload()
    },
    [service, reload],
  )

  return { data, loading, create, update, remove, reload }
}
