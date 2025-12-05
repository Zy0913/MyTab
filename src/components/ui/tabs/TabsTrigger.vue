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
      'tabs-trigger inline-flex items-center justify-center whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      $props.class
    )"
  >
    <slot />
  </TabsTrigger>
</template>

<style scoped>
.tabs-trigger {
  color: var(--theme-text-secondary);
}

.tabs-trigger:hover {
  background: var(--theme-bg-hover);
}

.tabs-trigger[data-state="active"] {
  background: var(--theme-bg-hover);
  color: var(--theme-text);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
