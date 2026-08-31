import { mockAnalysisData, mockHistoryList, mockComparisonData } from '../mock/mockData';
import { apiClient } from './api';

export const analysisService = {
  async uploadAndAnalyzePCAP(file, onProgress) {
    await apiClient.post('/analyze/pcap', { fileName: file.name, size: file.size });
    
    // Simulate multi-stage analysis pipeline
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
      await new Promise((resolve) => setTimeout(resolve, 350));
    }

    return mockAnalysisData;
  },

  async getAnalysisById(id) {
    await apiClient.get(`/analysis/${id}`);
    return mockAnalysisData;
  },

  async getHistory() {
    await apiClient.get('/analysis/history');
    return mockHistoryList;
  },

  async getComparisonData() {
    await apiClient.get('/analysis/compare');
    return mockComparisonData;
  }
};
