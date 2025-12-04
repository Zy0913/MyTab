<script setup>
import { ref, watch, onMounted } from 'vue'
import { RefreshCw } from 'lucide-vue-next'
import Clock from './components/Clock.vue'
import SearchBox from './components/SearchBox.vue'
import BookmarkGrid from './components/BookmarkGrid.vue'
import Settings from './components/Settings.vue'
import { Button } from './components/ui/button'
import { backgroundUrl, showClock, fetchWallpaperBySource } from './stores/settings'

// 背景加载状态
const bgLoaded = ref(false)
const currentBg = ref('')
const nextBg = ref('')
const isTransitioning = ref(false)
const isLoading = ref(false)

// 预加载图片
function preloadImage(url) {
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
    currentBg.value = backgroundUrl.value
    // 延迟显示，确保平滑淡入
    requestAnimationFrame(() => {
      bgLoaded.value = true
    })
  }
})

// 监听背景变化，触发过渡动画
watch(backgroundUrl, async (newUrl) => {
  if (newUrl && newUrl !== currentBg.value && !isTransitioning.value) {
    isTransitioning.value = true
    nextBg.value = newUrl
    // 过渡完成后更新当前背景
    setTimeout(() => {
      currentBg.value = newUrl
      isTransitioning.value = false
      nextBg.value = ''
    }, 700)
  }
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
  <div class="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900">
    <!-- 当前背景 -->
    <div
      class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
      :class="bgLoaded ? 'opacity-100' : 'opacity-0'"
      :style="{ backgroundImage: currentBg ? `url(${currentBg})` : 'none' }"
    />
    
    <!-- 下一个背景（用于淡入过渡） -->
    <div
      v-if="nextBg"
      class="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
      :class="isTransitioning ? 'opacity-100' : 'opacity-0'"
      :style="{ backgroundImage: `url(${nextBg})` }"
    />

    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black/20 transition-opacity duration-500" :class="bgLoaded ? 'opacity-100' : 'opacity-0'" />

    <!-- 主内容 -->
    <div class="relative z-10 w-full flex flex-col items-center py-12 px-4">
      <!-- 时钟 -->
      <Clock v-if="showClock" class="mb-6" />

      <!-- 搜索框 -->
      <SearchBox class="mb-6" />

      <!-- 书签网格 -->
      <BookmarkGrid />
    </div>

    <!-- 底部按钮组 -->
    <div class="fixed bottom-4 right-4 flex items-center gap-2 z-50">
      <!-- 换壁纸按钮 -->
      <Button
        variant="ghost"
        size="icon"
        class="rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white/30 shadow-lg"
        :disabled="isLoading"
        @click="changeWallpaper"
        title="换壁纸"
      >
        <RefreshCw class="w-5 h-5" :class="{ 'animate-spin': isLoading }" />
      </Button>
      
      <!-- 设置按钮 -->
      <Settings />
    </div>
  </div>
</template>

<style scoped>
</style>
