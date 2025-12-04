<script setup>
import { ContextMenuContent, ContextMenuPortal } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  class: String
})
</script>

<template>
  <ContextMenuPortal>
    <ContextMenuContent
      :class="cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-xl border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-1.5 text-popover-foreground shadow-xl',
        $props.class
      )"
    >
      <slot />
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
