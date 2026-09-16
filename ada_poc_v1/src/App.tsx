import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import RemoteTerminalPage from './pages/RemoteTerminalPage';
import MessagePage from './pages/MessagePage';
import { WordPage, ElementPage } from './pages/GenericCRUDPage';
import LookupPage from './pages/LookupPage';
import PDFReportPage from './pages/PDFReportPage';
import PDFImportPage from './pages/PDFImportPage';
import MDBGenerationPage from './pages/MDBGenerationPage';
import type { NavPage } from './types';

export default function App() {
  const [page, setPage] = useState<NavPage>('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={setPage} />;
      case 'remote-terminal': return <RemoteTerminalPage />;
      case 'message': return <MessagePage />;
      case 'word': return <WordPage />;
      case 'element': return <ElementPage />;
      case 'lookup': return <LookupPage />;
      case 'pdf-report': return <PDFReportPage />;
      case 'pdf-import': return <PDFImportPage />;
      case 'mdb-generation': return <MDBGenerationPage />;
      default: return <Dashboard onNavigate={setPage} />;
    }
  };

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {renderPage()}
    </Layout>
  );
}
