<script setup>
import { TabsRoot } from 'radix-vue'

defineProps({
  defaultValue: String,
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])
</script>

<template>
  <TabsRoot
    :default-value="defaultValue"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <slot />
  </TabsRoot>
</template>
