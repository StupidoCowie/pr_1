<template>
	<div 
		class="flex flex-row"
		:style="shift"
	>
		<div v-if="isObject(nodes)">
			<svg v-if="!isOpen" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" @click="toggleNodes">
				<path d="M10.75 6.75a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" />
			</svg>

			<svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5" @click="toggleNodes">
				<path d="M6.75 9.25a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" />
			</svg>
		</div>
		<input
			class="flex items-start w-28"
			:value="valueValue"
			style="cursor: unset"
			readonly
		/>
	</div>
	<hr>
	<jsonNodes
		v-if="isOpen"
		v-for="node in nodes"
		:json="nullCheck(node)"
		:value="nodeCheck(node)"
		:margin="marginValue + 24"
	/>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
	json: [Boolean, String, Number, Object],
	value: {
		type: [Boolean, String, Number, Object],
		default: ''
	},
	margin: Number
})

const isOpen = ref(false)

const toggleNodes = () => {
	isOpen.value = !isOpen.value
}

const marginValue = computed(() => {
	return props.margin
})

const shift = computed(() => {
	return `margin-left: ${marginValue.value}px;`
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
	if (node === null) {
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
</script>