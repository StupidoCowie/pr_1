<template>
  <div>
    <OrderItem 
      v-if="props.order.length > 0"
      v-for="(item, index) in props.order"
      :key = item.name
      :id="index"
      :name="item.name" :description="item.description" v-model:price="item.price" :img="item.img" :oneItemPrice="item.oneItemPrice" v-model:qty="item.qty"
      @remove="removeItem(index)"
    />
    <div v-else>
      <div>There is no items yet.</div>
      <hr class="my-3">
    </div>
  </div>
  <div class="flex justify-end font-bold">
    Total price: {{ totalSum }}$
  </div>
</template>

<script setup>
import OrderItem from '@/components/payment/OrderItem.vue'

import { onMounted, ref, watch, computed } from 'vue'

const props = defineProps({
  totalPrice: Number,
  order: Array
})

const emits = defineEmits([
  'update:totalPrice',
  'update:order'
])

const totalSum = ref(0)
const orderList = computed({
  get() {
    return props.order
  },
  set(value) {
    emits('update:order', value)
  }
})

const calculate = () => {
  let sum = 0
  orderList.value.forEach(item => {
    sum += item.price
  })
  emits('update:totalPrice', Math.round(sum * 100)/100)
  totalSum.value = Math.round(sum * 100)/100
}

const removeItem = (index) => {
  orderList.value.splice(index, 1)
}

onMounted(() => {
  calculate()
})

watch(() => orderList.value, () => {
  calculate()
}, {deep: true})
</script>