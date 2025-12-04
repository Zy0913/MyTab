<script setup>
import { ref, watch } from 'vue'
import { Check, X, AlertCircle, Info } from 'lucide-vue-next'

const props = defineProps({
  show: Boolean,
  type: { type: String, default: 'success' }, // success, error, info
  title: String,
  message: String,
  duration: { type: Number, default: 3000 }
})

const emit = defineEmits(['close'])

const visible = ref(false)

watch(() => props.show, (val) => {
  if (val) {
    visible.value = true
    if (props.duration > 0) {
      setTimeout(() => {
        visible.value = false
        emit('close')
      }, props.duration)
    }
  } else {
    visible.value = false
  }
}, { immediate: true })

const icons = {
  success: Check,
  error: AlertCircle,
  info: Info
}

const styles = {
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  info: 'bg-blue-500'
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <div
        v-if="visible"
        class="fixed top-4 right-4 z-[100] flex items-center gap-3 px-4 py-3 rounded-xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl border border-white/20 max-w-sm"
      >
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center text-white shrink-0"
          :class="styles[type]"
        >
          <component :is="icons[type]" class="w-4 h-4" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white">{{ title }}</p>
          <p v-if="message" class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ message }}</p>
        </div>
        <button
          @click="visible = false; emit('close')"
          class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
