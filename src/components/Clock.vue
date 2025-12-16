<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { showSeconds, use24Hour } from '@/stores/settings'

const now = ref(new Date())
let timer = null

function updateTime() {
  now.value = new Date()
}

function startTimer() {
  if (timer) clearInterval(timer)
  // 根据是否显示秒钟调整更新频率
  const interval = showSeconds.value ? 1000 : 60000
  timer = setInterval(updateTime, interval)
}

onMounted(() => {
  startTimer()
})

// 监听 showSeconds 变化以调整更新频率
watch(showSeconds, startTimer)

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})

const time = computed(() => {
  const hours = now.value.getHours()
  const minutes = now.value.getMinutes()
  const seconds = now.value.getSeconds()

  let h = hours
  let period = ''

  if (!use24Hour.value) {
    period = hours >= 12 ? ' PM' : ' AM'
    h = hours % 12 || 12
  }

  const timeStr = [
    String(h).padStart(2, '0'),
    String(minutes).padStart(2, '0'),
    ...(showSeconds.value ? [String(seconds).padStart(2, '0')] : [])
  ].join(':')

  return timeStr + period
})

const date = computed(() => {
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const year = now.value.getFullYear()
  const month = now.value.getMonth() + 1
  const day = now.value.getDate()
  const weekday = weekdays[now.value.getDay()]

  return `${year}年${month}月${day}日 ${weekday}`
})
</script>

<template>
  <div class="text-center select-none transition-colors duration-300">
    <div class="text-7xl md:text-8xl font-light drop-shadow-lg tracking-wider" style="color: var(--theme-text);">
      {{ time }}
    </div>
    <div class="text-xl md:text-2xl mt-2 drop-shadow-md" style="color: var(--theme-text-secondary);">
      {{ date }}
    </div>
  </div>
</template>
