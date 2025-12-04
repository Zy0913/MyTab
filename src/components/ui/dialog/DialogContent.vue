<script setup>
import { DialogPortal, DialogOverlay, DialogContent, DialogClose } from 'radix-vue'
import { cn } from '@/lib/utils'
import { X } from 'lucide-vue-next'

defineProps({
  class: String
})
</script>

<template>
  <DialogPortal>
    <DialogOverlay
      class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
    />
    <DialogContent
      :class="cn(
        'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-white/20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-6 shadow-2xl duration-200 sm:rounded-2xl',
        $props.class
      )"
    >
      <slot />
      <DialogClose
        class="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring disabled:pointer-events-none"
      >
        <X class="h-4 w-4" />
        <span class="sr-only">关闭</span>
      </DialogClose>
    </DialogContent>
  </DialogPortal>
</template>
