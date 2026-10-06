import QRCode from 'qrcode';

export class QrService {
  /**
   * Génère l'image base64 / Data URL d'un QR code pour un jeton de dossier
   */
  public static async genererQrCodeDataUrl(qrCodeToken: string): Promise<string> {
    try {
      const dataUrl = await QRCode.toDataURL(qrCodeToken, {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 300,
        color: {
          dark: '#0f172a',
          light: '#ffffff'
        }
      });
      return dataUrl;
    } catch (err) {
      console.error('Erreur lors de la génération du QR code :', err);
      throw new Error('Impossible de générer le QR code pour ce dossier.');
    }
  }

  /**
   * Construit le jeton d'identification sécurisé du dossier
   */
  public static genererJetonSecurise(numeroDossier: string): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const cleanNum = numeroDossier.replace(/[^a-zA-Z0-9]/g, '');
    return `NMG_SEC_${cleanNum}_${timestamp}`;
  }
}
