<template>
    <v-app>
        <v-app-bar app>
            <v-toolbar-title>Gestão de pacientes (primeit)</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text to="/">Home</v-btn>
            <v-btn v-if="role != 'doctor'" text to="/consultation/new">Nova consulta</v-btn>
            <v-btn text @click="logout" color="red">Logout</v-btn>
        </v-app-bar>

        <v-container class="pb-6 mt-4 mb-10">
            <nuxt-page />
        </v-container>
        <v-footer app>
            <v-col class="text-center">
                <span>&copy; {{ new Date().getFullYear() }} Meu Aplicativo. Todos os direitos reservados.</span>
            </v-col>
        </v-footer>
    </v-app>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useNuxtApp, useCookie, navigateTo } from '#app'
import { jwtDecode } from 'jwt-decode';

const nuxtApp = useNuxtApp();
definePageMeta({
    middleware: 'auth',  // Especifica o middleware de autenticação para esta rota
})

const role = ref('');
const router = useRouter()

onMounted(() => {
    const token = useCookie('auth_token')
    console.log(token)
    const jwt = jwtDecode(token.value)
    role.value = jwt.role
})

const logout = async () => {
    try {
        const token = useCookie('auth_token')
        const response = await nuxtApp.$axios.post('/logout', {}, {
            headers: {
                Authorization: `Bearer ${token.value}`
            }
        })

        token.value = null
        navigateTo('/login')
    } catch (error) {
        console.error('Erro ao buscar dados:', error)
    }
}
</script>

<style>
/* Estilos personalizados, se necessário */
</style>


<script lang="ts" setup>

</script>