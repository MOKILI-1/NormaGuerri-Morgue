import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BackofficeProvider, useBackoffice } from './context/BackofficeContext';
import { Shell } from './components/backoffice/Shell';
import { PoleSelectPage } from './pages/backoffice/PoleSelectPage';
import { DashboardPage } from './pages/backoffice/DashboardPage';
import { OpsPage } from './pages/backoffice/OpsPage';
import { PaymentsHub } from './pages/backoffice/PaymentsHub';
import { CatalogPage } from './pages/backoffice/CatalogPage';
import { ReportsPage } from './pages/backoffice/ReportsPage';
import { AccessPage } from './pages/backoffice/AccessPage';
import { SuperAdminPage } from './pages/backoffice/SuperAdminPage';
import { LandingPageContainer } from './pages/LandingPageContainer';

// Point d'entrée du Backoffice : 1ère page = Sélection du pôle (Morgue ou Funérarium)
// C'est après avoir cliqué sur un pôle que l'overlay de login s'affiche
const BackofficeEntry: React.FC = () => {
  const { isLoggedIn, hasSelectedPole } = useBackoffice();

  if (isLoggedIn && hasSelectedPole) {
    return <Navigate to="/backoffice/dashboard" replace />;
  }

  return <PoleSelectPage />;
};

// Protection du Shell et des sous-modules métier
const ProtectedShell: React.FC = () => {
  const { isLoggedIn, hasSelectedPole } = useBackoffice();

  if (!isLoggedIn || !hasSelectedPole) {
    return <Navigate to="/backoffice" replace />;
  }

  return <Shell />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <BackofficeProvider>
        <Routes>
          {/* ========================================================================= */}
          {/* 1. PORTAIL PUBLIC : LANDING PAGE FAMILLES                                 */}
          {/* ========================================================================= */}
          <Route path="/" element={<LandingPageContainer />} />

          {/* ========================================================================= */}
          {/* 2. ACCUEIL DU BACKOFFICE : 1ÈRE PAGE = SÉLECTION MORGUE / FUNÉRARIUM       */}
          {/*    (Le clic sur l'un déclenche ensuite l'overlay de connexion sécurisée)  */}
          {/* ========================================================================= */}
          <Route path="/backoffice" element={<BackofficeEntry />} />
          <Route path="/backoffice/login" element={<BackofficeEntry />} />
          <Route path="/backoffice/select-pole" element={<BackofficeEntry />} />

          {/* ========================================================================= */}
          {/* 3. MODULES MÉTIERS PROTÉGÉS APRÈS VALIDATION DU PÔLE ET DE LA SESSION     */}
          {/* ========================================================================= */}
          <Route element={<ProtectedShell />}>
            <Route path="/backoffice/dashboard" element={<DashboardPage />} />
            <Route path="/backoffice/ops" element={<OpsPage />} />
            <Route path="/backoffice/invoices" element={<OpsPage />} />
            <Route path="/backoffice/payments" element={<PaymentsHub />} />
            <Route path="/backoffice/verify" element={<PaymentsHub />} />
            <Route path="/backoffice/catalog" element={<CatalogPage />} />
            <Route path="/backoffice/reports" element={<ReportsPage />} />
            <Route path="/backoffice/accounting" element={<ReportsPage />} />
            <Route path="/backoffice/access" element={<SuperAdminPage />} />
            <Route path="/backoffice/org" element={<SuperAdminPage />} />
            <Route path="/backoffice/admin" element={<SuperAdminPage />} />
            <Route path="/backoffice/super-admin" element={<SuperAdminPage />} />
          </Route>

          {/* FALLBACK GÉNÉRAL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BackofficeProvider>
    </BrowserRouter>
  );
};

export default App;
