// Fonction pour extraire le nom d'utilisateur depuis l'email
export function extractUsernameFromEmail(email: string): string {
  const atIndex = email.indexOf('@');

  // Si pas de '@' trouvé, retourner l'email complet
  if (atIndex === -1) {
    return email;
  }

  return email.substring(0, atIndex);
}
