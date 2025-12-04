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
      'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
      $props.class
    )"
  >
    <slot />
  </ContextMenuItem>
</template>
