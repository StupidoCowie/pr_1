<template>
  <button 
    :class="props.class"
    :style="{width: props.width, height: props.height}"
    @click="props.to.length > 0 ? goTo(props.to) : null"
  >
    <slot/>
  </button>
</template>

<script setup>
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

const goTo = (link) => {
  router.push(link)
}
</script>