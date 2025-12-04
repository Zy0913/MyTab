<script setup>
import { ref } from 'vue'
import { Search, ChevronDown } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import { searchEngines, currentEngine, getCurrentEngine, doSearch } from '@/stores/settings'

const query = ref('')

function handleSearch() {
  doSearch(query.value)
}

function handleKeydown(e) {
  if (e.key === 'Enter') {
    handleSearch()
  }
}

function selectEngine(engineId) {
  currentEngine.value = engineId
}
</script>

<template>
  <div class="w-full max-w-2xl mx-auto">
    <div class="flex items-center gap-2 bg-white/15 backdrop-blur-xl rounded-full shadow-lg px-4 py-2 border border-white/20">
      <!-- 搜索引擎选择 -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="ghost" size="sm" class="flex items-center gap-1 text-white/90 hover:bg-white/10 rounded-full px-3">
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
            <span :class="currentEngine === engine.id ? 'font-semibold text-white' : 'text-white/80'">
              {{ engine.name }}
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- 分隔线 -->
      <div class="w-px h-5 bg-white/30" />

      <!-- 搜索输入框 -->
      <Input
        v-model="query"
        type="text"
        placeholder="搜索..."
        class="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-white placeholder:text-white/50"
        @keydown="handleKeydown"
      />

      <!-- 搜索按钮 -->
      <Button
        variant="ghost"
        size="icon"
        class="rounded-full text-white/80 hover:text-white hover:bg-white/10"
        @click="handleSearch"
      >
        <Search class="w-5 h-5" />
      </Button>
    </div>
  </div>
</template>
