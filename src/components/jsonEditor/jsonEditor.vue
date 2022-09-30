<template>
  <div 
		class="flex flex-row justify-center"
	>
		<div 
			class="absolute left-0 top-0 mt-16 ml-8"
		>
      <Button 
				:class="'bg-[#a1d6d6] shadow-md hover:bg-[#4be0e0] rounded-md hover:shadow-xl'" 
				:width="'48px'" 
				:height="'48px'" 
				:to="'/'"
			>
      <div 
				class="flex justify-center"
			>
        <svg 
					xmlns="http://www.w3.org/2000/svg" 
					class="h-4 w-4" 
					fill="none" 
					viewBox="0 0 24 24" 
					stroke="currentColor" 
					stroke-width="2"
				>
          <path 
						stroke-linecap="round" 
						stroke-linejoin="round" 
						d="M10 19l-7-7m0 0l7-7m-7 7h18"
					/>
        </svg>
      </div>
      </Button>
    </div>
    <div
			class="flex flex-col"
		>
			<Card 
				:width="'850px'" 
				:label="'JSON Editor'" 
				class="mt-5"
			>
				<JsonNodes
					v-model:value="jsonTree.label"
					v-model:type="jsonTree.type"
					v-model:json="jsonTree.nodes"
					:objectable="true"
					:margin="0"
					:changeable="false"
				/>
			</Card>
			<div
				class="flex justify-center"
			>
				<button
					class="bg-[#a1d6d6] shadow-md hover:bg-[#4be0e0] rounded-md hover:shadow-xl w-12 h-12 flex justify-center items-center"
					@click="saveJSON"
				>
					<svg 
						xmlns="http://www.w3.org/2000/svg" 
						viewBox="0 0 20 20" 
						fill="currentColor" 
						class="w-5 h-5"
					>
						<path 
							fill-rule="evenodd" 
							d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 
								1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm4.75 6.75a.75.75 0 011.5 
								0v2.546l.943-1.048a.75.75 0 011.114 1.004l-2.25 2.5a.75.75 0 01-1.114 0l-2.25-2.5a.75.75 
								0 111.114-1.004l.943 1.048V8.75z" 
							clip-rule="evenodd" 
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</template>

<!-- 
	TODO: 
		DONE) Readable view for JSON
		DONE) Option to add new key-value pairs
		DONE) Prevent adding of key-value pair if key already exists
		DONE) Option to change existing key-value pairs AND keys only
		DONE) Option to delete chosen key-value pair
		DONE) Save *new* JSON
		?) Make dialogs kind of persistent
		DONEish) Some design things to underline types, values, etc.
-->

<script setup>
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import JsonNodes from '@/components/jsonEditor/jsonNodes.vue'

import json from '@/assets/test.json'

import { ref, computed, onMounted } from 'vue'

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

const saveNode = (node, isArray) => {
	let reJSON = isArray ? [] : {}
	node.nodes.forEach(el => {
		if (el.type !== 'array' && el.type !== 'object') {
			isArray ? reJSON.push(el.nodes[0]) : reJSON[el.label] = el.nodes[0]
		}
		else if (el.type === 'array') {
			isArray ? reJSON.push(saveNode(el, true)) : reJSON[el.label] = saveNode(el, true)
		}
		else if (el.type === 'object') {
			isArray ? reJSON.push(saveNode(el, false)) : reJSON[el.label] = saveNode(el, false)
		}
	})
	return reJSON
}

const saveJSON = () => {
	const file = JSON.stringify(saveNode(jsonTree.value, false))
	const filename = 'res.json'
	const elem = document.createElement('a')
	elem.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(file))
	elem.setAttribute('download', filename)

	elem.style.display = 'none'
	document.body.appendChild(elem)
	elem.click()
	document.body.removeChild(elem)
}

onMounted(() => {
	// console.log(json)
	for (let key in json) {
		convert(key, json[key], jsonTree.value)
	}
	// console.log(jsonTree.value)
})

</script>