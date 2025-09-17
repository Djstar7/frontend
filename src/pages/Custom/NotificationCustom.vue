<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
    <div class="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md flex flex-col items-center">
      <h1 class="text-xl font-bold mb-4">🎉 Générateur de QR Code</h1>

      <!-- Input texte -->
      <input
        v-model="qrText"
        type="text"
        placeholder="Entrez le texte ou URL"
        class="w-full border rounded-lg p-2 mb-3"
      />

      <!-- Input pour uploader un logo -->
      <input type="file" @change="onFileChange" class="mb-3" />

      <!-- Bouton générer -->
      <button
        @click="generateQRCode"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        Générer QR Code
      </button>

      <!-- QR Code affiché -->
      <div v-if="qrDataUrl" class="mt-6 text-center">
        <div class="relative inline-block">
          <!-- QR -->
          <img :src="qrDataUrl" alt="QR Code" class="w-64 h-64" ref="qrImage" />
          <!-- Logo centré -->
          <img
            v-if="logoUrl"
            :src="logoUrl"
            class="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white"
          />
        </div>

        <!-- Boutons actions -->
        <div class="flex gap-3 mt-4 justify-center">
          <!-- Télécharger -->
          <button
            @click="downloadQRCode"
            class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Télécharger
          </button>

          <!-- Copier -->
          <button
            @click="copyQRCode"
            class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
          >
            Copier
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import QRCode from 'qrcode'

const qrText = ref('')
const qrDataUrl = ref<string | null>(null)
const logoUrl = ref<string | null>(null)
const qrImage = ref<HTMLImageElement | null>(null)

// Fonction de génération
const generateQRCode = async () => {
  if (!qrText.value) return
  try {
    qrDataUrl.value = await QRCode.toDataURL(qrText.value, {
      errorCorrectionLevel: 'H',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })
  } catch (err) {
    console.error(err)
  }
}

// Charger un logo
const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    logoUrl.value = URL.createObjectURL(file)
  }
}

// Télécharger le QR
const downloadQRCode = () => {
  if (!qrDataUrl.value) return
  const link = document.createElement('a')
  link.href = qrDataUrl.value
  link.download = 'qrcode.png'
  link.click()
}

// Copier le QR
const copyQRCode = async () => {
  if (qrImage.value) {
    try {
      const response = await fetch(qrDataUrl.value!)
      const blob = await response.blob()
      await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
      alert('✅ QR Code copié dans le presse-papiers !')
    } catch (error) {
      console.error('Erreur lors de la copie :', error)
    }
  }
}
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
}
</style>
