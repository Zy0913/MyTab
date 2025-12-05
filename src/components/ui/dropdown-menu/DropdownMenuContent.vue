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
        'z-50 min-w-[8rem] overflow-hidden rounded-xl backdrop-blur-xl p-1.5 shadow-xl',
        $props.class
      )"
      style="background: var(--theme-bg); border: 1px solid var(--theme-border); color: var(--theme-text);"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
