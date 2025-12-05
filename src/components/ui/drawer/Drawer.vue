<script setup>
import { watch } from 'vue'

const props = defineProps({
  open: Boolean
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
        class="fixed inset-0 z-50 bg-black/20"
        @click="close"
      />
    </Transition>

    <!-- 下拉面板 -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-4 scale-95"
    >
      <div
        v-if="open"
        class="settings-panel fixed top-14 right-4 z-50 w-80 max-h-[80vh] backdrop-blur-2xl shadow-2xl flex flex-col rounded-2xl overflow-hidden"
      >
        <slot :close="close" />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Apple 风格毛玻璃弹出层 */
.settings-panel {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #1f2937;
}

@media (prefers-color-scheme: dark) {
  .settings-panel {
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 0, 0, 0.2);
    color: #f3f4f6;
  }
}
</style>
