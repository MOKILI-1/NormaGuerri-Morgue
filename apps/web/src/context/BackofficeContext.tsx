import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RoleUtilisateur, Utilisateur } from '@nomarguerrie/shared-types';

export type PoleMetier = 'MORGUE' | 'FUNERARIUM';

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
  login: (user: UserSession) => void;
  logout: () => void;
  setCurrentPole: (pole: PoleMetier) => void;
  resetPoleSelection: () => void;
  ouvrirCaisse: (fondUSD: number, fondCDF: number) => void;
  fermerCaisse: (comptageUSD: number, comptageCDF: number) => { ecartUSD: number; ecartCDF: number };
  ajouterEncaissementLiquide: (montantUSD: number, montantCDF: number) => void;
}

const DEFAULT_USER: UserSession = {
  id: 'usr-1',
  nom: 'MUTOMBO',
  prenom: 'Éric',
  email: 'eric.mutombo@nomargueri.cd',
  role: 'RESPONSABLE_EXPLOITATION',
  niveauAccreditation: 4,
  estActif: true,
  telephone: '+243997222228',
  creeLe: '2026-01-10T08:00:00Z',
  actorId: 'ACT-DIR-001',
  directionRattachee: 'DIRECTION_MORGUE'
};

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
  // Par défaut, pas d'utilisateur connecté pour forcer l'affichage de la page de login en overlay
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = sessionStorage.getItem('nomarguerrie_bo_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

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
    sessionStorage.removeItem('nomarguerrie_bo_pole_selected');
  };

  const login = (user: UserSession) => {
    setCurrentUser(user);
    setHasSelectedPole(false); // Oblige à passer par la page de sélection des 2 cases
    sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
    sessionStorage.removeItem('nomarguerrie_bo_pole_selected');
  };

  const logout = () => {
    setCurrentUser(null);
    setHasSelectedPole(false);
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

  return (
    <BackofficeContext.Provider
      value={{
        currentUser,
        currentPole,
        hasSelectedPole,
        caisseSession,
        isLoggedIn: currentUser !== null,
        login,
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
