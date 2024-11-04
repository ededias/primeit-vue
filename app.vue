<template>
  <NuxtLayout>
    <v-app>
      <NuxtPage />
    </v-app>
  </NuxtLayout>
</template>

<script>
export default defineComponent({
  middleware: 'redirect'
})
</script>