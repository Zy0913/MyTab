<script setup>
import { computed } from 'vue'
import * as icons from 'lucide-vue-next'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 16 },
  strokeWidth: { type: Number, default: 2 }
})

const IconComponent = computed(() => {
  return icons[props.name] || icons.HelpCircle
})
</script>

<template>
  <component
    :is="IconComponent"
    :size="size"
    :stroke-width="strokeWidth"
  />
</template>
