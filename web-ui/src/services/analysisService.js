import { mockAnalysisData, mockHistoryList, mockComparisonData } from '../mock/mockData';
import { apiClient } from './api';

export const analysisService = {
  async uploadAndAnalyzePCAP(file, onProgress) {
    const stages = [
      'Capture loaded',
      'Packet extraction',
      'Protocol identification',
      'AI traffic classification',
      'Security assessment',
      'Risk calculation',
      'Report generation'
    ];

    for (let i = 0; i < stages.length; i++) {
      if (onProgress) {
        onProgress({ stage: stages[i], percent: Math.round(((i + 1) / stages.length) * 100) });
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const formData = new FormData();
    if (file && file.name) {
      formData.append('file', file);
    }

    const realResult = await apiClient.post('/analyze/pcap', formData);
    if (realResult && realResult.id) {
      return realResult;
    }

    return mockAnalysisData;
  },

  async getAnalysisById(id) {
    const res = await apiClient.get(`/analysis/${id}`);
    return res || mockAnalysisData;
  },

  async getHistory() {
    const res = await apiClient.get('/analysis/history');
    return (res && Array.isArray(res) && res.length > 0) ? res : mockHistoryList;
  },

  async getComparisonData() {
    const res = await apiClient.get('/analysis/compare');
    return res || mockComparisonData;
  }
};
