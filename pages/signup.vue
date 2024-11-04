<template>
    <v-container>
        <v-row justify="center" align="center" style="height: 100vh;">
            <v-col cols="12" sm="8" md="4">
                <v-card>
                    <v-card-title class="py-6 bg-green">
                        <span class="headline">Registro</span>
                    </v-card-title>
                    <v-card-text class="py-6">
                        <v-form ref="form" v-model="valid">
                            <v-text-field v-model="name" label="Nome" :rules="[rules.required]"
                                required></v-text-field>
                            <v-text-field v-model="email" label="E-mail" :rules="[rules.required, rules.email]"
                                required></v-text-field>

                            <v-text-field v-model="password" label="Senha" :rules="[rules.required]" type="password"
                                required></v-text-field>

                                <v-select
                                    v-model="selectedRole"
                                    :items="roles"
                                    item-title="label"  
                                    item-value="role"   
                                    label="Tipo"
                                    :rules="[rules.required]"
                                    required
                                ></v-select>
                        </v-form>
                    </v-card-text>
                    <v-card-actions class="container d-flex justify-space-between">
                    
                        <v-btn :disabled="!valid" color="primary" variant="outlined" @click="register">
                            Registrar
                        </v-btn>
                        <v-btn to="/login" color="green" variant="outlined">
                            Login
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
import { useNuxtApp, useCookie, useRoute, navigateTo } from '#app'

export default defineComponent({
    setup() {
        const nuxtApp = useNuxtApp()
        const valid = ref(false)
        const name = ref('')
        const email = ref('')
        const password = ref('')
        const selectedRole = ref('')
        const role = ref('')
        const router = useRoute();
        const roles = [
            { label: 'Médico', role: 'doctor' },
            { label: 'Recepcionista', role: 'attendant' },
            { label: 'Cliente', role: 'customer' },
        ]
        const snackbar = ref(false)           // Controle de exibição do Snackbar
        const snackbarMessage = ref('')
        const rules = {
            required: (value: string) => !!value || 'Campo obrigatório.',
            email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail inválido.'
        }

        const register = async () => {
            try {
                const response = await nuxtApp.$axios.post('/register', {
                    name: email.value,
                    email: email.value,
                    password: password.value,
                    role: selectedRole.value,
                })
                const tokenCookie = useCookie('auth_token')
                tokenCookie.value = response.data.token
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
            email,
            password,
            selectedRole,
            name,
            role,
            roles,
            rules,
            register,
            snackbar,
            snackbarMessage,
            router
        }
    }
})
</script>

<style scoped>
/* Estilos adicionais, se necessário */
</style>