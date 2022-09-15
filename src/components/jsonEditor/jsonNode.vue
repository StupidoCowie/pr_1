<template>
	<jsonNode
		v-for="val in nodes"
		:json="val"
		:class="shift"
	>

	</jsonNode>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
	json: Object,
	margin: {
		type: Number,
		required: false
	}
})

const emits = defineEmits(['update:margin'])

const nodes = computed({
	get() {
		return props.json
	}
})

const shift = computed({
	get() {
		if (props.margin === 0) {
			return ''
		}
		shift.value += 4
		return `ml-${shift.value}`
	},
	set(value) {
		emits('update:margin', value)
	}
})
</script>