<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useFaqChatStore } from '@/stores/faqchatore'
import type { FaqChat } from '@/types/faqchat'

const faqChatStore = useFaqChatStore()

const questions = ref<FaqChat[]>([])

onMounted(async () => {
  try {
    const res = await faqChatStore.getFaqChat()
    questions.value = res
    console.log('res disponibles:', res)
  } catch (e: any) {
    console.error('Erreur:', faqChatStore.error)
  }
})

const selectedCategory = ref<string | null>(null)
const chatMessages = ref<{ sender: string; text: string }[]>([])

function chooseQuestion(q: FaqChat) {
  chatMessages.value.push({ sender: 'user', text: q.question })
  setTimeout(() => {
    chatMessages.value.push({ sender: 'bot', text: q.answer })
  }, 2000) // ⏳ réponse après 2s
}
</script>

<template>
  <div
    class="fixed bottom-20 right-5 w-80 h-96 bg-white shadow-xl rounded-2xl transition-all duration-500 ease-in-out flex flex-col overflow-hidden"
  >
    <!-- Header -->
    <div class="bg-blue-600 text-white p-3 font-semibold flex items-center justify-between">
      <span>Chat d'aide</span>
      <i class="fa-solid fa-xmark cursor-pointer"></i>
    </div>

    <!-- Zone de chat -->
    <div class="flex-1 p-3 overflow-y-auto space-y-2 text-sm">
      <div
        v-for="(msg, i) in chatMessages"
        :key="i"
        :class="msg.sender === 'user' ? 'text-right' : 'text-left'"
      >
        <span
          :class="
            msg.sender === 'user'
              ? 'bg-blue-500 text-white px-2 py-1 rounded-lg inline-block'
              : 'bg-gray-200 px-2 py-1 rounded-lg inline-block'
          "
        >
          {{ msg.text }}
        </span>
      </div>
    </div>

    <!-- Liste des questions -->
    <div class="border-t p-2">
      <div v-if="!selectedCategory">
        <p class="text-sm font-bold">Choisir une catégorie :</p>
        <div class="flex flex-wrap gap-2 mt-2">
          <button
            v-for="cat in [...new Set(questions.map((q) => q.category))]"
            :key="cat"
            @click="selectedCategory = cat"
            class="bg-gray-100 px-3 py-1 rounded-full text-xs hover:bg-blue-100"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <div v-else>
        <button class="text-xs text-blue-600 underline mb-2" @click="selectedCategory = null">
          ← Retour
        </button>
        <div class="space-y-2">
          <button
            v-for="q in questions.filter((q) => q.category === selectedCategory)"
            :key="q.id"
            @click="chooseQuestion(q)"
            class="block w-full text-left text-sm bg-gray-100 px-2 py-1 rounded hover:bg-blue-50"
          >
            {{ q.question }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
