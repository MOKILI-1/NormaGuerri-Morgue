import express, { Request, Response } from 'express';
import cors from 'cors';
import { CaseService } from './services/case-service';
import { QrService } from './services/qr-service';
import { UTILISATEURS_MOCK } from './data/mock-db';
import { RoleUtilisateur, ModePaiement } from '@nomarguerrie/shared-types';

const app = express();
const PORT = process.env.PORT || 4050;

app.use(cors());
app.use(express.json());

// 1. Health check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'OK',
    service: 'NomarGuerrie Core API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 2. Utilisateurs & Profils
app.get('/api/users', (_req: Request, res: Response) => {
  res.json({ success: true, data: UTILISATEURS_MOCK });
});

// 3. Métriques Dashboard
app.get('/api/dashboard/stats', (_req: Request, res: Response) => {
  const stats = CaseService.getMetriquesDashboard();
  res.json({ success: true, data: stats });
});

// 4. File du jour contextuelle
app.get('/api/dashboard/taches', (req: Request, res: Response) => {
  const role = req.query.role as RoleUtilisateur | undefined;
  const taches = CaseService.getFileDuJour(role);
  res.json({ success: true, data: taches });
});

// 5. Liste des dossiers vivants
app.get('/api/cases', (req: Request, res: Response) => {
  const q = req.query.q as string | undefined;
  const dossiers = CaseService.getTousLesDossiers(q);
  res.json({ success: true, count: dossiers.length, data: dossiers });
});

// 6. Détail d'un dossier par ID
app.get('/api/cases/:id', (req: Request, res: Response) => {
  const dossier = CaseService.getDossierParId(req.params.id);
  if (!dossier) {
    return res.status(404).json({ success: false, error: 'Dossier introuvable.' });
  }
  res.json({ success: true, data: dossier });
});

// 7. Scan QR Code : résolution contextuelle
app.get('/api/cases/scan/:token', (req: Request, res: Response) => {
  const token = req.params.token;
  const dossier = CaseService.getDossierParTokenOuNumero(token);
  if (!dossier) {
    return res.status(404).json({
      success: false,
      error: 'QR Code non reconnu ou dossier inexistant.'
    });
  }
  res.json({
    success: true,
    message: 'QR Code validé avec succès.',
    data: dossier
  });
});

// 8. Générer l'image QR Code d'un dossier
app.get('/api/cases/:id/qrcode', async (req: Request, res: Response) => {
  const dossier = CaseService.getDossierParId(req.params.id);
  if (!dossier) {
    return res.status(404).json({ success: false, error: 'Dossier introuvable.' });
  }
  try {
    const qrDataUrl = await QrService.genererQrCodeDataUrl(dossier.qrCodeToken);
    res.json({
      success: true,
      numeroDossier: dossier.numeroDossier,
      token: dossier.qrCodeToken,
      qrDataUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Erreur lors de la génération du QR.' });
  }
});

// 9. Création d'une nouvelle admission / dossier
app.post('/api/cases', (req: Request, res: Response) => {
  try {
    const { defunt, demandeur, agentId } = req.body;
    if (!defunt || !demandeur) {
      return res.status(400).json({
        success: false,
        error: 'Les informations du défunt et du demandeur sont obligatoires.'
      });
    }
    const nouveauDossier = CaseService.creerDossier(
      { defunt, demandeur },
      agentId || 'usr-1'
    );
    res.status(201).json({ success: true, data: nouveauDossier });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    res.status(500).json({ success: false, error: message });
  }
});

// 10. Affectation / Changement de case frigorifique
app.post('/api/cases/:id/emplacement', (req: Request, res: Response) => {
  try {
    const { caseId, agentId, motif } = req.body;
    if (!caseId) {
      return res.status(400).json({ success: false, error: 'Le caseId est requis.' });
    }
    const dossier = CaseService.affecterEmplacement(
      req.params.id,
      caseId,
      agentId || 'usr-2',
      motif
    );
    res.json({ success: true, data: dossier });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    res.status(400).json({ success: false, error: message });
  }
});

// 11. Ajout d'une prestation
app.post('/api/cases/:id/prestations', (req: Request, res: Response) => {
  try {
    const { articleId, quantite, agentId } = req.body;
    if (!articleId || !quantite) {
      return res.status(400).json({ success: false, error: 'articleId et quantite sont requis.' });
    }
    const dossier = CaseService.ajouterPrestation(
      req.params.id,
      articleId,
      Number(quantite),
      agentId || 'usr-3'
    );
    res.json({ success: true, data: dossier });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    res.status(400).json({ success: false, error: message });
  }
});

// 12. Enregistrement d'un paiement
app.post('/api/cases/:id/paiements', (req: Request, res: Response) => {
  try {
    const { montant, mode, agentId, notes } = req.body;
    if (!montant || !mode) {
      return res.status(400).json({ success: false, error: 'montant et mode sont requis.' });
    }
    const dossier = CaseService.enregistrerPaiement(
      req.params.id,
      Number(montant),
      mode as ModePaiement,
      agentId || 'usr-3',
      notes
    );
    res.json({ success: true, data: dossier });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    res.status(400).json({ success: false, error: message });
  }
});

// 13. Double Validation de sortie
app.post('/api/cases/:id/validation-sortie', (req: Request, res: Response) => {
  try {
    const { etape, agentId, remarques } = req.body;
    if (!etape || ![1, 2, 3, 4].includes(Number(etape))) {
      return res.status(400).json({ success: false, error: 'Étape invalide (1, 2, 3 ou 4).' });
    }
    const dossier = CaseService.validerEtapeSortie(
      req.params.id,
      Number(etape) as 1 | 2 | 3 | 4,
      agentId || 'usr-5',
      remarques
    );
    res.json({ success: true, data: dossier });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur interne';
    res.status(400).json({ success: false, error: message });
  }
});

// 14. Catalogue des services et produits
app.get('/api/catalogue', (_req: Request, res: Response) => {
  res.json({ success: true, data: CaseService.getCatalogue() });
});

// 15. Liste des cases frigorifiques
app.get('/api/emplacements', (_req: Request, res: Response) => {
  res.json({ success: true, data: CaseService.getCases() });
});

// 16. Audit timeline d'un dossier
app.get('/api/cases/:id/audit', (req: Request, res: Response) => {
  const logs = CaseService.getAuditLogs(req.params.id);
  res.json({ success: true, data: logs });
});

app.listen(PORT, () => {
  console.log(`[NomarGuerrie API] Serveur démarré sur http://localhost:${PORT}`);
});
