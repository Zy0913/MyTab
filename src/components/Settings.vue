<script setup>
import { ref, computed } from 'vue'
import { Settings as SettingsIcon, Image, Clock, Check, Import, Bookmark, X, RefreshCw, Loader2, Download, Upload, Database, CloudSun } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer } from '@/components/ui/drawer'
import ImportBookmarks from '@/components/ImportBookmarks.vue'
import Toast from '@/components/Toast.vue'
import {
  backgroundUrl,
  defaultBackgrounds,
  wallpaperCategories,
  wallpaperSources,
  wallpaperSource,
  showClock,
  showSeconds,
  use24Hour,
  backgroundBrightness,
  backgroundBlur,
  hitokotoTypes,
  selectedHitokotoTypes,
  getWallpapersByCategory,
  fetchWallpaperBySource,
  exportConfig,
  importConfig,
  showWeather,
  weatherCity,
  weatherUnit
} from '@/stores/settings'

const showDrawer = ref(false)
const customBgUrl = ref('')
const activeCategory = ref('all')
const importBookmarksRef = ref(null)
const loadingWallpaper = ref(false)
const fileInputRef = ref(null)

// Toast 状态
const showToast = ref(false)
const toastData = ref({ title: '', message: '' })

// 根据分类筛选壁纸
const filteredWallpapers = computed(() => {
  return getWallpapersByCategory(activeCategory.value)
})

// 是否显示本地壁纸网格
const showLocalGrid = computed(() => wallpaperSource.value === 'local')

function selectBackground(url) {
  backgroundUrl.value = url
}

function applyCustomBg() {
  if (customBgUrl.value.trim()) {
    backgroundUrl.value = customBgUrl.value.trim()
    customBgUrl.value = ''
  }
}

async function handleRandomWallpaper() {
  loadingWallpaper.value = true
  try {
    await fetchWallpaperBySource(activeCategory.value === 'all' ? 'nature' : activeCategory.value)
  } finally {
    loadingWallpaper.value = false
  }
}

function toggleClock() {
  showClock.value = !showClock.value
}

function toggleSeconds() {
  showSeconds.value = !showSeconds.value
}

function toggle24Hour() {
  use24Hour.value = !use24Hour.value
}

// 天气设置
function toggleWeather() {
  showWeather.value = !showWeather.value
}

function toggleWeatherUnit() {
  weatherUnit.value = weatherUnit.value === 'C' ? 'F' : 'C'
}

// 切换一言类型
function toggleHitokotoType(typeId) {
  const index = selectedHitokotoTypes.value.indexOf(typeId)
  if (index > -1) {
    // 至少保留一个类型
    if (selectedHitokotoTypes.value.length > 1) {
      selectedHitokotoTypes.value.splice(index, 1)
    }
  } else {
    selectedHitokotoTypes.value.push(typeId)
  }
}

// 导出配置
function handleExport() {
  exportConfig()
  toastData.value = { title: '导出成功', message: '配置文件已下载' }
  showToast.value = true
}

// 触发导入文件选择
function triggerImport() {
  fileInputRef.value?.click()
}

// 处理导入
async function handleImport(event) {
  const file = event.target.files?.[0]
  if (!file) return
  
  try {
    const result = await importConfig(file)
    toastData.value = { title: '导入成功', message: result.message }
    showToast.value = true
  } catch (err) {
    toastData.value = { title: '导入失败', message: err.message }
    showToast.value = true
  }
  
  // 清空文件输入
  event.target.value = ''
}
</script>

<template>
  <!-- 设置按钮（由 App.vue 中的按钮组控制位置） -->
  <Button
    variant="ghost"
    size="icon"
    class="settings-btn rounded-full backdrop-blur-md shadow-lg transition-colors"
    @click="showDrawer = true"
    title="设置"
  >
    <SettingsIcon class="w-5 h-5" />
  </Button>

  <!-- 设置抽屉 -->
  <Drawer v-model:open="showDrawer">
    <template #default="{ close }">
      <!-- 头部 -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
        <h2 class="text-sm font-semibold flex items-center gap-2">
          <SettingsIcon class="w-4 h-4" />
          设置
        </h2>
        <Button variant="ghost" size="icon" @click="close" class="rounded-full w-7 h-7 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X class="w-4 h-4" />
        </Button>
      </div>

      <!-- 内容区域 -->
      <div class="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        <!-- 背景设置 -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-semibold flex items-center gap-2">
              <Image class="w-4 h-4" />
              背景图片
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              @click="handleRandomWallpaper" 
              :disabled="loadingWallpaper"
              class="gap-1.5"
            >
              <Loader2 v-if="loadingWallpaper" class="w-3.5 h-3.5 animate-spin" />
              <RefreshCw v-else class="w-3.5 h-3.5" />
              换一张
            </Button>
          </div>

          <!-- 壁纸源选择 -->
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="source in wallpaperSources"
              :key="source.id"
              class="px-3 py-1 text-xs rounded-full transition-colors"
              :class="wallpaperSource === source.id 
                ? 'bg-primary text-white' 
                : 'bg-secondary hover:bg-secondary/80'"
              @click="wallpaperSource = source.id"
              :title="source.description"
            >
              {{ source.name }}
            </button>
          </div>

          <!-- 分类选择（仅本地和 Unsplash 显示） -->
          <div v-if="wallpaperSource === 'local' || wallpaperSource === 'unsplash'" class="flex flex-wrap gap-1">
            <button
              v-for="cat in wallpaperCategories"
              :key="cat.id"
              class="px-2 py-0.5 text-[10px] rounded-full transition-colors"
              :class="activeCategory === cat.id 
                ? 'bg-primary/80 text-white' 
                : 'bg-secondary/60 hover:bg-secondary'"
              @click="activeCategory = cat.id"
            >
              {{ cat.name }}
            </button>
          </div>

          <!-- 壁纸网格（仅本地精选显示） -->
          <div v-if="showLocalGrid" class="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto pr-1">
            <div
              v-for="bg in filteredWallpapers"
              :key="bg.id"
              class="relative aspect-video rounded-md overflow-hidden cursor-pointer ring-2 ring-transparent hover:ring-primary/50 transition-all"
              :class="{ 'ring-primary': backgroundUrl === bg.url }"
              @click="selectBackground(bg.url)"
            >
              <img :src="bg.url" class="w-full h-full object-cover" loading="lazy" />
              <div
                v-if="backgroundUrl === bg.url"
                class="absolute inset-0 bg-primary/30 flex items-center justify-center"
              >
                <Check class="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          <!-- API 壁纸源提示 -->
          <div v-else class="text-center py-6 text-muted-foreground">
            <p class="text-xs mb-2">点击「换一张」获取随机壁纸</p>
            <p class="text-[10px] opacity-60">
              {{ wallpaperSources.find(s => s.id === wallpaperSource)?.description }}
            </p>
          </div>

          <!-- 自定义背景 -->
          <div class="flex gap-2">
            <Input
              v-model="customBgUrl"
              placeholder="输入 Unsplash 或其他图片 URL..."
              class="flex-1"
            />
            <Button @click="applyCustomBg" :disabled="!customBgUrl.trim()">
              应用
            </Button>
          </div>

          <p class="text-xs text-muted-foreground">
            壁纸来源：<a href="https://unsplash.com" target="_blank" class="text-primary hover:underline">Unsplash</a>（免费高质量图片）
          </p>

          <!-- 聚焦时亮度设置 -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">聚焦时亮度</span>
              <span class="text-xs text-muted-foreground">{{ backgroundBrightness }}%</span>
            </div>
            <input
              type="range"
              :value="backgroundBrightness"
              @input="backgroundBrightness = Number($event.target.value)"
              min="30"
              max="100"
              step="5"
              class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p class="text-[10px] text-muted-foreground">点击搜索框时背景变暗程度</p>
          </div>

          <!-- 聚焦时模糊设置 -->
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">聚焦时磨砂</span>
              <span class="text-xs text-muted-foreground">{{ backgroundBlur }}px</span>
            </div>
            <input
              type="range"
              :value="backgroundBlur"
              @input="backgroundBlur = Number($event.target.value)"
              min="0"
              max="20"
              step="1"
              class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <p class="text-[10px] text-muted-foreground">点击搜索框时背景模糊程度</p>
          </div>
        </div>

        <!-- 时钟设置 -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold flex items-center gap-2">
            <Clock class="w-4 h-4" />
            时钟设置
          </h3>

          <div class="space-y-2">
            <div
              class="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
              @click="toggleClock"
            >
              <span class="text-sm">显示时钟</span>
              <div
                class="w-10 h-6 rounded-full transition-colors flex items-center px-1"
                :class="showClock ? 'bg-primary' : 'bg-gray-300'"
              >
                <div
                  class="w-4 h-4 rounded-full bg-white shadow transition-transform"
                  :class="showClock ? 'translate-x-4' : 'translate-x-0'"
                />
              </div>
            </div>

            <div
              class="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
              :class="{ 'opacity-50 pointer-events-none': !showClock }"
              @click="toggleSeconds"
            >
              <span class="text-sm">显示秒钟</span>
              <div
                class="w-10 h-6 rounded-full transition-colors flex items-center px-1"
                :class="showSeconds ? 'bg-primary' : 'bg-gray-300'"
              >
                <div
                  class="w-4 h-4 rounded-full bg-white shadow transition-transform"
                  :class="showSeconds ? 'translate-x-4' : 'translate-x-0'"
                />
              </div>
            </div>

            <div
              class="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
              :class="{ 'opacity-50 pointer-events-none': !showClock }"
              @click="toggle24Hour"
            >
              <span class="text-sm">24 小时制</span>
              <div
                class="w-10 h-6 rounded-full transition-colors flex items-center px-1"
                :class="use24Hour ? 'bg-primary' : 'bg-gray-300'"
              >
                <div
                  class="w-4 h-4 rounded-full bg-white shadow transition-transform"
                  :class="use24Hour ? 'translate-x-4' : 'translate-x-0'"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 天气设置 -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold flex items-center gap-2">
            <CloudSun class="w-4 h-4" />
            天气设置
          </h3>

          <div class="space-y-2">
            <div
              class="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
              @click="toggleWeather"
            >
              <span class="text-sm">显示天气</span>
              <div
                class="w-10 h-6 rounded-full transition-colors flex items-center px-1"
                :class="showWeather ? 'bg-primary' : 'bg-gray-300'"
              >
                <div
                  class="w-4 h-4 rounded-full bg-white shadow transition-transform"
                  :class="showWeather ? 'translate-x-4' : 'translate-x-0'"
                />
              </div>
            </div>

            <div
              class="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
              :class="{ 'opacity-50 pointer-events-none': !showWeather }"
              @click="toggleWeatherUnit"
            >
              <span class="text-sm">温度单位</span>
              <div class="flex items-center gap-2">
                <span class="text-xs" :class="weatherUnit === 'C' ? 'text-primary font-semibold' : 'text-muted-foreground'">°C</span>
                <span class="text-xs text-muted-foreground">/</span>
                <span class="text-xs" :class="weatherUnit === 'F' ? 'text-primary font-semibold' : 'text-muted-foreground'">°F</span>
              </div>
            </div>

            <div
              class="p-3 rounded-lg bg-secondary/50"
              :class="{ 'opacity-50 pointer-events-none': !showWeather }"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm">城市</span>
              </div>
              <Input
                v-model="weatherCity"
                placeholder="留空自动定位（如：Shanghai）"
                class="h-8 text-sm"
              />
            </div>
          </div>
        </div>

        <!-- 一言设置 -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold flex items-center gap-2">
            <span class="w-4 h-4 text-center">💬</span>
            搜索框一言
          </h3>
          <p class="text-[10px] text-muted-foreground -mt-1">选择搜索框随机显示的句子类型</p>
          
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="type in hitokotoTypes"
              :key="type.id"
              class="px-2.5 py-1 text-xs rounded-full transition-colors"
              :class="selectedHitokotoTypes.includes(type.id) 
                ? 'bg-primary text-white' 
                : 'bg-secondary hover:bg-secondary/80'"
              @click="toggleHitokotoType(type.id)"
            >
              {{ type.name }}
            </button>
          </div>
        </div>

        <!-- 书签管理 -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold flex items-center gap-2">
            <Bookmark class="w-4 h-4" />
            书签管理
          </h3>

          <div
            class="flex items-center justify-between p-3 rounded-lg bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors"
            @click="importBookmarksRef?.openDialog()"
          >
            <div class="flex items-center gap-2">
              <Import class="w-4 h-4" />
              <span class="text-sm">从浏览器收藏夹导入</span>
            </div>
            <span class="text-xs text-muted-foreground">点击打开</span>
          </div>
        </div>

        <!-- 数据管理 -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold flex items-center gap-2">
            <Database class="w-4 h-4" />
            数据管理
          </h3>

          <div class="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              class="flex-1 gap-1.5"
              @click="handleExport"
            >
              <Download class="w-3.5 h-3.5" />
              导出配置
            </Button>
            <Button
              variant="outline"
              size="sm"
              class="flex-1 gap-1.5"
              @click="triggerImport"
            >
              <Upload class="w-3.5 h-3.5" />
              导入配置
            </Button>
          </div>
          <p class="text-[10px] text-muted-foreground">
            导出配置文件可在其他浏览器导入，同步书签、分组和设置
          </p>
        </div>
      </div>
    </template>
  </Drawer>

  <!-- 隐藏的文件输入 -->
  <input
    ref="fileInputRef"
    type="file"
    accept=".json"
    class="hidden"
    @change="handleImport"
  />

  <!-- 导入书签抽屉 -->
  <ImportBookmarks ref="importBookmarksRef" />

  <!-- Toast 通知 -->
  <Toast
    :show="showToast"
    :title="toastData.title"
    :message="toastData.message"
    @close="showToast = false"
  />
</template>

<style scoped>
.settings-btn {
  background: var(--theme-bg);
  color: var(--theme-text);
  border: 1px solid var(--theme-border);
}

.settings-btn:hover {
  background: var(--theme-bg-hover);
}
</style>
