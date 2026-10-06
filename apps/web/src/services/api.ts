import {
  DossierVivant,
  MetriquesDashboard,
  TacheFileDuJour,
  RoleUtilisateur,
  CaseEmplacement,
  ArticleCatalogue,
  AuditLogEntry,
  ModePaiement
} from '@nomarguerrie/shared-types';

const API_BASE_URL = 'http://localhost:4050/api';

export class ApiClient {
  public static async checkHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      return res.ok;
    } catch {
      return false;
    }
  }

  public static async getDashboardStats(): Promise<MetriquesDashboard> {
    const res = await fetch(`${API_BASE_URL}/dashboard/stats`);
    const json = await res.json();
    return json.data;
  }

  public static async getTachesFileDuJour(role?: RoleUtilisateur): Promise<TacheFileDuJour[]> {
    const url = role
      ? `${API_BASE_URL}/dashboard/taches?role=${role}`
      : `${API_BASE_URL}/dashboard/taches`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  }

  public static async getDossiers(filtreTexte?: string): Promise<DossierVivant[]> {
    const url = filtreTexte
      ? `${API_BASE_URL}/cases?q=${encodeURIComponent(filtreTexte)}`
      : `${API_BASE_URL}/cases`;
    const res = await fetch(url);
    const json = await res.json();
    return json.data;
  }

  public static async getDossierParId(id: string): Promise<DossierVivant> {
    const res = await fetch(`${API_BASE_URL}/cases/${id}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Dossier introuvable');
    return json.data;
  }

  public static async scanQrCode(token: string): Promise<DossierVivant> {
    const res = await fetch(`${API_BASE_URL}/cases/scan/${encodeURIComponent(token)}`);
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'QR code invalide');
    return json.data;
  }

  public static async getQrCodeImage(id: string): Promise<string> {
    const res = await fetch(`${API_BASE_URL}/cases/${id}/qrcode`);
    const json = await res.json();
    return json.qrDataUrl;
  }

  public static async creerDossier(payload: {
    defunt: DossierVivant['defunt'];
    demandeur: DossierVivant['demandeur'];
    agentId: string;
  }): Promise<DossierVivant> {
    const res = await fetch(`${API_BASE_URL}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Erreur lors de la création');
    return json.data;
  }

  public static async affecterEmplacement(
    dossierId: string,
    caseId: string,
    agentId: string,
    motif?: string
  ): Promise<DossierVivant> {
    const res = await fetch(`${API_BASE_URL}/cases/${dossierId}/emplacement`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caseId, agentId, motif })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Erreur d’affectation');
    return json.data;
  }

  public static async ajouterPrestation(
    dossierId: string,
    articleId: string,
    quantite: number,
    agentId: string
  ): Promise<DossierVivant> {
    const res = await fetch(`${API_BASE_URL}/cases/${dossierId}/prestations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ articleId, quantite, agentId })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Erreur ajout prestation');
    return json.data;
  }

  public static async enregistrerPaiement(
    dossierId: string,
    montant: number,
    mode: ModePaiement,
    agentId: string,
    notes?: string
  ): Promise<DossierVivant> {
    const res = await fetch(`${API_BASE_URL}/cases/${dossierId}/paiements`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ montant, mode, agentId, notes })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Erreur paiement');
    return json.data;
  }

  public static async validerEtapeSortie(
    dossierId: string,
    etape: 1 | 2 | 3 | 4,
    agentId: string,
    remarques?: string
  ): Promise<DossierVivant> {
    const res = await fetch(`${API_BASE_URL}/cases/${dossierId}/validation-sortie`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ etape, agentId, remarques })
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'Erreur validation de sortie');
    return json.data;
  }

  public static async getCatalogue(): Promise<ArticleCatalogue[]> {
    const res = await fetch(`${API_BASE_URL}/catalogue`);
    const json = await res.json();
    return json.data;
  }

  public static async getEmplacements(): Promise<CaseEmplacement[]> {
    const res = await fetch(`${API_BASE_URL}/emplacements`);
    const json = await res.json();
    return json.data;
  }

  public static async getAuditLogs(dossierId: string): Promise<AuditLogEntry[]> {
    const res = await fetch(`${API_BASE_URL}/cases/${dossierId}/audit`);
    const json = await res.json();
    return json.data;
  }
}
