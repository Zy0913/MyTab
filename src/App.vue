<script setup>
import { ref, watch, onMounted } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import Clock from './components/Clock.vue'
import SearchBox from './components/SearchBox.vue'
import BookmarkGrid from './components/BookmarkGrid.vue'
import Settings from './components/Settings.vue'
import { Button } from './components/ui/button'
import { backgroundUrl, showClock, fetchWallpaperBySource, backgroundBrightness, backgroundBlur } from './stores/settings'

// 双层背景交替显示
const bgA = ref('')
const bgB = ref('')
const showA = ref(true)  // true 显示 A 层，false 显示 B 层
const bgLoaded = ref(false)
const isLoading = ref(false)
const isSearchFocused = ref(false)
const isChanging = ref(false)
const isDarkBg = ref(true)  // 背景是否为深色，决定文字颜色

// 搜索框聚焦状态变化
function handleSearchFocusChange(focused) {
  isSearchFocused.value = focused
}

// 分析图片亮度
function analyzeImageBrightness(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // 缩小尺寸加快分析
        const size = 50
        canvas.width = size
        canvas.height = size
        
        ctx.drawImage(img, 0, 0, size, size)
        const imageData = ctx.getImageData(0, 0, size, size)
        const data = imageData.data
        
        let totalBrightness = 0
        const pixelCount = data.length / 4
        
        for (let i = 0; i < data.length; i += 4) {
          // 计算亮度 (ITU-R BT.709)
          const brightness = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]
          totalBrightness += brightness
        }
        
        const avgBrightness = totalBrightness / pixelCount
        // 亮度 < 128 认为是深色背景
        resolve(avgBrightness < 128)
      } catch (e) {
        // 跨域或其他错误，默认深色背景
        resolve(true)
      }
    }
    
    img.onerror = () => resolve(true)
    img.src = url
  })
}

// 预加载图片并分析亮度
async function preloadImage(url) {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = url
  })
}

// 初始加载背景
onMounted(async () => {
  if (backgroundUrl.value) {
    await preloadImage(backgroundUrl.value)
    bgA.value = backgroundUrl.value
    showA.value = true
    
    // 分析背景亮度
    isDarkBg.value = await analyzeImageBrightness(backgroundUrl.value)
    
    requestAnimationFrame(() => {
      bgLoaded.value = true
    })
  }
})

// 监听背景变化，使用双层交替
watch(backgroundUrl, async (newUrl) => {
  if (!newUrl || isChanging.value) return
  
  const currentUrl = showA.value ? bgA.value : bgB.value
  if (newUrl === currentUrl) return
  
  isChanging.value = true
  
  // 预加载新图片并分析亮度
  await preloadImage(newUrl)
  isDarkBg.value = await analyzeImageBrightness(newUrl)
  
  // 将新图片设置到隐藏层，然后切换显示
  if (showA.value) {
    bgB.value = newUrl
    showA.value = false
  } else {
    bgA.value = newUrl
    showA.value = true
  }
  
  // 等待过渡完成
  setTimeout(() => {
    isChanging.value = false
  }, 800)
})

// 换壁纸
async function changeWallpaper() {
  if (isLoading.value) return
  isLoading.value = true
  try {
    await fetchWallpaperBySource()
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div 
    class="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 transition-colors duration-500"
    :class="isDarkBg ? 'theme-dark' : 'theme-light'"
  >
    <!-- 背景层 A -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-out"
      :class="[
        bgLoaded && showA ? 'opacity-100' : 'opacity-0',
        isSearchFocused ? 'scale-110' : 'scale-100'
      ]"
      :style="{ backgroundImage: bgA ? `url(${bgA})` : 'none' }"
    />
    
    <!-- 背景层 B -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-500 ease-out"
      :class="[
        bgLoaded && !showA ? 'opacity-100' : 'opacity-0',
        isSearchFocused ? 'scale-110' : 'scale-100'
      ]"
      :style="{ backgroundImage: bgB ? `url(${bgB})` : 'none' }"
    />

    <!-- 背景效果层（聚焦时亮度+模糊） -->
    <div 
      class="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out" 
      :class="isSearchFocused ? 'opacity-100' : 'opacity-0'"
      :style="{
        backdropFilter: `brightness(${backgroundBrightness}%) blur(${backgroundBlur}px)`,
        WebkitBackdropFilter: `brightness(${backgroundBrightness}%) blur(${backgroundBlur}px)`
      }"
    />

    <!-- 主内容 -->
    <div class="relative z-10 w-full flex flex-col items-center py-12 px-4">
      <!-- 时钟 -->
      <Clock v-if="showClock" class="mb-6" />

      <!-- 搜索框 -->
      <SearchBox class="mb-6" @focus-change="handleSearchFocusChange" />

      <!-- 书签网格 -->
      <BookmarkGrid />
    </div>

    <!-- 右上角设置按钮 -->
    <div class="fixed top-4 right-4 z-40">
      <Settings />
    </div>

    <!-- 右下角换壁纸按钮 -->
    <div class="fixed bottom-4 right-4 z-50">
      <Button
        variant="ghost"
        size="icon"
        class="action-btn rounded-full backdrop-blur-md shadow-lg transition-colors"
        :disabled="isLoading"
        @click="changeWallpaper"
        title="换壁纸"
      >
        <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.action-btn {
  background: var(--theme-bg);
  color: var(--theme-text);
  border: 1px solid var(--theme-border);
}

.action-btn:hover {
  background: var(--theme-bg-hover);
}
</style>
