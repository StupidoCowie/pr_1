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
    </div>
    <div>
			<Card :width="'850px'" :label="'JSON Editor'" class="mt-5">
				<div>
					<div
						v-for="(val, key) in json"
						:key="key"
						class="flex items-start"
						:class="object(val) ? 'flex-col' : 'flex-row'"
					>
						<div
						>
							{{ key  }}:&nbsp;
						</div>
						<div
							class="ml-5"
						>
							{{ val }}
						</div>
					</div>
				</div>
			</Card>
		</div>
	</div>
</template>

<!-- 
	TODO: 
		1) Readable view for JSON
		2) Option to add new key-value pairs
		3) Option to change existing key-value pairs
		4) Some design things to underline types, values, etc.
-->

<script setup>
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import json from '@/assets/test.json'

import { ref } from 'vue'

import { isArray } from '@vue/shared'

// for (let i in json) {
// 	if (isArray(json[i])) {
// 		console.log(json[i])
// 	}
// }

const jsonTree = ref({
	label: 'JSON',
	nodes: []
})

const convert = (key, val, node) => {
	if (typeof val !== 'object' || isArray(val) || val === null) {
		node.nodes.push({
			label: key,
			nodes: val
		})
	}
	else {
		node.nodes.push({
			label: key,
			nodes: []
		})
		for (let el in val) {
			convert(el, val[el], node.nodes[node.nodes.length - 1])
		}
	}
}

for (let key in json) {
	convert(key, json[key], jsonTree.value)
}
console.log(jsonTree.value)

const object = (val) => {
	if (typeof val === 'object' && val !== null) {
		return true
	}
	return false
}

</script>