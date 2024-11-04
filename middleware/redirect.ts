// middleware/redirect.ts
import { defineNuxtRouteMiddleware } from 'nuxt/app'

export default defineNuxtRouteMiddleware((to, from) => {
  if (to.path === '/') {
    return navigateTo('/login')
  }
})
