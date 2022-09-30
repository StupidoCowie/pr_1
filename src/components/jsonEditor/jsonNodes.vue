<template>
	<hr>
	<div 
		class="flex flex-row"
	>
		<div
			v-if="isChangeable"
			class="flex mt-1 mr-1"
			style="cursor: pointer;"
			:style="shift"
		>
			<svg 
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				class="w-4 h-4"
				@click="editElementOpen"
			>
				<path 
					d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 
					001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" 
				/>
			</svg>
		</div>
		<div
			v-if="objectableOp"
		>
			<div 
				class="flex flex-row"
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
							@click="newElementOpen"
						>
							<path 
								fill-rule="evenodd" 
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 
									0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" 
								clip-rule="evenodd" 
							/>
						</svg>
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							viewBox="0 0 20 20" 
							fill="red" 
							class="w-5 h-5 ml-2"
							@click="deleteElementOpen"
						>
							<path 
								fill-rule="evenodd" 
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 
									10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 
									10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" 
								clip-rule="evenodd" />
						</svg>
					</div>
				</div>
			</div>
			<jsonNodes
				v-if="isOpen"
				v-for="node in nodes"
				:json="node.nodes"
				v-model:type="node.type"
				v-model:value="node.label"
				:objectable="suitableObj(node)"
				:margin="marginValue"
				changeable
			/>
		</div>
		<div 
			v-else 
			class="flex flex-row"
			:style="innerShift"
		>
			<div 
				class="flex items-start"
			>
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
					:class="pickColor()"
					:value="nodeCheck(nodes)"
					style="cursor: unset"
					readonly
				/>
			</div>
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
		v-if="deleteElement"
		v-model:activate="deleteElement"
		:label="valueValue"
		:type="getType"
		v-model:node="nodes"
	/>
	<EditNodeDialog
		v-if="editElement"
		v-model:activate="editElement"
		v-model:label="valueValue"
		v-model:type="getType"
		v-model:node="nodes"
	/>
</template>

<script setup>
import { ref, computed } from 'vue'

import NewNodeDialog from '@/components/jsonEditor/NewNodeDialog.vue'
import DeleteNodeDialog from '@/components/jsonEditor/DeleteNodeDialog.vue'
import EditNodeDialog from '@/components/jsonEditor/EditNodeDialog.vue'

const props = defineProps({
	json: Object,
	value: {
		type: [Boolean, String, Number, Object],
		default: ''
	},
	type: String,
	margin: Number,
	objectable: Boolean,
	changeable: Boolean
})

const emits = defineEmits([
	'update:json',
	'update:type',
	'update:value'
])

const isOpen = ref(false)
const newElement = ref(false)
const deleteElement = ref(false)
const editElement = ref(false)

const isChangeable = computed(() => {
	return props.changeable
})

const enchancedColorClass = computed(() => {
	return nodes.value ? 'text-black' : pickColor()
})

const pickColor = () => {
	switch (getType.value) {
		case 'number':
			return 'text-red-600'
		case 'string':
			return 'text-green-600'
		case 'boolean':
			return 'text-yellow-600'
		case 'null':
			return 'text-blue-600'
	}
}

const objectableOp = computed(() => {
	return props.objectable
})

const marginValue = computed(() => {
	return props.margin
})

const shift = computed(() => {
	return `margin-left: ${marginValue.value}px;`
})

const innerShift = computed(() => {
	return 'margin-left: 20px;'
})

const valueValue = computed({
	get() {
		return props.value
	},
	set(value) {
		emits('update:value', value)
	}
})

const nodes = computed({
	get() {
		// console.log(props)
		return props.json
	},
	set(value) {
		emits('update:json', value)
	}
})

const getType = computed({
	get() {
		return props.type
	},
	set(value) {
		emits('update:type', value)
	}
})

const nodeCheck = (node) => {
	// console.log(node, node.label)
	if (node[0] === null) {
		return 'null'
	}
	return node.label ? node.label : node
}

const isObject = (node) => {
	return typeof node === 'object' && node !== null
}

const suitableObj = (node) => {
	return node.type === 'array' || node.type === 'object'
}

const toggleNodes = () => {
	isOpen.value = !isOpen.value
}

const newElementOpen = () => {
	newElement.value = !newElement.value
}

const deleteElementOpen = () => {
	deleteElement.value = !deleteElement.value
}

const editElementOpen = () => {
	editElement.value = !editElement.value
}
</script>