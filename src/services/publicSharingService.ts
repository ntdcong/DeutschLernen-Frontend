import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface PublicShareResponse {
  publicShareToken: string;
  publicShareUrl: string;
  isPublicShareable: boolean;
  publicShareEnabledAt: string;
}

export interface PublicDeck {
  id: string;
  name: string;
  wordCount: number;
  createdAt: string;
  owner: {
    id: string;
    username: string;
    email: string;
  };
  words: Array<{
    id: string;
    german: string;
    vietnamese: string;
    example: string | null;
  }>;
}

export const publicSharingService = {
  // Owner endpoints (authenticated)
  async enableSharing(deckId: string, token: string): Promise<PublicShareResponse> {
    const res = await axios.post(
      `${API_BASE}/decks/${deckId}/public-share/enable`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data;
  },

  async disableSharing(deckId: string, token: string): Promise<void> {
    await axios.delete(
      `${API_BASE}/decks/${deckId}/public-share/disable`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  async regenerateToken(deckId: string, token: string): Promise<PublicShareResponse> {
    const res = await axios.post(
      `${API_BASE}/decks/${deckId}/public-share/regenerate`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data;
  },

  async getShareInfo(deckId: string, token: string): Promise<PublicShareResponse | null> {
    const res = await axios.get(
      `${API_BASE}/decks/${deckId}/public-share/info`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data.data;
  },

  // Public endpoints (no auth)
  async getPublicDeck(shareToken: string): Promise<PublicDeck> {
    const res = await axios.get(`${API_BASE}/public/decks/${shareToken}`);
    return res.data.data;
  },

  async getQRCode(shareToken: string, type: 'simple' | 'custom' = 'simple', size: number = 300): Promise<string> {
    // Note: 'size' param is temporarily removed due to backend validation bug (expects int, receives string)
    const res = await axios.get(
      `${API_BASE}/public/decks/${shareToken}/qr?type=${type}`
    );
    return res.data.data.qrCode;
  },

  getQRDownloadUrl(shareToken: string, type: 'simple' | 'custom' = 'simple', size: number = 300): string {
    // Note: 'size' param is temporarily removed due to backend validation bug
    return `${API_BASE}/public/decks/${shareToken}/qr/download?type=${type}`;
  },
};
