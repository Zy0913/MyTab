<script setup>
import { PopoverTrigger } from 'radix-vue'

defineProps({
  asChild: Boolean
})
</script>

<template>
  <PopoverTrigger :as-child="asChild">
    <slot />
  </PopoverTrigger>
</template>
