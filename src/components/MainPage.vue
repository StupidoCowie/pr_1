<template>
  <div class="flex flex-col">
    <div class="flex justify-center">
      <TextCard :width="'750px'" :label="'Lorem'" class="mt-5">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque, sint sit! Assumenda, aut veniam vero asperiores sunt repellendus perspiciatis excepturi, distinctio officiis, voluptas corporis ipsum aperiam quos. Voluptatibus, consequatur tempora.
      </TextCard>
    </div>
    <div class="flex justify-center">
      <Button :class="'shadow-md bg-[#a1d6d6] hover:bg-[#4be0e0] rounded-md hover:shadow-xl mt-5'" :width="'120px'" :height="'30px'" :to="'/paycheck'">Practice #1</Button>
    </div>
  </div>
</template>

<script setup>
import TextCard from '@/components/ui/TextCard.vue'
import Button from '@/components/ui/Button.vue'


</script>