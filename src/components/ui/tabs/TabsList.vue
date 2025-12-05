<script setup>
import { TabsList } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  class: String
})
</script>

<template>
  <TabsList
    :class="cn(
      'inline-flex h-10 items-center justify-center rounded-full backdrop-blur-xl p-1 shadow-lg',
      $props.class
    )"
    style="background: var(--theme-bg); border: 1px solid var(--theme-border); color: var(--theme-text-secondary);"
  >
    <slot />
  </TabsList>
</template>
