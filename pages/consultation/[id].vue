<template>
    <v-container class="pt-10 mt-4 mb-10">
        <v-card>
            <v-card-title>{{ isEditMode ? 'Editar Consulta' : 'Nova Consulta' }}</v-card-title>
            <v-card-text>
                <v-form ref="editForm" v-model="formValid">
                    <v-text-field v-model="formData.name" label="Nome" :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="formData.email" label="Email" type="email" :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="formData.patient_name" label="Nome do Paciente" :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="formData.age" label="Idade" type="number" :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="formData.symptoms" label="Sintomas" type="text" :rules="[rules.required]"></v-text-field>
                    <v-select                        
                        item-title="label"
                        item-value="type"
                        persistent-hint
                        return-object
                        single-line
                        v-model="selectedAnimal"
                        :items="animals"
                        item-text="label"
                        label="Selecione o animal"
                        :rules="[rules.required]"
                    ></v-select>

                    <v-select                        
                        item-title="name"
                        item-value="id"
                        persistent-hint
                        return-object
                        single-line
                        v-model="selectedDoctor"
                        :items="doctors"
                        item-text="label"
                        label="Selecione o veterinário"
                        :rules="[rules.required]"
                    ></v-select>
                   
                    <v-text-field v-model="formData.date" label="Data e Hora" type="datetime-local"
                        required></v-text-field>
                    <v-select v-model="formData.reception" :items="receptionOptions" label="Recepção"
                        required></v-select>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-btn color="green" @click="submitForm" :disabled="!formValid">
                    {{ isEditMode ? 'Salvar Alterações' : 'Criar Consulta' }}
                </v-btn>
                <v-btn color="grey" @click="cancelEdit">Cancelar</v-btn>
            </v-card-actions>
        </v-card>

        <v-snackbar v-model="snackbar" :timeout="3000">
            {{ snackbarMessage }}
            <template #action>
                <v-btn color="pink" text @click="snackbar = false">Fechar</v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNuxtApp, useCookie, navigateTo } from '#app'

const nuxtApp = useNuxtApp();
const router = useRouter()
const route = useRoute()

const formData = ref({
    name: '',
    email: '',
    patient_name: '',
    age: '',
    type: '',
    date: '',
    reception: '',
})

const formValid = ref(false)
const snackbar = ref(false)
const snackbarMessage = ref('')
const selectedAnimal = ref('')
const doctors = ref([]);
const selectedDoctor = ref();
const animals = [
  { label: 'Gato', type: 'cat' },
  { label: 'Cachorro', type: 'dog' },
  { label: 'Pássaro', type: 'bird' },
]

const receptionOptions = ['Manhã', 'Tarde']

// Verifica se o `id` está presente na rota para determinar o modo de edição
const isEditMode = ref(Boolean(route.params.id) && Boolean(Number(route.params.id)))

const rules = {
    required: (value: string) => !!value || 'Campo obrigatório.',
    email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail inválido.'
}

const fecthDoctors = async () => {
   
    const id = route.params.id
    const token = useCookie('auth_token').value
    const response = await nuxtApp.$axios.get(`/patient/get-doctors`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    doctors.value = response.data

}

// Busca os dados da consulta se estiver no modo de edição
const fetchItemData = async () => {
    if (isEditMode.value) {
        const id = route.params.id
        try {
            const token = useCookie('auth_token').value
            const response = await nuxtApp.$axios.get(`/patient/get/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            selectedAnimal.value = response.data.type
           
            formData.value = response.data
            selectedDoctor.value = response.data.users[0].id
        } catch (error) {
            console.error('Erro ao buscar dados do item:', error)
            snackbarMessage.value = 'Erro ao carregar dados!'
            snackbar.value = true
        }
    }
    await fecthDoctors()
}

// Função de submissão condicional (POST para criação, PUT para edição)
const submitForm = async () => {
    try {
        const token = useCookie('auth_token').value    
        if (isEditMode.value) {
           
            await nuxtApp.$axios.put(`/patient/update`, {
                id: formData.value.id,
                name: formData.value.name,
                email: formData.value.email,
                patient_name: formData.value.patient_name,
                age: formData.value.age,
                type: selectedAnimal.value.type,
                symptoms: formData.value.symptoms,
                date: formData.value.date,
                reception: formData.value.reception,
                symtoms: formData.value.symptoms,
                doctor_id: selectedDoctor.value,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        
            snackbarMessage.value = 'Consulta atualizada com sucesso!'
        } else {
            await nuxtApp.$axios.post(`/patient/create`, {
                id: formData.value.id,
                name: formData.value.name,
                email: formData.value.email,
                patient_name: formData.value.patient_name,
                age: formData.value.age,
                type: selectedAnimal.value.type,
                symptoms: formData.value.symptoms,
                date: formData.value.date,
                symtoms: formData.value.symptoms,
                reception: formData.value.reception,
                doctor_id: selectedDoctor.value.id,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            snackbarMessage.value = 'Consulta criada com sucesso!'
        }
        snackbar.value = true
        router.push('/') // Redireciona para a listagem de consultas
    } catch (error) {
        console.error('Erro ao salvar os dados:', error)
        snackbarMessage.value = 'Erro ao salvar os dados!'
        snackbar.value = true
    }
}

// Cancela a operação e retorna à página de listagem
const cancelEdit = () => {
    router.push('/')
}

// Executa a busca de dados se estiver no modo de edição
onMounted(fetchItemData)
</script>

<style scoped>
/* Estilos personalizados, se necessário */
</style>