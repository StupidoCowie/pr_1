<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <router-view 
      v-slot="{ Component }"
      class="flex-grow"
    >
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>

    <Footer />
  </div>
</template>

<script setup>
import Header from '@/components/ui/Header.vue'
import Footer from '@/components/ui/Footer.vue'

</script>

<style>
#app {
  font-family: 'GOST type b';
}

body {
  background-color: #cde6e6;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
</style>
