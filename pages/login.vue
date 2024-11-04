<template>
    <v-container>
        <v-row justify="center" align="center" style="height: 100vh;">
            <v-col cols="12" sm="8" md="4">
                <v-card>
                    <v-card-title class="bg-green pa-6">
                        <span class="headline">Login</span>
                    </v-card-title>
                    <v-card-text class="pa-6">
                        <v-form ref="form" v-model="valid">
                            <v-text-field v-model="email" label="E-mail" :rules="[rules.required, rules.email]"
                                required></v-text-field>
                            <v-text-field v-model="password" label="Senha" :rules="[rules.required]" type="password"
                                required></v-text-field>
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn variant="outlined" color="green" :disabled="!valid" @click="login">
                            Entrar
                        </v-btn>
                        
                        <v-btn variant="outlined" color="primary" to="/signup">
                            Registrar-se
                        </v-btn>
                        
                    </v-card-actions>
                </v-card>
                <v-snackbar
                    
                    v-model="snackbar"
                    :timeout="5000"
                    color="red"
                    >
                    <div class="d-flex justify-space-between">
                        <div>
                            {{ snackbarMessage }}
                        </div>
                        <v-icon @click="snackbar = false">mdi-close</v-icon>
                    </div>
                   
                    
                </v-snackbar>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
definePageMeta({
  layout: false,
})

import { defineComponent, ref } from 'vue'
import { useNuxtApp, useCookie, navigateTo } from '#app'

export default defineComponent({
    setup() {
        const nuxtApp = useNuxtApp()
        const valid = ref(false)
        const email = ref('')
        const password = ref('')
        const snackbar = ref(false)           // Controle de exibição do Snackbar
        const snackbarMessage = ref('')
        const router = useRoute()
        const rules = {
            required: (value: string) => !!value || 'Campo obrigatório.',
            email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail inválido.'
        }

        const login = async () => {
            // Aqui você pode adicionar a lógica para autenticar o usuário
            try {
                const response = await nuxtApp.$axios.post('/login', {
                    email: email.value,
                    password: password.value,
                })
                const token = response.data.token
                const tokenCookie = useCookie('auth_token')
                tokenCookie.value = token
                
                await navigateTo('/')
                // Aqui você pode redirecionar o usuário ou mostrar uma mensagem de sucesso
            } catch (error) {
                snackbarMessage.value = error.response?.status === 400
                    ? 'Erro ao registrar: dados inválidos.'
                    : 'Erro ao registrar: tente novamente mais tarde.'
                snackbar.value = true
                // Aqui você pode tratar o erro e mostrar uma mensagem ao usuário
            }
        }

        return {
            valid,
            login,
            email,
            password,
            snackbar,
            snackbarMessage,
            rules
        }
    }
})

</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>