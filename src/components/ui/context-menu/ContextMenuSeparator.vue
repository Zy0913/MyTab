<script setup>
import { ContextMenuSeparator } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  class: String
})
</script>

<template>
  <ContextMenuSeparator :class="cn('-mx-1 my-1 h-px bg-border', $props.class)" />
</template>
