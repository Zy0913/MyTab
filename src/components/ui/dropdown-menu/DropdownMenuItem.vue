<script setup>
import { DropdownMenuItem } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  class: String,
  disabled: Boolean
})
</script>

<template>
  <DropdownMenuItem
    :disabled="disabled"
    :class="cn(
      'dropdown-item relative flex cursor-default select-none items-center rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      $props.class
    )"
  >
    <slot />
  </DropdownMenuItem>
</template>

<style scoped>
.dropdown-item:hover,
.dropdown-item:focus {
  background: var(--theme-bg-hover);
}
</style>
