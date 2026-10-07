import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RoleUtilisateur, Utilisateur } from '@nomarguerrie/shared-types';

export type PoleMetier = 'MORGUE' | 'FUNERARIUM';
export type AppTheme = 'dark' | 'light';

export interface CaisseSession {
  estOuverte: boolean;
  referenceSession: string;
  heureOuverture: string;
  fondDeRoulementUSD: number;
  fondDeRoulementCDF: number;
  caissierNom: string;
  totalEncaisseLiquideUSD: number;
  totalEncaisseLiquideCDF: number;
  statut: 'OUVERTE' | 'CLOTUREE';
}

export interface UserSession extends Utilisateur {
  actorId: string;
  directionRattachee: 'DIRECTION_MORGUE' | 'DIRECTION_FUNERARIUM' | 'CAISSE_CENTRALE' | 'DIRECTION_GENERALE';
}

interface BackofficeContextType {
  currentUser: UserSession | null;
  currentPole: PoleMetier;
  hasSelectedPole: boolean;
  caisseSession: CaisseSession;
  isLoggedIn: boolean;
  theme: AppTheme;
  toggleTheme: () => void;
  targetPole: PoleMetier | null;
  setTargetPole: (pole: PoleMetier | null) => void;
  login: (user: UserSession) => void;
  loginWithPole: (user: UserSession, pole: PoleMetier) => { success: boolean; error?: string };
  logout: () => void;
  setCurrentPole: (pole: PoleMetier) => void;
  resetPoleSelection: () => void;
  ouvrirCaisse: (fondUSD: number, fondCDF: number) => void;
  fermerCaisse: (comptageUSD: number, comptageCDF: number) => { ecartUSD: number; ecartCDF: number };
  ajouterEncaissementLiquide: (montantUSD: number, montantCDF: number) => void;
}

const DEFAULT_CAISSE: CaisseSession = {
  estOuverte: true,
  referenceSession: 'CS-2026-10-0042',
  heureOuverture: new Date().toISOString(),
  fondDeRoulementUSD: 200,
  fondDeRoulementCDF: 500000,
  caissierNom: 'Nathalie TSHILOMBA',
  totalEncaisseLiquideUSD: 1450,
  totalEncaisseLiquideCDF: 3850000,
  statut: 'OUVERTE'
};

const BackofficeContext = createContext<BackofficeContextType | undefined>(undefined);

export const BackofficeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Thème Light / Dark persistant
  const [theme, setTheme] = useState<AppTheme>(() => {
    try {
      const saved = localStorage.getItem('nomarguerrie_bo_theme');
      return (saved === 'light' || saved === 'dark') ? saved : 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('nomarguerrie_bo_theme', next);
      return next;
    });
  };

  // Par défaut, pas d'utilisateur connecté au démarrage
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('nomarguerrie_bo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Pôle ciblé lors du premier clic sur la page de sélection (Morgue ou Funérarium)
  const [targetPole, setTargetPole] = useState<PoleMetier | null>(null);

  const [hasSelectedPole, setHasSelectedPole] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('nomarguerrie_bo_pole_selected') === 'true';
    } catch {
      return false;
    }
  });

  const [currentPole, setCurrentPoleState] = useState<PoleMetier>(() => {
    try {
      const saved = sessionStorage.getItem('nomarguerrie_bo_pole');
      return (saved === 'FUNERARIUM' ? 'FUNERARIUM' : 'MORGUE') as PoleMetier;
    } catch {
      return 'MORGUE';
    }
  });

  const [caisseSession, setCaisseSession] = useState<CaisseSession>(() => {
    try {
      const saved = localStorage.getItem('nomarguerrie_bo_caisse');
      return saved ? JSON.parse(saved) : DEFAULT_CAISSE;
    } catch {
      return DEFAULT_CAISSE;
    }
  });

  const setCurrentPole = (pole: PoleMetier) => {
    setCurrentPoleState(pole);
    setHasSelectedPole(true);
    sessionStorage.setItem('nomarguerrie_bo_pole', pole);
    sessionStorage.setItem('nomarguerrie_bo_pole_selected', 'true');
  };

  const resetPoleSelection = () => {
    setHasSelectedPole(false);
    setTargetPole(null);
    sessionStorage.removeItem('nomarguerrie_bo_pole_selected');
  };

  // Authentification avec vérification stricte de l'affectation au pôle sélectionné
  const loginWithPole = (user: UserSession, pole: PoleMetier): { success: boolean; error?: string } => {
    // 1. Super Admin (Direction Générale) : accès universel absolu
    if (user.directionRattachee === 'DIRECTION_GENERALE') {
      setCurrentUser(user);
      setCurrentPole(pole);
      sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
      return { success: true };
    }

    // 2. Caisse Centrale : accès transverse aux deux pôles pour facturation/paiement
    if (user.directionRattachee === 'CAISSE_CENTRALE') {
      setCurrentUser(user);
      setCurrentPole(pole);
      sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
      return { success: true };
    }

    // 3. Contrôle Pôle Morgue
    if (pole === 'MORGUE') {
      if (user.directionRattachee === 'DIRECTION_MORGUE') {
        setCurrentUser(user);
        setCurrentPole(pole);
        sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
        return { success: true };
      } else {
        return {
          success: false,
          error: `Accès non autorisé : Le compte de ${user.prenom} ${user.nom} est rattaché au Pôle Funérarium. Vous n'avez pas l'accréditation requise pour la Morgue. Seul le Super Admin (Direction Générale) dispose d'un accès universel.`
        };
      }
    }

    // 4. Contrôle Pôle Funérarium
    if (pole === 'FUNERARIUM') {
      if (user.directionRattachee === 'DIRECTION_FUNERARIUM') {
        setCurrentUser(user);
        setCurrentPole(pole);
        sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
        return { success: true };
      } else {
        return {
          success: false,
          error: `Accès non autorisé : Le compte de ${user.prenom} ${user.nom} est rattaché au Pôle Morgue. Vous n'avez pas l'accréditation requise pour le Funérarium. Seul le Super Admin (Direction Générale) dispose d'un accès universel.`
        };
      }
    }

    return {
      success: false,
      error: "Accréditation insuffisante pour ce pôle."
    };
  };

  const logout = () => {
    setCurrentUser(null);
    setHasSelectedPole(false);
    setTargetPole(null);
    sessionStorage.removeItem('nomarguerrie_bo_user');
    sessionStorage.removeItem('nomarguerrie_bo_pole_selected');
    localStorage.removeItem('nomarguerrie_bo_user');
    localStorage.removeItem('nomarguerrie_bo_pole');
  };

  const ouvrirCaisse = (fondUSD: number, fondCDF: number) => {
    const nouvelleSession: CaisseSession = {
      estOuverte: true,
      referenceSession: `CS-${new Date().toISOString().slice(0, 10)}-${Math.floor(1000 + Math.random() * 9000)}`,
      heureOuverture: new Date().toISOString(),
      fondDeRoulementUSD: fondUSD,
      fondDeRoulementCDF: fondCDF,
      caissierNom: currentUser ? `${currentUser.prenom} ${currentUser.nom}` : 'Caissier Guichet',
      totalEncaisseLiquideUSD: 0,
      totalEncaisseLiquideCDF: 0,
      statut: 'OUVERTE'
    };
    setCaisseSession(nouvelleSession);
    localStorage.setItem('nomarguerrie_bo_caisse', JSON.stringify(nouvelleSession));
  };

  const fermerCaisse = (comptageUSD: number, comptageCDF: number) => {
    const attenduUSD = caisseSession.fondDeRoulementUSD + caisseSession.totalEncaisseLiquideUSD;
    const attenduCDF = caisseSession.fondDeRoulementCDF + caisseSession.totalEncaisseLiquideCDF;
    const ecartUSD = comptageUSD - attenduUSD;
    const ecartCDF = comptageCDF - attenduCDF;

    const sessionCloturee: CaisseSession = {
      ...caisseSession,
      estOuverte: false,
      statut: 'CLOTUREE'
    };
    setCaisseSession(sessionCloturee);
    localStorage.setItem('nomarguerrie_bo_caisse', JSON.stringify(sessionCloturee));

    return { ecartUSD, ecartCDF };
  };

  const ajouterEncaissementLiquide = (montantUSD: number, montantCDF: number) => {
    setCaisseSession((prev) => {
      const maj: CaisseSession = {
        ...prev,
        totalEncaisseLiquideUSD: prev.totalEncaisseLiquideUSD + montantUSD,
        totalEncaisseLiquideCDF: prev.totalEncaisseLiquideCDF + montantCDF
      };
      localStorage.setItem('nomarguerrie_bo_caisse', JSON.stringify(maj));
      return maj;
    });
  };

  const login = (user: UserSession) => {
    setCurrentUser(user);
    sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
  };

  return (
    <BackofficeContext.Provider
      value={{
        currentUser,
        currentPole,
        hasSelectedPole,
        caisseSession,
        isLoggedIn: currentUser !== null,
        theme,
        toggleTheme,
        targetPole,
        setTargetPole,
        login,
        loginWithPole,
        logout,
        setCurrentPole,
        resetPoleSelection,
        ouvrirCaisse,
        fermerCaisse,
        ajouterEncaissementLiquide
      }}
    >
      {children}
    </BackofficeContext.Provider>
  );
};

export const useBackoffice = (): BackofficeContextType => {
  const context = useContext(BackofficeContext);
  if (!context) {
    throw new Error('useBackoffice must be used within a BackofficeProvider');
  }
  return context;
};
