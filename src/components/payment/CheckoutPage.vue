<template>
  <div class="flex flex-row justify-center">
    <div class="absolute left-0 top-0 mt-16 ml-8">
      <Button :class="'bg-[#a1d6d6] shadow-md hover:bg-[#4be0e0] rounded-md hover:shadow-xl'" :width="'48px'" :height="'48px'" :to="'/'">
      <div class="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </div>
      </Button>
      <button 
        class="bg-gray-600 h-12 w-12 flex justify-center items-center mt-5 
                rounded-md shadow-md hover:shadow-xl hover:bg-black "
        @click="refreshData"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    </div>
    <div class="flex justify-center select-none">
      <Card :width="'850px'" :label="'Payment information'" class="mt-5">
        <CreditCard :name="name" :expirationDate="expirationDate" :card="cardNumber"/>
        <div class="flex flex-col mt-7 justify-center">
          <span class="flex text-lg ml-5">Card holder:</span>
          <input type="text" class="border-[1px] rounded-md h-9 mt-2 mx-5 px-2" v-model="name">
          <span class="flex text-lg ml-5 mt-3">Card number:</span>
          <input type="text" class="border-[1px] rounded-md h-9 mt-2 mx-5 px-2 tracking-widest" v-model="cardNumber">
          <div class="flex flex-row mt-3">
            <div class="w-full flex flex-row">
              <span class="flex text-lg ml-5 mt-3">Expiration date:</span>
              <input type="text" 
                class="border-[1px] rounded-md h-9 mt-2 ml-5 mr-2 px-2 w-[72px]" 
                :class="!isValid && expirationDate.length > 0 ? 'border-red-500 border-2 focus:outline-red-500' : ''"
                v-model="expirationDate"  
              >
            </div>
            <div class="w-full flex flex-row justify-end">
              <span class="flex text-lg ml-5 mt-3">CVC:</span>
              <input type="text" class="border-[1px] rounded-md h-9 mt-2 mx-5 px-2 w-[50px]" v-model="cvc">
            </div>
          </div>
          <button 
            class="mt-5 mx-5 bg-[#a1d6d6] shadow-md rounded-md 
            hover:bg-[#4be0e0] hover:shadow-xl h-10
            disabled:bg-gray-300 disabled:hover:bg-gray-300 disabled:hover:shadow-md"
            :disabled="!name || !cardNumber || !expirationDate || !cvc"
            @click="paymentDone"
          >
            Confirm payment
          </button>
        </div>
      </Card>
      <Card :width="'450px'" :label="'Order Summary'" class="mt-5 ml-5">
        <OrderList 
          v-model:totalPrice="totalPrice" 
          v-model:order="order"
        />
      </Card>
    </div>
  </div>
  
</template>

<script setup>
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import OrderList from '@/components/payment/OrderList.vue'
import CreditCard from '@/components/payment/CreditCard.vue'

import { onMounted, ref, watch } from 'vue'

const totalPrice = ref(0)

const order = ref([])
const name = ref('')

const expirationDate = ref('')
const isValid = ref(true)

const cardNumber = ref('')

const cvc = ref('')

const refreshData = () => {
  order.value = []
  for (let i=1; i <= 3; i++) {
    let rPrice = Math.round(i*Math.random()*100)/100
    order.value.push({
      name: `Item #${i}`,
      description: 'B:A '.repeat(4 - i),
      price: rPrice,
      img: i === 3 ? 'chair.jpg' : 'Logo.png',
      oneItemPrice: rPrice,
      qty: 1
    })
  }
}

const paymentDone = () => {
  alert('Yeeee!')
  name.value = ''
  cardNumber.value = ''
  expirationDate.value = ''
  cvc.value = ''
}

onMounted(() => {
  refreshData()
})

watch(() => cvc.value, () => {
  if (cvc.value.length > 3) {
    cvc.value = cvc.value.substring(0, 3)
  }
})

watch(() => expirationDate.value, (newVal, oldVal) => {
  if (newVal.match(new RegExp('[a-zA-Zа-яА-Я]', 'g'))) {
    expirationDate.value = oldVal
  }
  else if (newVal.length === 2 && oldVal.length === 1) {
    if (Number(newVal) > 12) {
      expirationDate.value = '12'
    }
    else if (newVal === '00') {
      expirationDate.value = '01'
    }
    expirationDate.value += '/'
  }
  else if (newVal.length >= 5) {
    expirationDate.value = expirationDate.value.substring(0, 5)
  }
  else if (newVal.length === 3 && oldVal.length === 4) {
    expirationDate.value = expirationDate.value.substring(0, 2)
  }
  else if (newVal.length === 2 && oldVal.length === 3) {
    expirationDate.value = expirationDate.value.substring(0, 1)
  }
  if (expirationDate.value.length !== 5) {
    isValid.value = false
  }
  else { isValid.value = true }
})

watch(() => cardNumber.value, (newVal, oldVal) => {
  if (newVal.match(new RegExp('\\D', 'g'))) {
    cardNumber.value = oldVal
  }
  if (cardNumber.value.length > 16) {
    cardNumber.value = cardNumber.value.substring(0, 16)
  }
})
</script>