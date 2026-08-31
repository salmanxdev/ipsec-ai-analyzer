import React from 'react';
import { AnalysisProvider, useAnalysisContext } from './context/AnalysisContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';

import { Dashboard } from './pages/Dashboard';
import { Analyze } from './pages/Analyze';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { HistoryPage } from './pages/HistoryPage';
import { AIInsightsPage } from './pages/AIInsightsPage';

import { TrafficAnalysis } from './components/TrafficAnalysis';
import { SecurityFindings } from './components/SecurityFindings';
import { ThreatMatrix } from './components/ThreatMatrix';
import { EvidenceViewer } from './components/evidence/EvidenceViewer';
import { ComparisonView } from './components/compare/ComparisonView';

import './styles/global.css';
import './styles/components.css';

const MainContent = () => {
  const { activePage, currentAnalysis } = useAnalysisContext();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'analyze':
        return <Analyze />;
      case 'traffic':
        return <TrafficAnalysis trafficData={currentAnalysis.trafficAnalysis} />;
      case 'security':
        return <SecurityFindings securityAssessment={currentAnalysis.securityAssessment} />;
      case 'threats':
        return <ThreatMatrix threats={currentAnalysis.threatMatrix} />;
      case 'ai':
        return <AIInsightsPage />;
      case 'evidence':
        return <EvidenceViewer />;
      case 'compare':
        return <ComparisonView />;
      case 'reports':
        return <Reports />;
      case 'history':
        return <HistoryPage />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-wrapper">
        <Navbar />
        <main className="page-content">
          {renderCurrentPage()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AnalysisProvider>
      <MainContent />
    </AnalysisProvider>
  );
}
