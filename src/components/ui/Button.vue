<template>
  <button 
    :class="props.class"
    :style="{width: props.width, height: props.height}"
    @click="moveTo"
  >
    <slot/>
  </button>
</template>

<script setup>
import { computed } from 'vue'
import router from '@/router'

const props = defineProps({
  class: {
    type: String,
    default: () => {
      return ''
    }
  },
  to: {
    type: String,
    required: false,
    default: () => {
      return ''
    }
  },
  height: {
    type: String,
    default: () => {
      return '30px'
    }
  },
  width: {
    type: String,
    default: () => {
      return '90px'
    }
  }
})


// Я не уверен, что это супер правильное решение. Более того, я не уверен, что оно нужное. Но зато в темплейте нет никаких условий
const moveTo = computed(() => {
  return props.to.length > 0 ? 
    goTo(props.to) : 
    null
})

const goTo = (link) => {
  router.push(link)
}
</script>