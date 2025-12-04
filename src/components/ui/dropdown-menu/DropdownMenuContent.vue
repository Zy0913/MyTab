<script setup>
import { DropdownMenuContent, DropdownMenuPortal } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  class: String,
  sideOffset: { type: Number, default: 4 },
  align: { type: String, default: 'center' }
})
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      :side-offset="sideOffset"
      :align="align"
      :class="cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-xl border border-white/20 bg-white/15 backdrop-blur-xl p-1.5 text-white shadow-xl',
        $props.class
      )"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
