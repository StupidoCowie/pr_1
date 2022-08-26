<template>
  <div class="px-2 h-8 shadow-lg bg-green-200 inset-x-0 top-0">
    <Button v-for="btn in btns" :key="btn.label" 
      :class="'hover:bg-green-400 hover:shadow-lg'"
      :width="'96px'"
      :height="'100%'"
      :to="btn.link"
    >
      {{ btn.label }}
    </Button>
  </div>
</template>

<script setup>
import Button from '@/components/ui/Button.vue'

import { ref } from 'vue'

const btns = ref([])

btns.value.push({
  label: 'Home',
  link: '/',
},
{
  label: 'Test',
  link: '/test'
})
</script>