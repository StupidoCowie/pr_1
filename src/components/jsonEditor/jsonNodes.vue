<template>
	<hr>
	<div
		v-if="objectableOp"
	>
		<div 
			class="flex flex-row"
			:style="shift"
		>
			<div 
				v-if="isObject(nodes)"
				class="flex items-center"
				style="cursor: pointer;"
			>
				<svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" @click="toggleNodes">
					<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
				</svg>
				<svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" @click="toggleNodes">
					<path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
				</svg>
			</div>
			<div class="flex flex-row">
				<input
					class="w-28 bg-gray-300
						focus:outline-none"
					:value="valueValue"
					style="cursor: pointer;"
					readonly
					@click="toggleNodes"
				/>
				<div
					v-if="isOpen"
					class="flex items-center"
					style="cursor: pointer;"
				>
					<svg v-if="!newElement" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" class="w-5 h-5" @click="newElement = !newElement">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clip-rule="evenodd" />
					</svg>
					<div v-else
						class="flex flex-row"
					>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="green" class="w-5 h-5" @click="addElement">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="red" class="w-5 h-5" @click="newElement = !newElement">
							<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clip-rule="evenodd" />
						</svg>
					</div>
				</div>
			</div>
			<div
				v-if="newElement"
				class="ml-10"
			>
				<input v-model="newKey" class="bg-black text-white">
				{{ newKey }}
			</div>
		</div>
		<jsonNodes
			v-if="isOpen"
			v-for="node in nodes"
			:json="nullCheck(node)"
			:value="nodeCheck(node)"
			:objectable="suitableObj(node)"
			:margin="marginValue + 36"
		/>
	</div>
	<div 
		v-else 
		class="flex flex-row"
		:style="shift"
	>
		<div class="flex items-start ">
			<input
				class="w-28 bg-gray-300
					focus:outline-none"
				:value="valueValue"
				style="cursor: unset"
				readonly
			/>
		</div>
		<div
			v-if="nodes" 
			class="flex ml-5"
		>
			<input
				class="bg-gray-300"
				:value="nodeCheck(nodes)"
				style="cursor: unset"
				readonly
			/>
		</div>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
	json: [Boolean, String, Number, Object],
	value: {
		type: [Boolean, String, Number, Object],
		default: ''
	},
	margin: Number,
	objectable: Boolean
})

const isOpen = ref(false)
const newElement = ref(false)
const newKey = ref('')
const newVal = ref('')

const objectableOp = computed({
	get() {
		return props.objectable
	}
})

const marginValue = computed(() => {
	return props.margin
})

const shift = computed(() => {
	return objectableOp.value ? `margin-left: ${marginValue.value}px;` : `margin-left: ${marginValue.value + 20}px;`
})

const valueValue = computed(() => {
	return props.value
})

const nodes = computed({
	get() {
		// console.log(props.json)
		return props.json
	}
})

const nodeCheck = (node) => {
	if (node[0] === null) {
		return 'null'
	}
	return node.label ? node.label : node
}

const nullCheck = (node) => {
	if (node !== null) {
		return node.nodes
	}
}

const isObject = (node) => {
	return typeof node === 'object' && node !== null
}

const suitableObj = (node) => {
	return isObject(node.nodes) && node.nodes.length > 1
}

const toggleNodes = () => {
	isOpen.value = !isOpen.value
}

const addElement = () => {
	newElement.value = !newElement.value
}
</script>