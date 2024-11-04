<template>
  <v-container class="pb-6 mt-4 mb-10">
    <data-list />
  </v-container>
</template>
<script lang="ts">
definePageMeta({
  middleware: 'auth',  // Especifica o middleware de autenticação para esta rota
})


</script>