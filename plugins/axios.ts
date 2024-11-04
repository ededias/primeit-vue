// plugins/axios.ts
import { defineNuxtPlugin } from '#app'
import axios from 'axios'

// Cria uma instância do Axios com a configuração desejada
const axiosInstance = axios.create({
  baseURL: 'http://localhost/api', // Substitua pela sua URL base
  timeout: 10000, // Tempo limite para requisições
  headers: {
    'Content-Type': 'application/json',
  },
})

export default defineNuxtPlugin(nuxtApp => {
  // Adiciona a instância do Axios ao contexto do Nuxt
  nuxtApp.provide('axios', axiosInstance)
})
