<script setup>
import { watch } from 'vue'

const props = defineProps({
  open: Boolean,
  side: { type: String, default: 'right' } // left, right
})

const emit = defineEmits(['update:open'])

function close() {
  emit('update:open', false)
}

// 禁止背景滚动
watch(() => props.open, (val) => {
  document.body.style.overflow = val ? 'hidden' : ''
})
</script>

<template>
  <Teleport to="body">
    <!-- 遮罩 -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="open"
        class="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        @click="close"
      />
    </Transition>

    <!-- 抽屉内容 -->
    <Transition
      :enter-active-class="`transition-transform duration-300 ease-out`"
      :enter-from-class="side === 'right' ? 'translate-x-full' : '-translate-x-full'"
      enter-to-class="translate-x-0"
      :leave-active-class="`transition-transform duration-200 ease-in`"
      leave-from-class="translate-x-0"
      :leave-to-class="side === 'right' ? 'translate-x-full' : '-translate-x-full'"
    >
      <div
        v-if="open"
        class="fixed top-0 bottom-0 z-50 w-full max-w-sm bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl shadow-2xl flex flex-col border-l border-white/20"
        :class="side === 'right' ? 'right-0' : 'left-0'"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </Teleport>
</template>
