import apiClient from './api';
import axios from 'axios'; 

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000') + '/api';

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
  async enableSharing(deckId: string): Promise<PublicShareResponse> {
    const res = await apiClient.post(`/decks/${deckId}/public-share/enable`);
    return res.data.data;
  },

  async disableSharing(deckId: string): Promise<void> {
    await apiClient.delete(`/decks/${deckId}/public-share/disable`);
  },

  async regenerateToken(deckId: string): Promise<PublicShareResponse> {
    const res = await apiClient.post(`/decks/${deckId}/public-share/regenerate`);
    return res.data.data;
  },

  async getShareInfo(deckId: string): Promise<PublicShareResponse | null> {
    const res = await apiClient.get(`/decks/${deckId}/public-share/info`);
    return res.data.data;
  },

  async getPublicDeck(shareToken: string): Promise<PublicDeck> {
    const res = await axios.get(`${API_BASE}/public/decks/${shareToken}`);
    return res.data.data;
  },

  async getQRCode(shareToken: string, type: 'simple' | 'custom' = 'simple', size: number = 300): Promise<string> {
    const res = await axios.get(
      `${API_BASE}/public/decks/${shareToken}/qr?type=${type}`
    );
    return res.data.data.qrCode;
  },

  getQRDownloadUrl(shareToken: string, type: 'simple' | 'custom' = 'simple', size: number = 300): string {
    return `${API_BASE}/public/decks/${shareToken}/qr/download?type=${type}`;
  },
};
