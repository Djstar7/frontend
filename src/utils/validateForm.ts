type Validator<T> = (value: T) => string | null

export function validateForm<T extends object>(
  data: T,
  rules: {
    [K in keyof T]?: Validator<T[K]>[]
  },
): { isValid: boolean; errors: Partial<{ [K in keyof T]: string[] }> } {
  const errors: Partial<{ [K in keyof T]: string[] }> = {}

  ;(Object.keys(rules) as (keyof T)[]).forEach((field) => {
    const fieldRules = rules[field]
    if (!fieldRules) return

    const value = data[field]
    const fieldErrors: string[] = []

    fieldRules.forEach((rule) => {
      const errorMessage = rule(value)
      if (errorMessage) {
        fieldErrors.push(errorMessage)
      }
    })

    if (fieldErrors.length > 0) {
      errors[field] = fieldErrors
    }
  })

  return { isValid: Object.keys(errors).length === 0, errors }
}

/* 📌 VALIDATEURS GÉNÉRIQUES */
export const required =
  <T>(message = 'Ce champ est obligatoire'): Validator<T> =>
  (value) =>
    value !== null && value !== undefined && value !== '' ? null : message

export const minLength =
  (min: number, message?: string): Validator<string> =>
  (value) =>
    value.length >= min ? null : message || `Minimum ${min} caractères`

export const maxLength =
  (max: number, message?: string): Validator<string> =>
  (value) =>
    value.length <= max ? null : message || `Maximum ${max} caractères`

export const matchesPattern =
  (pattern: RegExp, message?: string): Validator<string> =>
  (value) =>
    pattern.test(value) ? null : message || 'Format invalide'

export const isEmail = (message = 'Email invalide'): Validator<string> =>
  matchesPattern(/^\S+@\S+\.\S+$/, message)

export const isNumber =
  (message = 'Doit être un nombre'): Validator<number | string> =>
  (value) =>
    !isNaN(Number(value)) ? null : message

export const minValue =
  (min: number, message?: string): Validator<number> =>
  (value) =>
    value >= min ? null : message || `Doit être supérieur ou égal à ${min}`

export const maxValue =
  (max: number, message?: string): Validator<number> =>
  (value) =>
    value <= max ? null : message || `Doit être inférieur ou égal à ${max}`
export const isPassword = (
  message = 'Le mot de passe doit contenir au moins 8 caractères et inclure au moins 3 des 4 critères : minuscule, majuscule, chiffre, caractère spécial',
): Validator<string> => {
  return (value) => {
    if (value.length < 8) {
      return message
    }

    let conditionsMet = 0

    if (/[a-z]/.test(value)) conditionsMet++
    if (/[A-Z]/.test(value)) conditionsMet++
    if (/\d/.test(value)) conditionsMet++
    if (/[^A-Za-z0-9]/.test(value)) conditionsMet++

    return conditionsMet >= 3 ? null : message
  }
}
