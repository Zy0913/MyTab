<script setup>
import { TooltipContent, TooltipPortal } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  class: String,
  sideOffset: { type: Number, default: 4 }
})
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side-offset="sideOffset"
      :class="cn(
        'z-50 overflow-hidden rounded-lg border border-white/20 bg-gray-900/90 backdrop-blur-md px-3 py-1.5 text-sm text-white shadow-lg',
        $props.class
      )"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
