import { useEffect, useState } from 'react'
import { getMoviesByCategory } from '../services/movieApi.js'

export function useMovies({ category, country }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const data = await getMoviesByCategory(category)

        const enriched = data.map((movie) => {
          const priceByCountry = movie.priceByCountry ?? {}
          const activePrice =
            priceByCountry[country] ??
            priceByCountry.IN ??
            priceByCountry.NP ??
            250

          return {
            ...movie,
            activePrice,
          }
        })

        if (!cancelled) {
          setMovies(enriched)
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to load movies.',
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [category, country])

  return { movies, loading, error }
}

