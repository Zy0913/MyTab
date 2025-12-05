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
        'z-50 min-w-[8rem] overflow-hidden rounded-xl backdrop-blur-xl p-1.5 shadow-xl',
        $props.class
      )"
      style="background: var(--theme-bg); border: 1px solid var(--theme-border); color: var(--theme-text);"
    >
      <slot />
    </ContextMenuContent>
  </ContextMenuPortal>
</template>
