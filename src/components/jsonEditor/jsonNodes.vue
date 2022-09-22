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
				<svg 
					v-if="!isOpen" 
					xmlns="http://www.w3.org/2000/svg" 
					viewBox="0 0 20 20" 
					fill="currentColor" 
					class="w-5 h-5" 
					@click="toggleNodes"
				>
					<path 
						fill-rule="evenodd" 
						d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 
							4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" 
						clip-rule="evenodd" 
					/>
				</svg>
				<svg 
					v-else 
					xmlns="http://www.w3.org/2000/svg" 
					viewBox="0 0 20 20" 
					fill="currentColor" 
					class="w-5 h-5" 
					@click="toggleNodes"
				>
					<path 
						fill-rule="evenodd" 
						d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 
							4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" 
						clip-rule="evenodd" 
					/>
				</svg>
			</div>
			<div 
				class="flex flex-row"
			>
				<input
					class="w-28 bg-gray-200 focus:outline-none"
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
					<svg 
						v-if="!newElement" 
						xmlns="http://www.w3.org/2000/svg" 
						viewBox="0 0 20 20" 
						fill="green" 
						class="w-5 h-5 ml-2" 
						@click="newElementCheck"
					>
						<path 
							fill-rule="evenodd" 
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 
								0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" 
							clip-rule="evenodd" 
						/>
					</svg>
					<!-- <div 
						v-else
						class="flex flex-row"
					>
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							viewBox="0 0 20 20" 
							fill="green" 
							class="w-5 h-5" 
							@click="addElement"
						>
							<path 
								fill-rule="evenodd" 
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 
									4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" 
								clip-rule="evenodd" 
							/>
						</svg>
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							viewBox="0 0 20 20" 
							fill="red" 
							class="w-5 h-5" 
							@click="cancelNewElement"
						>
							<path 
								fill-rule="evenodd" 
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 
									1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 
									0 00-1.06-1.06L10 8.94 8.28 7.22z" 
								clip-rule="evenodd" 
							/>
						</svg>
					</div> -->
				</div>
			</div>
			<!-- <div
				v-if="newElement"
				class="ml-10"
			>
				<input 
					v-model="newKey" 
					class="bg-black text-white"
				>
				{{ newKey }}
			</div> -->
		</div>
		<jsonNodes
			v-if="isOpen"
			v-for="node in nodes"
			:json="nullCheck(node)"
			:type="node.type"
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
		<div class="flex items-start">
			<input
				class="w-28 bg-gray-200 focus:outline-none"
				:class="enchancedColorClass"
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
				class="bg-gray-200 focus:outline-none"
				:class="colorClass"
				:value="nodeCheck(nodes)"
				style="cursor: unset"
				readonly
			/>
		</div>
	</div>

	<NewNodeDialog 
		v-if="newElement"
		v-model:activate="newElement"
		:label="valueValue"
		:type="getType"
		v-model:node="nodes"
	/>
	<DeleteNodeDialog
		v-if="newElement"
		v-model:activate="newElement"
	/>
</template>

<script setup>
import { ref, computed } from 'vue'

import NewNodeDialog from '@/components/jsonEditor/NewNodeDialog.vue'
import DeleteNodeDialog from '@/components/jsonEditor/DeleteNodeDialog.vue'
import { isArray } from '@vue/shared';

const props = defineProps({
	json: [Boolean, String, Number, Object],
	value: {
		type: [Boolean, String, Number, Object],
		default: ''
	},
	type: String,
	margin: Number,
	objectable: Boolean
})

const isOpen = ref(false)
const newElement = ref(false)

const colorClass = computed(() => {
	if (typeof nodes.value === 'object') {
		return pickColor(nodes.value[0])
	}
	else {
		return pickColor(valueValue.value)
	}
})

const enchancedColorClass = computed(() => {
	return nodes.value ? 'text-black' : colorClass.value
})

const checkArray = computed(() => {
	return isArray(valueValue.value)
})

const pickColor = (element) => {
	if (typeof element === 'number') {
		return 'text-red-600'
	}
	else if (typeof element === 'string') {
		return 'text-green-600'
	}
	else if (typeof element === 'boolean') {
		return 'text-yellow-600'
	}
	else if (element === null) {
		return 'text-blue-600'
	}
}

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
		// console.log(props)
		return props.json
	}
})

const getType = computed(() => {
	return props.type
})

const nodeCheck = (node) => {
	// console.log(node, node.label)
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
	return node.type === 'array' || node.type === 'object'
	// return isObject(node.nodes) && node.nodes.length > 1
}

const toggleNodes = () => {
	isOpen.value = !isOpen.value
}

const newElementCheck = () => {
	newElement.value = !newElement.value
}
</script>