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
      'inline-flex h-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-xl p-1 text-white/80 border border-white/20 shadow-lg',
      $props.class
    )"
  >
    <slot />
  </TabsList>
</template>
