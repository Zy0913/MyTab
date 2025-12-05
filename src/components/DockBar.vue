<script setup>
import { ref, computed } from 'vue'
import { Grid3X3, Globe } from 'lucide-vue-next'
import { activeGroupBookmarks, getSafeFaviconUrl } from '@/stores/settings'

// Dock 最多显示的书签数量
const maxDockItems = 8

// 获取 Dock 显示的书签
const dockBookmarks = computed(() => {
  return activeGroupBookmarks.value.slice(0, maxDockItems)
})

// 悬停状态
const hoveredIndex = ref(null)

function handleMouseEnter(index) {
  hoveredIndex.value = index
}

function handleMouseLeave() {
  hoveredIndex.value = null
}

// 计算缩放比例（macOS Dock 风格）
function getScale(index) {
  if (hoveredIndex.value === null) return 1
  
  const distance = Math.abs(index - hoveredIndex.value)
  if (distance === 0) return 1.35
  if (distance === 1) return 1.18
  if (distance === 2) return 1.08
  return 1
}

// 计算 Y 轴偏移
function getTranslateY(index) {
  if (hoveredIndex.value === null) return 0
  
  const distance = Math.abs(index - hoveredIndex.value)
  if (distance === 0) return -8
  if (distance === 1) return -4
  if (distance === 2) return -2
  return 0
}

// 获取书签图标
function getBookmarkIcon(bookmark) {
  if (bookmark.icon && !bookmark.icon.includes('gstatic.com')) {
    return bookmark.icon
  }
  return getSafeFaviconUrl(bookmark.url)
}

// 打开书签
function openBookmark(url) {
  window.open(url, '_self')
}

// 显示更多应用
const emit = defineEmits(['show-all'])
</script>

<template>
  <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
    <div 
      class="flex items-end gap-1 px-3 py-2 bg-white/15 backdrop-blur-2xl rounded-2xl border border-white/20 shadow-2xl"
      @mouseleave="handleMouseLeave"
    >
      <!-- Dock 书签项 -->
      <div
        v-for="(bookmark, index) in dockBookmarks"
        :key="bookmark.id"
        class="relative flex flex-col items-center cursor-pointer group"
        @mouseenter="handleMouseEnter(index)"
        @click="openBookmark(bookmark.url)"
      >
        <!-- 图标容器 -->
        <div 
          class="w-12 h-12 rounded-xl flex items-center justify-center bg-white/20 backdrop-blur-md shadow-lg transition-all duration-200 ease-out"
          :style="{
            transform: `scale(${getScale(index)}) translateY(${getTranslateY(index)}px)`,
            transformOrigin: 'bottom center'
          }"
        >
          <img
            v-if="getBookmarkIcon(bookmark)"
            :src="getBookmarkIcon(bookmark)"
            :alt="bookmark.title"
            class="w-8 h-8 object-contain rounded-lg"
            @error="$event.target.style.display = 'none'"
          />
          <Globe v-else class="w-6 h-6 text-white/70" />
        </div>

        <!-- Tooltip -->
        <div 
          v-if="hoveredIndex === index"
          class="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white/90 backdrop-blur-md text-gray-800 text-xs font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none tooltip-arrow"
        >
          {{ bookmark.title }}
        </div>

        <!-- 激活指示点 -->
        <div 
          class="w-1 h-1 rounded-full bg-white/60 mt-1 transition-opacity duration-200"
          :class="hoveredIndex === index ? 'opacity-100' : 'opacity-0'"
        />
      </div>

      <!-- 分隔线 -->
      <div 
        v-if="dockBookmarks.length > 0"
        class="w-px h-10 bg-white/20 mx-1"
      />

      <!-- 更多应用按钮 -->
      <div
        class="relative flex flex-col items-center cursor-pointer"
        @mouseenter="handleMouseEnter(dockBookmarks.length)"
        @click="$emit('show-all')"
      >
        <div 
          class="w-12 h-12 rounded-xl flex items-center justify-center bg-white/10 backdrop-blur-md transition-all duration-200 ease-out"
          :style="{
            transform: `scale(${getScale(dockBookmarks.length)}) translateY(${getTranslateY(dockBookmarks.length)}px)`,
            transformOrigin: 'bottom center'
          }"
        >
          <Grid3X3 class="w-6 h-6 text-white/70" />
        </div>

        <!-- Tooltip -->
        <div 
          v-if="hoveredIndex === dockBookmarks.length"
          class="absolute -top-10 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-white/90 backdrop-blur-md text-gray-800 text-xs font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none tooltip-arrow"
        >
          更多应用
        </div>
      </div>
    </div>
  </div>
</template>
