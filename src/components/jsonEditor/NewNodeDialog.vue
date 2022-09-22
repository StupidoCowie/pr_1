<template>
	<Teleport to="body">
		<dialog
			class="bg-[#afc9c9] shadow-2xl border-black border-[1px] rounded-md inset-0 w-[290px]"
			:open="openDialog"
		>
			<div 
				class="flex flex-col"
			>
				<div 
					class="flex justify-center"
				>
					{{ dialogLabel }} - {{ getType }}
				</div>
				<div 
					class="flex justify-center my-2"
				>
					<select 
						class="w-full focus:outline-none rounded-md"
						v-model="selectedOpt"
					>
						<option
							v-for="opt in typeChoice"
							:value="opt"
						>
							{{ opt }}
						</option>
					</select>
				</div>
				<div
					v-if="isObject"
					class="flex justify-center mb-2"
				>
					<input 
						class="rounded-md focus:outline-none pl-2"
						v-model="newKey"
						placeholder="Key"
					>
				</div>
				<div 
					v-if="valReq"
					class="flex justify-center mb-2"
				>
					<select 
						v-if="isBoolean"
						class="w-full focus:outline-none rounded-md"
						v-model="newVal"
					>
						<option 
							v-for="opt in booleanChoice"
							:value="opt"
						>
							{{ opt }}
						</option>
					</select>
					<input 
						v-else
						class="rounded-md pl-2"
						v-model="newVal"
						placeholder="Value"
					>
				</div>
				<div 
					class="flex justify-center"
				>
					<button
						class="bg-[#a1d6d6] shadow-md hover:bg-[#42cc4e] rounded-md hover:shadow-xl w-20 h-8"
						@click="addElement"
					>
						Add
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
import { ref, computed, watch } from 'vue'

const props = defineProps({
	activate: Boolean,
	label: String,
	type: String,
	node: Object
})

const emits = defineEmits([
	'update:activate',
	'update:node'
])

const newKey = ref('')
const newVal = ref('')
const booleanChoice = ref(['true', 'false'])

const openDialog = computed({
	get() {
		console.log(node.value)
		return props.activate
	},
	set(value) {
		emits('update:activate', value)
	}
})

const dialogLabel = computed(() => {
	return props.label
})

const getType = computed(() => {
	return props.type
})

const isObject = computed(() => {
	return props.type === 'object' 
})

const valReq = computed(() => {
	return !['Object', 'Array', 'Null'].includes(selectedOpt.value)
})

const node = computed({
	get(){
		return props.node
	},
	set(value) {
		emits('update:node', value)
	}
})

const addElement = () => {
	let valToAdd = setValue()
	// console.log(valToAdd)
	node.value.push({
		label: getType.value === 'array' ? node.value.length.toString() : newKey.value,
		type: selectedOpt.value.toLowerCase(),
		nodes: selectedOpt.value === 'Array' || selectedOpt.value === 'Object' ? valToAdd : [valToAdd]
	})
	closeDialog()
	// console.log(node.value)
}

const setValue = () => {
	let valToAdd
	switch(selectedOpt.value) {
		case 'Number':
			valToAdd = Number(newVal.value)
			break
		case 'String':
			valToAdd = newVal.value
			break
		case 'Boolean':
			valToAdd = newVal.value === 'true' ? true : false
			break
		case 'Null':
			valToAdd = null
			break
		case 'Object':
		case 'Array':
			valToAdd = []
			break
	}
	return valToAdd
}

const typeChoice = ref(['Object', 'Array', 'Number', 'String', 'Boolean', 'Null'])

const selectedOpt = ref(typeChoice.value[0])

const isBoolean = computed(() => {
	return selectedOpt.value === 'Boolean'
})

const closeDialog = () => {
	openDialog.value = false
}

watch(() => selectedOpt.value, () => {
	if (isBoolean.value) {
		newVal.value = true
	}
})
</script>