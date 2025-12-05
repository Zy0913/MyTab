<script setup>
import { ContextMenuItem } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  class: String,
  disabled: Boolean
})
</script>

<template>
  <ContextMenuItem
    :disabled="disabled"
    :class="cn(
      'context-item relative flex cursor-default select-none items-center rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      $props.class
    )"
  >
    <slot />
  </ContextMenuItem>
</template>

<style scoped>
.context-item:hover,
.context-item:focus {
  background: var(--theme-bg-hover);
}
</style>
