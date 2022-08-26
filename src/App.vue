<script setup>
import Header from '@/components/ui/Header.vue'
import Footer from '@/components/ui/Footer.vue'

</script>

<template>
  <div>
    <Header />

    <router-view/>

    <Footer />
  </div>
</template>

<style>
#app {
  font-family: 'GOST type b';
}

body {
  background-color: #cde6e6;
}
</style>
