<script setup>
import { TooltipRoot, TooltipProvider } from 'radix-vue'
</script>

<template>
  <TooltipProvider>
    <TooltipRoot>
      <slot />
    </TooltipRoot>
  </TooltipProvider>
</template>
