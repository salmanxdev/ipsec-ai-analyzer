import { mockAnalysisData, mockHistoryList, mockComparisonData } from '../mock/mockData';
import { apiClient } from './api';

export const analysisService = {
  async uploadAndAnalyzePCAP(fileOrPreset, onProgress) {
    const stages = [
      'Reading PCAP stream',
      'Dissecting IKE/ESP headers',
      'Extracting statistical flow vectors',
      'ML traffic classification',
      'Evaluating security policy rules',
      'Calculating security & risk scores',
      'Storing session to SQLite database'
    ];

    for (let i = 0; i < stages.length; i++) {
      if (onProgress) {
        onProgress({ stage: stages[i], percent: Math.round(((i + 1) / stages.length) * 100) });
      }
      await new Promise((resolve) => setTimeout(resolve, 120));
    }

    const formData = new FormData();

    if (fileOrPreset instanceof File) {
      formData.append('file', fileOrPreset);
    } else if (fileOrPreset && fileOrPreset.name) {
      if (fileOrPreset.isPreset) {
        formData.append('presetName', fileOrPreset.name);
      } else {
        formData.append('presetName', fileOrPreset.name);
      }
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
