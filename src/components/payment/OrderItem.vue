<template>
  <div class="flex flex-col">
    <div class="flex flex-row">
      <img :src="'/' + props.img" class="h-14 w-14 rounded-md">
      <div class="flex flex-col ml-4">
        <div class="w-48 flex justify-start">
          {{ props.name }}
        </div>
        <div class="text-sm flex justify-start mt-2">
          {{ props.description }}
        </div>
      </div>
      <div class="w-full flex justify-end">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" @click="emits('remove')" style="cursor:pointer">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
    <div class="flex flex-row mt-2">
      <div class="flex">
        <button class="flex justify-center items-center w-8 h-8 rounded-l-xl bg-slate-200 hover:bg-slate-300" @click="decreaseQty">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clip-rule="evenodd"/>
          </svg>
        </button>
        <input v-model="qty" class="flex text-center w-8 h-8 border-slate-200 border-y-[1px] focus:outline-none">
        <button class="flex justify-center items-center w-8 h-8 rounded-r-xl bg-slate-200 hover:bg-slate-300" @click="increaseQty">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/>
          </svg>
        </button>        
      </div>
      <div class="w-full flex justify-end font-bold">
        {{ sumPrice }}$
      </div>
    </div>
  </div>
  <hr class="my-3">
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  id: Number,
  name: String,
  description: String,
  price: {
    type: Number,
    default: () => {
      return 1
    }
  },
  img: String,
  qty: {
    type: Number,
    default: () => {
      return 1
    }
  },
  oneItemPrice: Number
})

const emits = defineEmits([
  'update:price',
  'update:qty',
  'remove'
])

const qty = computed({
  get() {
    return props.qty
  },
  set(value) {
    emits('update:qty', value)
  }
})

const priceForOne = computed({
  get() {
    return props.oneItemPrice
  }
})

const sumPrice = computed(() => {
  return Math.round(qty.value * priceForOne.value * 100)/100
})

const increaseQty = () => {
  qty.value++
}

const decreaseQty = () => {
  if (qty.value > 0) {
    qty.value--
  }
}

watch(() => qty.value, () => {
  if (qty.value.toString().match(new RegExp('[a-zA-Z]', 'g')) || qty.value === ''){
    qty.value = 1
  }
  else {
    qty.value = Number(qty.value)
    emits('update:price', sumPrice.value)
  }
})
</script>