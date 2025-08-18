/**
 * Formate une date au format local (par défaut : français)
 * @param date - La date à formater (string | Date)
 * @param options - Options de formatage (Intl.DateTimeFormatOptions)
 * @returns string - Date formatée
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  },
  locale: string = 'fr-FR',
): string {
  if (!date) return ''

  try {
    const parsedDate = new Date(date)
    return new Intl.DateTimeFormat(locale, options).format(parsedDate)
  } catch (error) {
    console.error('Erreur de formatage de date :', error)
    return ''
  }
}
