<template>
    <v-container style="height: 100vh;">
        <v-data-table :headers="headers" :items="data" :loading="loading" class="elevation-1">
            <template #top>
                <v-toolbar flat color="green">
                    <v-toolbar-title>Listagem de Dados</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn color="gray" @click="fetchData">Recarregar Dados</v-btn>
                </v-toolbar>
            </template>

            <template #item.actions="{ item }">
                
                
                <v-btn color="blue" class="mr-1" :to="`/consultation/${item.id}`">
                    <v-icon color="white">mdi-pencil</v-icon>
                </v-btn>
                <v-btn v-if="role == 'attendant'" color="red" @click="deleteItem(item.id)">
                    <v-icon color="white" >mdi-delete</v-icon>
                </v-btn>
            </template>

            <template #no-data>
                <v-btn @click="fetchData" color="primary">Recarregar Dados</v-btn>
            </template>
        </v-data-table>

        <v-snackbar v-model="snackbar" :timeout="3000">
            {{ snackbarMessage }}
            <template #action>
                <v-btn color="pink" text @click="snackbar = false">Fechar</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNuxtApp, useCookie, navigateTo } from '#app'
import { formatDate } from '@/utils/formatDate'
import { jwtDecode } from 'jwt-decode';

const nuxtApp = useNuxtApp();
const data = ref<any[]>([])  // Use 'any[]' ou defina uma interface se souber a estrutura
const loading = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const role = ref('');
const headers = [
    { text: 'ID', value: 'id' },
    { text: 'Nome', value: 'name' },
    { text: 'Email', value: 'email' },
    { text: 'Nome do Paciente', value: 'patient_name' },
    { text: 'Tipo', value: 'type' },
    { text: 'Idade', value: 'age' },
    { text: 'Data', value: 'date' },
    { text: 'Recepção', value: 'reception' },
    { text: 'Ações', value: 'actions', sortable: false }, // Coluna para ações
]

onMounted(() => {
    const token = useCookie('auth_token')
    const jwt = jwtDecode(token.value)
    role.value = jwt.role
})

const fetchData = async () => {
    loading.value = true
    try {
        const token = useCookie('auth_token').value
        const response = await nuxtApp.$axios.get('/patient/all', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        data.value = response.data
        snackbarMessage.value = 'Dados carregados com sucesso!'
    } catch (error) {
        console.error('Erro ao buscar dados:', error)
        snackbarMessage.value = 'Erro ao carregar dados!'
    } finally {
        loading.value = false
        snackbar.value = true
    }
}


// Função para excluir um item
const deleteItem = async (id: number) => {
    const confirmation = confirm('Tem certeza que deseja excluir este item?')
    if (confirmation) {
        try {
            const token = useCookie('auth_token').value
            const response = await nuxtApp.$axios.delete(`/patient/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }) // Substitua pela URL da sua API
            snackbarMessage.value = 'Consulta excluída com sucesso!'
            fetchData() // Recarrega os dados após a exclusão
        } catch (error) {
            console.error('Erro ao excluir o item:', error)
            snackbarMessage.value = 'Erro ao excluir o item!'
        } finally {
            snackbar.value = true
        }
    }
}

// Chama fetchData ao montar o componente
fetchData()
</script>

<style scoped>
/* Estilos personalizados, se necessário */
</style>