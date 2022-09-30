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
					Choose node to delete:
				</div>
				<select
					class="w-full focus:outline-none rounded-md"
					v-model="nodeToDelete"
				>
					<option
						v-for="opt in nodeList"
						:value="opt"
					>
						{{ opt }}
					</option>
				</select>
				<div 
					class="flex justify-center mt-2"
				>
					<button
						class="bg-[#a1d6d6] shadow-md hover:bg-[#42cc4e] rounded-md hover:shadow-xl w-20 h-8"
						@click="deleteNode"
					>
						Delete
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
import { ref, computed } from 'vue'


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


const openDialog = computed({
	get() {
		return props.activate
	},
	set(value) {
		emits('update:activate', value)
	}
})

const nodeList = computed(() => {
	return props.node.map(e => {
		return e.label
	})
})

const nodeToDelete = ref(nodeList.value[0])

const nodes = computed({
	get(){
		return props.node
	},
	set(value) {
		emits('update:node', value)
	}
})

const getType = computed(() => {
	return props.type
})

const deleteNode = () => {
	nodes.value.splice(nodes.value.indexOf(nodes.value.filter(e => e.label === nodeToDelete.value)[0]), 1)
	if (getType.value === 'array') {
		nodes.value.forEach((el, index) => {
			el.label = index
		})
	}

	closeDialog()
}

const closeDialog = () => {
	openDialog.value = false
}
</script>