<template>
  <div class="h-screen flex bg-gray-50">
    <!-- Sidebar utilisateurs -->
    <aside class="w-80 bg-white border-r fixed h-full overflow-y-auto">
      <div class="p-4">
        <h1 class="text-2xl font-bold text-purple-600 mb-4">👥 Utilisateurs</h1>
        <div v-if="loading" class="text-gray-500 text-center">Chargement...</div>
        <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

        <ul>
          <li
            v-for="user in users"
            :key="user.id"
            @click="selectUser(user)"
            :class="[
              'flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-purple-50 transition',
              selectedUser?.id === user.id ? 'bg-purple-100' : '',
            ]"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center bg-purple-200 text-purple-600 font-bold"
            >
              {{ user.name.charAt(0).toUpperCase() }}
            </div>
            <div class="flex-1">
              <h3 class="text-gray-800 font-semibold">{{ user.name }}</h3>
              <p class="text-gray-500 text-sm truncate">{{ user.email }}</p>
            </div>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Chat principal -->
    <main class="flex-1 flex ml-80 flex-col">
      <!-- Message quand aucun utilisateur n’est sélectionné -->
      <div v-if="!selectedUser" class="flex-1 flex items-center justify-center text-gray-500">
        Sélectionne un utilisateur pour voir le chat
      </div>

      <div v-else class="flex flex-col h-screen">
        <!-- Header -->
        <div
          class="flex-none fixed top-20 left-130 right-0 bg-white p-4 border-b flex items-center h-16 gap-3 z-10"
        >
          <div
            class="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-600 font-bold"
          >
            {{ selectedUser.name.charAt(0).toUpperCase() }}
          </div>
          <h2 class="font-semibold text-gray-800">{{ selectedUser.name }}</h2>
        </div>

        <!-- Zone messages -->
        <div
          ref="chatContainer"
          class="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-gray-50 mt-16 mb-16"
          @scroll="onScroll"
        >
          <div
            v-for="msg in selectedUser.messages"
            :key="msg.id"
            :class="[
              'p-3 rounded-2xl shadow-sm max-w-[70%] break-words relative',
              msg.fromAdmin
                ? 'self-end bg-purple-600 text-white rounded-br-none'
                : 'self-start bg-white border text-gray-800 rounded-bl-none',
            ]"
          >
            <p class="leading-snug">{{ msg.content }}</p>
            <span
              :class="[
                'text-[11px] absolute -bottom-5',
                msg.fromAdmin ? 'right-2 text-purple-200' : 'left-2 text-gray-400',
              ]"
            >
              {{ formatDate(msg.created_at) }}
            </span>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex-none sticky bottom-0 p-4 bg-white border-t flex gap-2">
          <input
            v-model="newMessage"
            type="text"
            placeholder="Écris un message..."
            class="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            @keyup.enter="sendMessage"
          />
          <button
            @click="sendMessage"
            class="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full font-medium"
          >
            Envoyer
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { useUserStore } from '@/stores/userStore'
import type { Custom } from '@/types/user'

const userStore = useUserStore()

const users = ref<Custom[]>([])
const selectedUser = ref<Custom | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const newMessage = ref('')
const chatContainer = ref<HTMLDivElement | null>(null)
const isUserScrolling = ref(false)

// Formater date
const formatDate = (dateStr: string) => {
  if (!dateStr) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

// Sélection utilisateur
const selectUser = (user: Custom) => {
  selectedUser.value = user
  nextTick(scrollToBottom)
}

// Scroll auto
const scrollToBottom = () => {
  if (chatContainer.value && !isUserScrolling.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

// Détection scroll manuel
const onScroll = () => {
  if (!chatContainer.value) return
  const maxScroll = chatContainer.value.scrollHeight - chatContainer.value.clientHeight
  isUserScrolling.value = chatContainer.value.scrollTop < maxScroll - 20
}

// Envoi message
const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedUser.value) return
  selectedUser.value.messages.push({
    id: Date.now(),
    content: newMessage.value.trim(),
    fromAdmin: true,
    created_at: new Date(),
  })
  newMessage.value = ''
  nextTick(scrollToBottom)
}

// Watch → si messages changent, descendre
watch(
  () => selectedUser.value?.messages,
  () => nextTick(scrollToBottom),
  { deep: true },
)

// Charger les utilisateurs
onMounted(async () => {
  try {
    const res = await userStore.getCustom()
    users.value = res?.users ?? []
    users.value.forEach((u) => {
      u.messages = u.messages || [
        { id: 1, content: 'Bonjour 👋', fromAdmin: false, created_at: new Date() },
        {
          id: 2,
          content: 'Salut, comment puis-je t’aider ?',
          fromAdmin: true,
          created_at: new Date(),
        },
      ]
    })
  } catch (err: any) {
    error.value = err.response?.data?.message || 'Erreur lors du chargement'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
/* Scrollbar custom */
[ref='chatContainer'] {
  scrollbar-width: thin;
  scrollbar-color: #a78bfa #f3f4f6;
}
[ref='chatContainer']::-webkit-scrollbar {
  width: 6px;
}
[ref='chatContainer']::-webkit-scrollbar-thumb {
  background-color: #a78bfa;
  border-radius: 3px;
}
</style>
