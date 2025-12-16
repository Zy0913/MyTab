<script setup>
import { ref, onMounted, computed } from 'vue'
import { Sun, Cloud, CloudRain, CloudSnow, CloudLightning, CloudFog, Wind, MapPin } from 'lucide-vue-next'
import { showWeather, weatherCity, weatherUnit } from '@/stores/settings'

const loading = ref(true)
const error = ref(false)
const weather = ref({
  temp: 0,
  condition: 'Sunny',
  location: ''
})

// 天气图标映射
const iconMap = {
  Sunny: Sun,
  Clear: Sun,
  Cloudy: Cloud,
  Overcast: Cloud,
  Rain: CloudRain,
  Drizzle: CloudRain,
  Snow: CloudSnow,
  Thunder: CloudLightning,
  Fog: CloudFog,
  Windy: Wind
}

const weatherIcon = computed(() => iconMap[weather.value.condition] || Sun)

const displayTemp = computed(() => {
  const temp = weather.value.temp
  if (weatherUnit.value === 'F') {
    return Math.round(temp * 9 / 5 + 32)
  }
  return Math.round(temp)
})

const unitSymbol = computed(() => weatherUnit.value === 'F' ? '°F' : '°C')

// 获取天气数据（使用 wttr.in，无需 API key）
async function fetchWeather() {
  loading.value = true
  error.value = false

  try {
    const city = weatherCity.value || 'Shanghai'
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    const response = await fetch(
      `https://wttr.in/${encodeURIComponent(city)}?format=j1`,
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)

    if (!response.ok) throw new Error('Weather fetch failed')

    const data = await response.json()
    const current = data.current_condition[0]

    // 映射天气状况
    const weatherCode = parseInt(current.weatherCode)
    let condition = 'Sunny'
    if (weatherCode >= 200 && weatherCode < 300) condition = 'Thunder'
    else if (weatherCode >= 300 && weatherCode < 600) condition = 'Rain'
    else if (weatherCode >= 600 && weatherCode < 700) condition = 'Snow'
    else if (weatherCode >= 700 && weatherCode < 800) condition = 'Fog'
    else if (weatherCode === 800 || weatherCode === 113) condition = 'Sunny'
    else if (weatherCode > 800 || weatherCode === 116 || weatherCode === 119) condition = 'Cloudy'
    else if (weatherCode === 122) condition = 'Overcast'

    weather.value = {
      temp: parseInt(current.temp_C),
      condition,
      location: data.nearest_area[0].areaName[0].value
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      console.error('Weather request timeout')
    } else {
      console.error('Failed to fetch weather:', e)
    }
    error.value = true
    weather.value = {
      temp: '--',
      condition: 'Sunny',
      location: weatherCity.value || '未知'
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  if (showWeather.value) {
    fetchWeather()
  }
})

// 暴露刷新方法供外部调用
defineExpose({ fetchWeather })
</script>

<template>
  <div
    v-if="showWeather"
    class="weather-widget flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md transition-all select-none"
    :class="{ 'opacity-60': loading || error }"
  >
    <component :is="weatherIcon" class="w-5 h-5" />
    <span class="text-sm font-medium">{{ displayTemp }}{{ unitSymbol }}</span>
    <div class="w-px h-3 bg-current opacity-20 mx-1" />
    <div class="flex items-center gap-1 text-xs opacity-80">
      <MapPin class="w-3 h-3" />
      <span>{{ weather.location }}</span>
    </div>
  </div>
</template>

<style scoped>
.weather-widget {
  background: var(--theme-bg);
  color: var(--theme-text);
  border: 1px solid var(--theme-border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.weather-widget:hover {
  background: var(--theme-bg-hover);
}
</style>