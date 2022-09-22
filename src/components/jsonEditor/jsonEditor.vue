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
				<JsonNodes
					:value="jsonTree.label"
					:type="jsonTree.type"
					:json="jsonTree.nodes"
					:objectable="true"
					:margin="0"
				/>
			</Card>
		</div>
	</div>
</template>

<!-- 
	TODO: 
		DONE) Readable view for JSON
		DONE) Option to add new key-value pairs
		3) Option to change existing key-value pairs AND keys only
		4) Option to delete chosen key-value pair
		+) Make NewNode dialog kind of persistent
		+) Some design things to underline types, values, etc.
-->

<script setup>
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import JsonNodes from '@/components/jsonEditor/jsonNodes.vue'

import json from '@/assets/test.json'

import { ref, onMounted } from 'vue'

import { isArray } from '@vue/shared'


const jsonTree = ref({
	label: 'JSON',
	type: 'object',
	nodes: []
})

const convert = (key, val, node) => {
	// console.log(val)
	if (typeof val !== 'object' || isArray(val) || val === null) {
		if(isArray(val)) {
			node.nodes.push({
				label: key,
				type: 'array',
				nodes: []
			})
			val.forEach((el, ind) => {
				convert(ind.toString(), el, node.nodes[node.nodes.length - 1])
			})
		}
		else {
			node.nodes.push({
				label: key,
				type: val === null ? 'null' : typeof val,
				nodes: [val]
			})
		}
	}
	else {
		node.nodes.push({
			label: key,
			type: 'object',
			nodes: []
		})
		for (let el in val) {
			convert(el, val[el], node.nodes[node.nodes.length - 1])
		}
	}
}

onMounted(() => {
	// console.log(json)
	for (let key in json) {
		convert(key, json[key], jsonTree.value)
	}
	console.log(jsonTree.value)
})

</script>