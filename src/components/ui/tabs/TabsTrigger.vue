<script setup>
import { TabsTrigger } from 'radix-vue'
import { cn } from '@/lib/utils'

defineProps({
  value: { type: String, required: true },
  class: String,
  disabled: Boolean
})
</script>

<template>
  <TabsTrigger
    :value="value"
    :disabled="disabled"
    :class="cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white/25 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:hover:bg-white/10',
      $props.class
    )"
  >
    <slot />
  </TabsTrigger>
</template>
