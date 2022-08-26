<template>
  <div>
    <h1 class="text-3xl pb-4 font-bold text-[#1b5238]">{{ props.label }}</h1>
    <div 
      class="text-center text-xl bg-white rounded-md shadow-xl px-8 py-6"
      :style="{width: props.width}"
    >
      <slot/>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  width: {
    type: String,
    default: () => {
      return '300px'
    }
  },
  label: {
    type: String,
    default: () => {
      return ''
    }
  }
})
</script>