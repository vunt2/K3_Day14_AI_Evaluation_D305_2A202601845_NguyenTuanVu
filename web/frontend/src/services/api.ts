import axios from 'axios';
import {
  SummaryData,
  CaseItem,
  CaseDetail,
  FailureAnalysisData,
  ChatResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  async checkHealth(): Promise<{ status: string; live_chat_available: boolean }> {
    const res = await apiClient.get('/health');
    return res.data;
  },

  async getSummary(): Promise<SummaryData> {
    const res = await apiClient.get('/summary');
    return res.data;
  },

  async getCases(filters?: {
    difficulty?: string;
    passed?: boolean;
    failure_type?: string;
    search?: string;
  }): Promise<CaseItem[]> {
    const params: Record<string, any> = {};
    if (filters?.difficulty) params.difficulty = filters.difficulty;
    if (filters?.passed !== undefined) params.passed = filters.passed;
    if (filters?.failure_type) params.failure_type = filters.failure_type;
    if (filters?.search) params.search = filters.search;

    const res = await apiClient.get('/cases', { params });
    return res.data;
  },

  async getCaseDetail(caseId: string): Promise<CaseDetail> {
    const res = await apiClient.get(`/cases/${caseId}`);
    return res.data;
  },

  async getFailureAnalysis(): Promise<FailureAnalysisData> {
    const res = await apiClient.get('/failure-analysis');
    return res.data;
  },

  async sendLiveChat(question: string): Promise<ChatResponse> {
    const res = await apiClient.post('/chat', {
      question,
      mode: 'live',
    });
    return res.data;
  },
};
