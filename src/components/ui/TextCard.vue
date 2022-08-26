<template>
  <Card :width="props.width" :label=props.label>
    <slot/>
  </Card>
</template>

<script setup>
import Card from '@/components/ui/Card.vue'

const props = defineProps({
  width: {
    type: String,
    default: () => {
      return '300px'
    }
  },
  label: String
})
</script>