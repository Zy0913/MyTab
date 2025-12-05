<script setup>
import { PopoverContent, PopoverPortal } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: String,
  align: {
    type: String,
    default: 'center'
  },
  side: {
    type: String,
    default: 'bottom'
  },
  sideOffset: {
    type: Number,
    default: 4
  },
  alignOffset: {
    type: Number,
    default: 0
  },
  avoidCollisions: {
    type: Boolean,
    default: true
  }
})
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      :class="cn(
        'z-50 w-72 rounded-xl border bg-popover p-4 text-popover-foreground shadow-lg outline-none',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
        'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        props.class
      )"
      :align="align"
      :side="side"
      :side-offset="sideOffset"
      :align-offset="alignOffset"
      :avoid-collisions="avoidCollisions"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
