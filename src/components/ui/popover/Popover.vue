<script setup>
import { PopoverRoot } from 'radix-vue'

const props = defineProps({
  defaultOpen: Boolean,
  open: Boolean,
  modal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:open'])
</script>

<template>
  <PopoverRoot
    :default-open="defaultOpen"
    :open="open"
    :modal="modal"
    @update:open="emit('update:open', $event)"
  >
    <slot />
  </PopoverRoot>
</template>
