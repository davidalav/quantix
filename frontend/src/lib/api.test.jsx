import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginUser } from './api'

describe('loginUser', () => {
  beforeEach(() => {
    global.fetch = vi.fn()
  })

  it('returns data on successful login', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'abc123', token_type: 'bearer' }),
    })

    const result = await loginUser({ username: 'david', password: 'secret' })

    expect(result.access_token).toBe('abc123')
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:8000/login/',
      expect.objectContaining({ method: 'POST' })
    )
  })

  it('throws error with detail message on failed login', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      json: async () => ({ detail: 'Invalid username or password' }),
    })

    await expect(
      loginUser({ username: 'david', password: 'wrong' })
    ).rejects.toThrow('Invalid username or password')
  })
})