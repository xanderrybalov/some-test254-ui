import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ApiService } from '../api'
import { API_CONFIG } from '../constants'

// Mock fetch
globalThis.fetch = vi.fn()

describe('ApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('get', () => {
    it('should make GET request with correct parameters', async () => {
      const mockResponse = { data: 'test' }
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      })
      globalThis.fetch = mockFetch

      const result = await ApiService.get('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/test`,
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
      expect(result).toBeTruthy()
    })


    it('should handle network errors', async () => {
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'))
      globalThis.fetch = mockFetch

      await expect(ApiService.get('/test')).rejects.toThrow('Network error')
    })
  })

  describe('post', () => {
    it('should make POST request with body', async () => {
      const testData = { name: 'test' }
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      })
      globalThis.fetch = mockFetch

      await ApiService.post('/test', testData)

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/test`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(testData),
        })
      )
    })

    it('should make POST request without body', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      })
      globalThis.fetch = mockFetch

      await ApiService.post('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/test`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })
  })

  describe('put', () => {
    it('should make PUT request with body', async () => {
      const testData = { name: 'updated' }
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      })
      globalThis.fetch = mockFetch

      await ApiService.put('/test', testData)

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/test`,
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(testData),
        })
      )
    })
  })

  describe('delete', () => {
    it('should make DELETE request', async () => {
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({}),
      })
      globalThis.fetch = mockFetch

      await ApiService.delete('/test')

      expect(mockFetch).toHaveBeenCalledWith(
        `${API_CONFIG.BASE_URL}/test`,
        expect.objectContaining({
          method: 'DELETE',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      )
    })
  })

  describe('handleResponse', () => {
    it('should return parsed JSON for successful response', async () => {
      const testData = { success: true }
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue(testData),
      } as any

      const result = await ApiService.handleResponse(mockResponse)
      expect(result).toEqual(testData)
    })

    it('should throw error for failed response', async () => {
      const errorData = { error: 'Bad request' }
      const mockResponse = {
        ok: false,
        status: 400,
        json: vi.fn().mockResolvedValue(errorData),
      } as any

      await expect(ApiService.handleResponse(mockResponse))
        .rejects.toThrow('Bad request')
    })

    it('should throw generic error when no error message in response', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        json: vi.fn().mockResolvedValue({}),
      } as any

      await expect(ApiService.handleResponse(mockResponse))
        .rejects.toThrow('HTTP error! status: 500')
    })

    it('should handle JSON parsing errors', async () => {
      const mockResponse = {
        ok: false,
        status: 400,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as any

      await expect(ApiService.handleResponse(mockResponse))
        .rejects.toThrow('Network error')
    })
  })
})
