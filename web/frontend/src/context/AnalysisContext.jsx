import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockAnalysisData, mockHistoryList } from '../mock/mockData';
import { analysisService } from '../services/analysisService';
import { liveCaptureService } from '../services/liveCaptureService';

const AnalysisContext = createContext();

export const AnalysisProvider = ({ children }) => {
  const [currentAnalysis, setCurrentAnalysis] = useState(mockAnalysisData);
  const [activePage, setActivePage] = useState('dashboard');
  const [activeAnalysisMode, setActiveAnalysisMode] = useState('pcap');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(null);
  const [history, setHistory] = useState(mockHistoryList);

  // Live Capture State
  const [isCapturing, setIsCapturing] = useState(false);
  const [liveState, setLiveState] = useState({
    interface: 'eth0',
    duration: 60,
    status: 'STOPPED',
    packets: 0,
    ike: 0,
    esp: 0,
    ah: 0,
    other: 0,
    detectedVpn: 'Searching...',
    ikeVersion: '-',
    trafficType: '-',
    confidence: 0,
    logs: []
  });

  const refreshHistory = async () => {
    try {
      const hist = await analysisService.getHistory();
      if (hist && Array.isArray(hist) && hist.length > 0) {
        setHistory(hist);
      }
    } catch (err) {
      console.warn('Could not fetch history from API:', err);
    }
  };

  useEffect(() => {
    refreshHistory();
  }, []);

  const startPcapAnalysis = async (fileOrPreset) => {
    setIsAnalyzing(true);
    try {
      const result = await analysisService.uploadAndAnalyzePCAP(fileOrPreset, (prog) => {
        setAnalysisProgress(prog);
      });
      if (result && result.id) {
        setCurrentAnalysis(result);
        await refreshHistory();
        setActivePage('dashboard');
      }
    } catch (err) {
      console.error('Failed PCAP Analysis', err);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  const startLiveCapture = async (interfaceName = 'eth0') => {
    setIsCapturing(true);
    await liveCaptureService.startLiveCapture(interfaceName, (updatedState) => {
      setLiveState(updatedState);
    });
  };

  const stopLiveCapture = async () => {
    await liveCaptureService.stopLiveCapture();
    setIsCapturing(false);
    setLiveState((prev) => ({ ...prev, status: 'STOPPED' }));
  };

  const selectHistorySession = async (id) => {
    const sessionData = await analysisService.getAnalysisById(id);
    if (sessionData) {
      setCurrentAnalysis(sessionData);
      setActivePage('dashboard');
    }
  };

  return (
    <AnalysisContext.Provider
      value={{
        currentAnalysis,
        activePage,
        setActivePage,
        activeAnalysisMode,
        setActiveAnalysisMode,
        isAnalyzing,
        analysisProgress,
        startPcapAnalysis,
        isCapturing,
        liveState,
        startLiveCapture,
        stopLiveCapture,
        history,
        selectHistorySession,
        refreshHistory
      }}
    >
      {children}
    </AnalysisContext.Provider>
  );
};

export const useAnalysisContext = () => useContext(AnalysisContext);
