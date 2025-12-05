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
        'z-50 overflow-hidden rounded-lg backdrop-blur-md px-3 py-1.5 text-sm shadow-lg',
        $props.class
      )"
      style="background: var(--theme-bg); border: 1px solid var(--theme-border); color: var(--theme-text);"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
