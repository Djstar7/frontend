import type { FaqChat } from '@/types/faqchat'
import api from './api'

export const faqChatService = {
  async getFaqChat() {
    const response = await api.get('/faqchat')
    return response.data
  },
  async createFaqChat(faqChatData: FaqChat) {
    const response = await api.post('/faqchat/store', faqChatData)
    return response.data
  },
  async showFaqChat(id: number) {
    const response = await api.get(`/faqchat/show/${id}`)
    return response.data
  },
  async editFaqChat(id: number, faqChatData: FaqChat) {
    const response = await api.put(`/faqchat/update/${id}`, faqChatData)
    return response.data
  },
  async deleteFaqChat(id: number) {
    const response = await api.delete(`/faqchat/delete/${id}`)
    return response.data
  },
}
