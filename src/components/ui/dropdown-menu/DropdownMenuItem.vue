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
      'relative flex cursor-default select-none items-center rounded-lg px-2.5 py-1.5 text-sm outline-none transition-colors focus:bg-white/20 hover:bg-white/20 data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      $props.class
    )"
  >
    <slot />
  </DropdownMenuItem>
</template>
