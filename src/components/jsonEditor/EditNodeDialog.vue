<template>
	<Teleport to="body">
		<dialog
			class="bg-[#afc9c9] shadow-2xl border-black border-[1px] rounded-md inset-0 w-[290px]"
			:open="openDialog"
		>
			<div>
				<div 
					class="flex justify-center"
				>
					Want to change {{ nodeLabel }}?
				</div>
				<div
					class="mt-2"
				>
					<input
						class="w-full focus:outline-none rounded-md pl-1"
						v-model="newLabel"
						placeholder="Label"
					>
				</div>
				<div
					v-if="!typeCheck"
					class="flex justify-center flex-col mt-2"
				>
					<select 
						class="w-full focus:outline-none rounded-md"
						v-model="currentType"
					>
						<option 
							v-for="opt in typeChoice"
							:value="opt"
						>
							{{ opt }}
						</option>
					</select>
					<div
						v-if="isBoolean"
						class="flex justify-center mt-1"
					>
						<input 
							class="mt-[6px] mr-1"
							type="checkbox"
							id="boolType"
							v-model="newValue"
						>
						<label 
							class="flex content-center"
							for="boolType">{{ newValue }}
						</label>
					</div>
					<div 
						v-else
						class="flex flex-row"
					>
						<input
							v-if="!typeCheck"
							class="w-full focus:outline-none rounded-md pl-1 mt-2 read-only:bg-black read-only:text-white"
							placeholder="Value"
							v-model="newValue"
							:readonly="isNull"
						>
					</div>
				</div>
				<div 
					v-if="isObject"
					class="flex"
				>
					<input
							class="w-full focus:outline-none rounded-md pl-1 mt-2"
							placeholder="Key"
							v-model="objKey"
						>
				</div>
				<div 
					class="flex justify-center mt-2"
				>
					<button
						class="bg-[#a1d6d6] shadow-md hover:bg-[#42cc4e] rounded-md hover:shadow-xl w-20 h-8"
						@click="editElement"
					>
						Done
					</button>
					<button
						class="bg-[#a1d6d6] shadow-md hover:bg-[#ff5151] rounded-md hover:shadow-xl w-20 h-8 ml-5"
						@click="closeDialog"
					>
						Cancel
					</button>
				</div>
			</div>
		</dialog>
	</Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'


const props = defineProps({
	activate: Boolean,
	label: String,
	type: String,
	node: Object
})

const emits = defineEmits([
	'update:activate',
	'update:label',
	'update:type',
	'update:node'
])

const newValue = ref()
const objKey = ref('')
const isNull = ref(false)
const typeChoice = ref(['Object', 'Array', 'Number', 'String', 'Boolean', 'Null'])

const isBoolean = computed(() => {
	return props.type === 'boolean' || currentType.value === 'Boolean' ? true : false
})

const nodeLabel = computed({
	get() {
		return props.label
	},
	set(value) {
		emits('update:label', value)
	}
})

const newLabel = ref(nodeLabel.value)

const nodeValue = computed(() => {
	return props.node[0] === null ? 'null' : props.node[0]
})

const node = computed({
	get() {
		return props.node
	},
	set(value) {
		emits('update:node', value)
	}
})

const typeOfVal = computed({
	get() {
		return props.type
	},
	set(value) {
		emits('update:type', value)
	}
})

const currentType = ref(typeOfVal.value[0].toUpperCase() + typeOfVal.value.slice(1, typeOfVal.value.length))

const typeCheck = computed(() => {
	return typeOfVal.value === 'array' || typeOfVal.value === 'object'
})

const isObject = computed(() => {
	return currentType.value === 'Object' && typeOfVal.value !== 'object'
})

const openDialog = computed({
	get() {
		newValue.value = nodeValue.value
		return props.activate
	},
	set(value) {
		emits('update:activate', value)
	}
})

const editElement = () => {
	if (currentType.value !== 'Object' && currentType.value !== 'Array') {
		node.value.pop()
	}
	nodeLabel.value = newLabel.value
	typeOfVal.value = currentType.value.toLowerCase()
	switch(currentType.value){
		case 'Null':
			node.value.push(null)
			break
		case 'Number':
		case 'String':
		case 'Boolean':
			typeOfVal.value === 'number'
				? node.value.push(Number(newValue.value))
				: node.value.push(newValue.value)
			break
	}
	closeDialog()
}

const closeDialog = () => {
	openDialog.value = false
}

onMounted(() => {
	if (currentType.value === 'Null') {
		newValue.value = 'null'
		isNull.value = true
	}
	else {
		isNull.value = false
	}
})

watch(() => currentType.value, () => {
	if (currentType.value === 'Null') {
		newValue.value = 'null'
		isNull.value = true
	}
	else if (currentType.value === 'Boolean') {
		newValue.value = true
	}
	else {
		isNull.value = false
	}
})
</script>