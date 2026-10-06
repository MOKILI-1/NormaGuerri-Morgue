import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { BackofficeProvider, useBackoffice } from './context/BackofficeContext';
import { Shell } from './components/backoffice/Shell';
import { LoginPage } from './pages/backoffice/LoginPage';
import { PoleSelectPage } from './pages/backoffice/PoleSelectPage';
import { DashboardPage } from './pages/backoffice/DashboardPage';
import { OpsPage } from './pages/backoffice/OpsPage';
import { PaymentsHub } from './pages/backoffice/PaymentsHub';
import { CatalogPage } from './pages/backoffice/CatalogPage';
import { ReportsPage } from './pages/backoffice/ReportsPage';
import { AccessPage } from './pages/backoffice/AccessPage';
import { LandingPageContainer } from './pages/LandingPageContainer';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useBackoffice();
  if (!isLoggedIn) {
    return <LoginPage />;
  }
  return <>{children}</>;
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
          {/* 2. AUTHENTIFICATION BACK-OFFICE (OVERLAY / LOGIN)                         */}
          {/* ========================================================================= */}
          <Route path="/backoffice/login" element={<LoginPage />} />

          {/* ========================================================================= */}
          {/* 3. ACCUEIL SÉLECTION DE PÔLE : MORGUE OU FUNÉRARIUM (NORMA.JPEG)          */}
          {/* ========================================================================= */}
          <Route
            path="/backoffice/select-pole"
            element={
              <ProtectedRoute>
                <PoleSelectPage />
              </ProtectedRoute>
            }
          />

          {/* ========================================================================= */}
          {/* 4. MODULES DU BACK-OFFICE INTÉGRÉS DANS LE COMPOSANT SHELL LATÉRAL        */}
          {/* ========================================================================= */}
          <Route
            path="/backoffice"
            element={
              <ProtectedRoute>
                <Shell />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/backoffice/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="ops" element={<OpsPage />} />
            <Route path="invoices" element={<OpsPage />} />
            <Route path="payments" element={<PaymentsHub />} />
            <Route path="verify" element={<PaymentsHub />} />
            <Route path="catalog" element={<CatalogPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="accounting" element={<ReportsPage />} />
            <Route path="access" element={<AccessPage />} />
            <Route path="org" element={<AccessPage />} />
          </Route>

          {/* FALLBACK GÉNÉRAL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BackofficeProvider>
    </BrowserRouter>
  );
};

export default App;
