// middleware/auth.global.ts
import { defineNuxtRouteMiddleware, navigateTo, useCookie } from '#app'

export default defineNuxtRouteMiddleware(() => {
  const token = useCookie('auth_token')
  
  // Se o token não existir, redireciona para a página de login
  if (!token.value) {
    return navigateTo('/login')
  }
})
