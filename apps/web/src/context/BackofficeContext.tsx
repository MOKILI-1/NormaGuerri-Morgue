import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RoleUtilisateur, Utilisateur, NiveauAccreditation } from '@nomarguerrie/shared-types';

export type PoleMetier = 'MORGUE' | 'FUNERARIUM' | 'SUPER_ADMIN';
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
  polesAutorises?: 'MORGUE' | 'FUNERARIUM' | 'LES_DEUX';
  motDePasse?: string;
}

export interface ManagedAccount extends UserSession {
  motDePasse: string;
  polesAutorises: 'MORGUE' | 'FUNERARIUM' | 'LES_DEUX';
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
  // Gestion dynamique des accès par le Super Admin
  managedAccounts: ManagedAccount[];
  createAccount: (account: Omit<ManagedAccount, 'id' | 'creeLe'>) => ManagedAccount;
  updateAccount: (id: string, updates: Partial<ManagedAccount>) => void;
  toggleAccountStatus: (id: string) => void;
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

export const DEFAULT_ACCOUNTS: ManagedAccount[] = [
  {
    id: 'usr-1',
    nom: 'MUTOMBO',
    prenom: 'Éric',
    email: 'eric.mutombo@nomargueri.cd',
    motDePasse: 'Morgue2026!',
    role: 'RESPONSABLE_EXPLOITATION',
    niveauAccreditation: 4,
    estActif: true,
    telephone: '+243997222228',
    creeLe: '2026-01-10T08:00:00Z',
    actorId: 'ACT-EXP-001',
    directionRattachee: 'DIRECTION_MORGUE',
    polesAutorises: 'MORGUE'
  },
  {
    id: 'usr-4',
    nom: 'LUMUMBA',
    prenom: 'Clarisse',
    email: 'clarisse.lumumba@nomargueri.cd',
    motDePasse: 'Funer2026!',
    role: 'AGENT_RECEPTION',
    niveauAccreditation: 2,
    estActif: true,
    telephone: '+243810000004',
    creeLe: '2026-02-01T08:00:00Z',
    actorId: 'ACT-FUN-004',
    directionRattachee: 'DIRECTION_FUNERARIUM',
    polesAutorises: 'FUNERARIUM'
  },
  {
    id: 'usr-3',
    nom: 'KASANDA',
    prenom: 'Aimé',
    email: 'direction@nomargueri.cd',
    motDePasse: 'Admin2026!',
    role: 'DIRECTION',
    niveauAccreditation: 5,
    estActif: true,
    telephone: '+243997222228',
    creeLe: '2026-01-15T08:00:00Z',
    actorId: 'ACT-DG-003',
    directionRattachee: 'DIRECTION_GENERALE',
    polesAutorises: 'LES_DEUX'
  },
  {
    id: 'usr-2',
    nom: 'TSHILOMBA',
    prenom: 'Nathalie',
    email: 'nathalie.tshilomba@nomargueri.cd',
    motDePasse: 'Caisse2026!',
    role: 'COMPTABLE',
    niveauAccreditation: 3,
    estActif: true,
    telephone: '+243833330040',
    creeLe: '2026-01-12T08:00:00Z',
    actorId: 'ACT-CAISSE-002',
    directionRattachee: 'CAISSE_CENTRALE',
    polesAutorises: 'LES_DEUX'
  },
  {
    id: 'usr-5',
    nom: 'ILUNGA',
    prenom: 'Christian (Dr)',
    email: 'dr.ilunga@nomargueri.cd',
    motDePasse: 'Legiste2026!',
    role: 'MEDICO_LEGAL',
    niveauAccreditation: 4,
    estActif: true,
    telephone: '+243810000005',
    creeLe: '2026-01-18T08:00:00Z',
    actorId: 'ACT-MED-005',
    directionRattachee: 'DIRECTION_MORGUE',
    polesAutorises: 'MORGUE'
  },
  {
    id: 'usr-6',
    nom: 'MUKENDI',
    prenom: 'Serge',
    email: 'serge.mukendi@nomargueri.cd',
    motDePasse: 'Convoi2026!',
    role: 'RESPONSABLE_EXPLOITATION',
    niveauAccreditation: 4,
    estActif: true,
    telephone: '+243810000006',
    creeLe: '2026-01-20T08:00:00Z',
    actorId: 'ACT-LOG-006',
    directionRattachee: 'DIRECTION_FUNERARIUM',
    polesAutorises: 'FUNERARIUM'
  }
];

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
      return (saved === 'FUNERARIUM' ? 'FUNERARIUM' : saved === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'MORGUE') as PoleMetier;
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

  // Liste des comptes d'accès administrés par le Super Admin (avec persistance)
  const [managedAccounts, setManagedAccounts] = useState<ManagedAccount[]>(() => {
    try {
      const saved = localStorage.getItem('nomarguerrie_managed_accounts');
      if (saved) {
        return JSON.parse(saved);
      }
      return DEFAULT_ACCOUNTS;
    } catch {
      return DEFAULT_ACCOUNTS;
    }
  });

  const saveAccounts = (newAccounts: ManagedAccount[]) => {
    setManagedAccounts(newAccounts);
    try {
      localStorage.setItem('nomarguerrie_managed_accounts', JSON.stringify(newAccounts));
    } catch {
      // ignore
    }
  };

  const createAccount = (accountData: Omit<ManagedAccount, 'id' | 'creeLe'>): ManagedAccount => {
    const newAcc: ManagedAccount = {
      ...accountData,
      id: `usr-${Date.now()}`,
      creeLe: new Date().toISOString()
    };
    const updated = [newAcc, ...managedAccounts];
    saveAccounts(updated);
    return newAcc;
  };

  const updateAccount = (id: string, updates: Partial<ManagedAccount>) => {
    const updated = managedAccounts.map((a) => (a.id === id ? { ...a, ...updates } : a));
    saveAccounts(updated);
  };

  const toggleAccountStatus = (id: string) => {
    const updated = managedAccounts.map((a) => (a.id === id ? { ...a, estActif: !a.estActif } : a));
    saveAccounts(updated);
  };

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

  // Authentification avec vérification stricte des pôles autorisés configurés par le Super Admin
  const loginWithPole = (user: UserSession, pole: PoleMetier): { success: boolean; error?: string } => {
    // 1. Super Admin (Direction Générale) : accès universel absolu
    if (user.directionRattachee === 'DIRECTION_GENERALE' || user.niveauAccreditation === 5) {
      setCurrentUser(user);
      setCurrentPole(pole);
      sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
      return { success: true };
    }

    // Contrôle Pôle Super Admin si demandé explicitement
    if (pole === 'SUPER_ADMIN') {
      return {
        success: false,
        error: `Accès refusé : Le compte de ${user.prenom} ${user.nom} ne dispose pas des accréditations Super Admin. Cet espace est strictement réservé à la Direction Générale.`
      };
    }

    // 2. Accès configuré aux 2 Pôles (Morgue ET Funérarium) ou Caisse Centrale
    if (user.polesAutorises === 'LES_DEUX' || user.directionRattachee === 'CAISSE_CENTRALE') {
      setCurrentUser(user);
      setCurrentPole(pole);
      sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
      return { success: true };
    }

    // 3. Contrôle Pôle Morgue
    if (pole === 'MORGUE') {
      if (user.polesAutorises === 'MORGUE' || user.directionRattachee === 'DIRECTION_MORGUE') {
        setCurrentUser(user);
        setCurrentPole(pole);
        sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
        return { success: true };
      } else {
        return {
          success: false,
          error: `Accès non autorisé : Votre compte (${user.prenom} ${user.nom}) est configuré pour le Pôle Funérarium uniquement. L'accès au Pôle Morgue vous est refusé.`
        };
      }
    }

    // 4. Contrôle Pôle Funérarium
    if (pole === 'FUNERARIUM') {
      if (user.polesAutorises === 'FUNERARIUM' || user.directionRattachee === 'DIRECTION_FUNERARIUM') {
        setCurrentUser(user);
        setCurrentPole(pole);
        sessionStorage.setItem('nomarguerrie_bo_user', JSON.stringify(user));
        return { success: true };
      } else {
        return {
          success: false,
          error: `Accès non autorisé : Votre compte (${user.prenom} ${user.nom}) est configuré pour le Pôle Morgue uniquement. L'accès au Pôle Funérarium vous est refusé.`
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
        ajouterEncaissementLiquide,
        managedAccounts,
        createAccount,
        updateAccount,
        toggleAccountStatus
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
