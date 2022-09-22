<template>
	<Teleport to="body">
		<dialog
			class="bg-[#afc9c9] shadow-2xl border-black border-[1px] rounded-md inset-0 w-[290px]"
			:open="openDialog"
		>
			<div>bla</div>
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

const openDialog = computed({
	get() {
		return props.activate
	},
	set(value) {
		emits('update:activate', value)
	}
})
</script>