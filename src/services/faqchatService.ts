import api from './api'

// route publique
export const getFaq = () => {
  return api.get('/faqchat')
}
