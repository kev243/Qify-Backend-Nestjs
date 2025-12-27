export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Supprime les accents
    .replace(/[^a-z0-9]+/g, '-') // Remplace les espaces et caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, ''); // Supprime les tirets en début/fin
}
