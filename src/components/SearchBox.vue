<script setup>
import { ref, onMounted } from 'vue'
import { Search, ChevronDown } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { searchEngines, currentEngine, getCurrentEngine, doSearch, selectedHitokotoTypes } from '@/stores/settings'

const emit = defineEmits(['focus-change'])

const query = ref('')
const isFocused = ref(false)
const hitokoto = ref('搜索...')

// 备用句子
const fallbackSentences = [
  '搜索或输入网址...',
  '探索无限可能',
  '让每一天都有新发现',
  '简单生活，高效工作',
  '你的专属起始页'
]

// 获取一言
async function fetchHitokoto() {
  try {
    // 构建类型参数
    const types = selectedHitokotoTypes.value
    const typeParams = types && types.length > 0
      ? types.map(t => `c=${t}`).join('&')
      : 'c=a'  // 默认动画类型

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000)

    const response = await fetch(`https://v1.hitokoto.cn?${typeParams}`, {
      signal: controller.signal
    })
    clearTimeout(timeoutId)

    const data = await response.json()
    hitokoto.value = data.hitokoto || fallbackSentences[0]
  } catch {
    hitokoto.value = fallbackSentences[Math.floor(Math.random() * fallbackSentences.length)]
  }
}

onMounted(() => {
  fetchHitokoto()
})

function handleSearch() {
  doSearch(query.value)
  query.value = ''
}

function handleKeydown(e) {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

function handleFocus() {
  isFocused.value = true
  emit('focus-change', true)
}

function handleBlur() {
  isFocused.value = false
  emit('focus-change', false)
}

function selectEngine(engineId) {
  currentEngine.value = engineId
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div 
      class="search-container flex items-center gap-2 backdrop-blur-xl rounded-full shadow-lg px-4 py-2 transition-all duration-300" 
      :class="{ 'search-focused': isFocused }"
      style="background: var(--theme-bg); border: 1px solid var(--theme-border);"
    >
      <!-- 搜索引擎选择 -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm" class="flex items-center gap-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full px-3 transition-colors" style="color: var(--theme-text-secondary);">
            <span class="text-sm font-medium">{{ getCurrentEngine().name }}</span>
            <ChevronDown class="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" class="min-w-[120px]">
          <DropdownMenuItem
            v-for="engine in searchEngines"
            :key="engine.id"
            @click="selectEngine(engine.id)"
            class="cursor-pointer"
          >
            <span :class="currentEngine === engine.id ? 'font-semibold' : ''">
              {{ engine.name }}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- 分隔线 -->
      <div class="w-px h-5 transition-colors" style="background: var(--theme-border);" />

      <!-- 搜索输入框 -->
      <input
        v-model="query"
        type="text"
        :placeholder="hitokoto"
        aria-label="搜索或输入网址"
        role="searchbox"
        class="search-input flex-1 border-0 bg-transparent focus:outline-none focus:ring-0 transition-colors"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <!-- 搜索按钮 -->
      <Button
        variant="ghost"
        size="icon"
        class="rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
        style="color: var(--theme-text-secondary);"
        @click="handleSearch"
      >
        <Search class="w-5 h-5" />
      </Button>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
}

/* 深色背景 - 白色发光 */
:global(.theme-dark) .search-focused {
  box-shadow: 
    0 0 0 2px rgba(255, 255, 255, 0.5),
    0 0 15px rgba(255, 255, 255, 0.3),
    0 0 30px rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.6) !important;
}

/* 浅色背景 - 深色粗边框 */
:global(.theme-light) .search-focused {
  box-shadow: 
    0 0 0 3px rgba(0, 0, 0, 0.5),
    0 4px 12px rgba(0, 0, 0, 0.15);
  border-color: rgba(0, 0, 0, 0.6) !important;
}

.search-input {
  color: var(--theme-text);
}

.search-input::placeholder {
  color: var(--theme-text-muted);
}
</style>
