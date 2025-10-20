// API Integration Layer for Tavarn.AI Backend
// This connects the frontend to your FastAPI backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

// Generic API call function
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.message || 'An error occurred',
      }
    }

    return { data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    }
  }
}

// Asset APIs
export const assetApi = {
  // Get all assets with optional filters
  getAll: async (filters?: {
    type?: string
    rarity?: string
    minPrice?: number
    maxPrice?: number
    search?: string
  }) => {
    const params = new URLSearchParams(filters as any)
    return apiCall<any[]>(`/api/assets?${params}`)
  },

  // Get single asset by ID
  getById: async (id: string) => {
    return apiCall<any>(`/api/assets/${id}`)
  },

  // Get AI-calculated price for an asset
  getAiPrice: async (assetId: string) => {
    return apiCall<{ price: number; confidence: number; factors: string[] }>(
      `/api/assets/${assetId}/ai-price`
    )
  },

  // Buy an asset
  buy: async (assetId: string, walletAddress: string) => {
    return apiCall<{ transactionHash: string; newPrice: number }>(
      `/api/assets/${assetId}/buy`,
      {
        method: 'POST',
        body: JSON.stringify({ walletAddress }),
      }
    )
  },

  // List asset for sale
  list: async (assetData: {
    name: string
    description: string
    type: string
    rarity: string
    game: string
    image: string
    attributes: any
    walletAddress: string
  }) => {
    return apiCall<{ assetId: string; initialPrice: number }>(
      `/api/assets/list`,
      {
        method: 'POST',
        body: JSON.stringify(assetData),
      }
    )
  },
}

// AI Price APIs
export const aiApi = {
  // Get AI price recalibration
  recalibrate: async (assetId: string) => {
    return apiCall<{
      newPrice: number
      oldPrice: number
      reason: string
      demandFactor: number
    }>(`/api/ai/recalibrate/${assetId}`, {
      method: 'POST',
    })
  },

  // Get market predictions
  getPredictions: async () => {
    return apiCall<{
      trending: string[]
      predictions: Array<{
        assetId: string
        predictedPrice: number
        confidence: number
      }>
    }>(`/api/ai/predictions`)
  },
}

// User/Wallet APIs
export const userApi = {
  // Get user profile and assets
  getProfile: async (walletAddress: string) => {
    return apiCall<{
      address: string
      assets: any[]
      transactions: any[]
      stats: {
        totalValue: number
        totalSales: number
        totalPurchases: number
      }
    }>(`/api/users/${walletAddress}`)
  },

  // Get wallet safety score
  getSafetyScore: async (walletAddress: string) => {
    return apiCall<{
      score: number
      factors: string[]
      risk: 'low' | 'medium' | 'high'
    }>(`/api/users/${walletAddress}/safety-score`)
  },

  // Enable/disable AI auto-pricing
  setAutoPricing: async (walletAddress: string, enabled: boolean) => {
    return apiCall<{ success: boolean }>(
      `/api/users/${walletAddress}/auto-pricing`,
      {
        method: 'POST',
        body: JSON.stringify({ enabled }),
      }
    )
  },
}

// Blacklist APIs
export const blacklistApi = {
  // Submit a report
  submitReport: async (report: {
    address: string
    reason: string
    evidence?: string
    reporterAddress: string
  }) => {
    return apiCall<{ reportId: string; status: string }>(
      `/api/blacklist/report`,
      {
        method: 'POST',
        body: JSON.stringify(report),
      }
    )
  },

  // Get verified scam addresses
  getVerified: async () => {
    return apiCall<
      Array<{
        address: string
        reason: string
        reports: number
        verified: boolean
        date: string
      }>
    >(`/api/blacklist/verified`)
  },

  // Check if address is blacklisted
  check: async (address: string) => {
    return apiCall<{ blacklisted: boolean; reason?: string }>(
      `/api/blacklist/check/${address}`
    )
  },
}

// Transaction APIs
export const transactionApi = {
  // Get transaction history
  getHistory: async (walletAddress: string) => {
    return apiCall<any[]>(`/api/transactions/${walletAddress}`)
  },

  // Get transaction details
  getById: async (transactionHash: string) => {
    return apiCall<any>(`/api/transactions/details/${transactionHash}`)
  },
}

// WebSocket connection for real-time updates
export function connectWebSocket(onMessage: (data: any) => void) {
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'
  const ws = new WebSocket(WS_URL)

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data)
    onMessage(data)
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  return ws
}

// Export all APIs
export default {
  asset: assetApi,
  ai: aiApi,
  user: userApi,
  blacklist: blacklistApi,
  transaction: transactionApi,
  ws: connectWebSocket,
}