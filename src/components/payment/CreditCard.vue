<template>
  <div class="flex flex-col">
    <div class="flex justify-center select-none">
      <div class="flex flex-col bg-fixed h-[300px] w-[500px] mt-4 rounded-xl drop-shadow-2xl" style="background-image: url(/back.jpg);">
        <div class="flex flex-row">
          <div class="flex justify-start w-full">
            <img src="/chip.png" class="h-16 w-16 ml-5 mt-3">
          </div>
          <img :src="cardType" class="h-[50px] w-[74px] mr-5 mt-5 rounded-md">
        </div>
        <div class="h-auto flex flex-row justify-center mt-24 backdrop-blur-[4px]">
          <span v-for="(quater,index) in cardArray" :key="index" 
            class="flex justify-center w-full px-6 text-2xl text-white tracking-widest"
          >
            {{ quater }}
          </span>
        </div>
        <div class="flex flex-col">
          <div class="flex flex-row justify-center">
            <span class="flex w-full text-white text-base ml-9 mt-5 font-bold tracking-tight">
              Card holder
            </span>
            <span class="flex w-full justify-end text-black text-base mr-9 mt-5 font-bold tracking-tight">
              Expires
            </span>
          </div>
          <div class="flex flex-row justify-center mt-1">
            <span class="flex w-full text-white text-lg uppercase ml-9 font-bold tracking-widest">
              {{ checkedName.length > 0 ? checkedName : 'full name' }}
            </span>
            <span class="flex w-auto justify-end text-black text-lg uppercase mr-9 font-bold tracking-widest">
              {{ props.expirationDate.length > 0 ? expiration[0] + '/' + (expiration[1] ? expiration[1] : 'YY') : 'mm/yy' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: String,
  expirationDate: String,
  card: String
})

const cardArray = computed(() => {
  if (props.card === '') {
    return ['####', '####', '####', '####']
  }
  let num = props.card
  if (num.length < 16) {
    num += '#'.repeat(16-num.length)
  }
  let cArray = []
  for (let i = 0; i < 16; i += 4) {
    cArray.push(num.substring(i, i + 4))
  }

  return cArray
})

const cardType = computed(() => {
  if (Number(cardArray.value[0]) >= 0 && Number(cardArray.value[0]) < 3334) {
    return '/Visa.png'
  }
  else if (Number(cardArray.value[0]) > 3333 && Number(cardArray.value[0]) < 6667) {
    return '/MasterCard.png'
  }
  else if (Number(cardArray.value[0]) > 6666 && Number(cardArray.value[0]) < 10000) {
    return '/MIR.png'
  }
  else {
    return '/None.png'
  }
})

const checkedName = computed(() => {
  return props.name.length > 20 ? props.name.substring(0, 20) + '...' : props.name
})

const expiration = computed(() => {
  return props.expirationDate.split('/')
})
</script>