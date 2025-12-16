<script setup>
import { ref, onMounted, computed } from 'vue'
import { Import, Search, Check, FolderOpen, Folder, Globe, AlertCircle, X, ChevronDown, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Drawer } from '@/components/ui/drawer'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import Toast from '@/components/Toast.vue'
import {
  groups,
  activeGroupId,
  isExtensionEnv,
  getFlatBrowserBookmarks,
  importBrowserBookmarks
} from '@/stores/settings'

const showDrawer = ref(false)
const loading = ref(false)
const browserBookmarks = ref([])
const selectedBookmarks = ref([])
const searchQuery = ref('')
const targetGroup = ref('default')
const expandedFolders = ref([])

// Toast 通知状态
const showToast = ref(false)
const toastData = ref({ title: '', message: '' })

// 是否在扩展环境
const isExtension = computed(() => isExtensionEnv())

// 当前选中的分组名称
const selectedGroupName = computed(() => {
  const group = groups.value.find(g => g.id === targetGroup.value)
  return group?.name || '常用'
})

// 获取 favicon URL
function getFaviconUrl(url) {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname
    
    // 跳过本地/内网地址
    if (
      hostname === 'localhost' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./) ||
      hostname.match(/^\d+\.\d+\.\d+\.\d+$/) // 其他 IP 地址
    ) {
      return ''
    }
    
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`
  } catch {
    return ''
  }
}

// 过滤后的书签
const filteredBookmarks = computed(() => {
  if (!searchQuery.value.trim()) {
    return browserBookmarks.value
  }
  const query = searchQuery.value.toLowerCase()
  return browserBookmarks.value.filter(
    (bm) =>
      bm.title.toLowerCase().includes(query) ||
      bm.url.toLowerCase().includes(query) ||
      bm.folder.toLowerCase().includes(query)
  )
})

// 按文件夹分组
const groupedBookmarks = computed(() => {
  const groups = {}
  for (const bm of filteredBookmarks.value) {
    const folder = bm.folder || '其他'
    if (!groups[folder]) {
      groups[folder] = []
    }
    groups[folder].push(bm)
  }
  return groups
})

// 打开抽屉
async function openDialog() {
  showDrawer.value = true
  selectedBookmarks.value = []
  expandedFolders.value = []
  targetGroup.value = activeGroupId.value

  if (isExtension.value) {
    await loadBookmarks()
    // 默认展开第一个文件夹
    const folders = Object.keys(groupedBookmarks.value)
    if (folders.length > 0) {
      expandedFolders.value.push(folders[0])
    }
  }
}

// 切换文件夹展开状态
function toggleFolder(folder) {
  const index = expandedFolders.value.indexOf(folder)
  if (index > -1) {
    expandedFolders.value.splice(index, 1)
  } else {
    expandedFolders.value.push(folder)
  }
}

// 展开全部
function expandAll() {
  expandedFolders.value = Object.keys(groupedBookmarks.value)
}

// 收起全部
function collapseAll() {
  expandedFolders.value = []
}

// 加载浏览器书签
async function loadBookmarks() {
  loading.value = true
  try {
    browserBookmarks.value = await getFlatBrowserBookmarks()
  } catch (e) {
    console.error('Failed to load bookmarks:', e)
  } finally {
    loading.value = false
  }
}

// 切换选中状态
function toggleSelect(bookmark) {
  const index = selectedBookmarks.value.indexOf(bookmark.id)
  if (index > -1) {
    selectedBookmarks.value.splice(index, 1)
  } else {
    selectedBookmarks.value.push(bookmark.id)
  }
}

// 全选/取消全选当前筛选结果
function toggleSelectAll() {
  const allSelected = filteredBookmarks.value.every((bm) =>
    selectedBookmarks.value.includes(bm.id)
  )

  if (allSelected) {
    // 取消全选
    for (const bm of filteredBookmarks.value) {
      const index = selectedBookmarks.value.indexOf(bm.id)
      if (index > -1) selectedBookmarks.value.splice(index, 1)
    }
  } else {
    // 全选
    for (const bm of filteredBookmarks.value) {
      if (!selectedBookmarks.value.includes(bm.id)) {
        selectedBookmarks.value.push(bm.id)
      }
    }
  }
}

// 导入选中的书签
async function handleImport() {
  const selected = browserBookmarks.value.filter((bm) =>
    selectedBookmarks.value.includes(bm.id)
  )

  if (selected.length === 0) return

  loading.value = true
  try {
    const imported = await importBrowserBookmarks(selected, targetGroup.value)
    const skipped = selected.length - imported.length

    // 显示 toast 通知
    toastData.value = {
      title: '导入成功',
      message: `已导入 ${imported.length} 个书签${skipped > 0 ? `，跳过 ${skipped} 个重复` : ''}`
    }
    showToast.value = true

    selectedBookmarks.value = []
    // 关闭抽屉
    showDrawer.value = false
  } catch (e) {
    toastData.value = { title: '导入失败', message: e.message }
    showToast.value = true
  } finally {
    loading.value = false
  }
}

// 暴露打开方法
defineExpose({ openDialog })
</script>

<template>
  <Drawer v-model:open="showDrawer">
    <template #default="{ close }">
      <!-- 头部 -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <h2 class="text-base font-semibold flex items-center gap-2">
          <Import class="w-4 h-4" />
          导入收藏夹
        </h2>
        <Button variant="ghost" size="icon" @click="close" class="rounded-full w-8 h-8">
          <X class="w-4 h-4" />
        </Button>
      </div>

      <!-- 非扩展环境提示 -->
      <div v-if="!isExtension" class="flex-1 flex flex-col items-center justify-center py-12 text-center px-6">
        <AlertCircle class="w-12 h-12 text-amber-500 mb-4" />
        <h3 class="text-lg font-medium mb-2">需要安装为浏览器扩展</h3>
        <p class="text-sm text-muted-foreground max-w-sm">
          此功能需要在浏览器扩展环境中运行。
        </p>
        <div class="mt-4 text-xs text-muted-foreground space-y-1">
          <p>1. 运行 <code class="bg-muted px-1 rounded">npm run build</code></p>
          <p>2. 打开 chrome://extensions/</p>
          <p>3. 开启「开发者模式」</p>
          <p>4. 加载已解压的扩展程序</p>
        </div>
      </div>

      <!-- 扩展环境内容 -->
      <div v-else class="flex-1 flex flex-col overflow-hidden">
        <div class="flex-1 overflow-y-auto px-4 py-3">
          <!-- 搜索和选择目标分组 -->
          <div class="flex gap-3 mb-4">
            <div class="relative flex-1">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                v-model="searchQuery"
                placeholder="搜索书签..."
                class="pl-9 bg-secondary/50 border-0"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="outline" size="sm" class="gap-1.5 bg-secondary/50 border-border/30 hover:bg-secondary/80">
                  {{ selectedGroupName }}
                  <ChevronDown class="w-3.5 h-3.5 opacity-60" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" class="min-w-[100px]">
                <DropdownMenuItem
                  v-for="g in groups"
                  :key="g.id"
                  @click="targetGroup = g.id"
                  class="cursor-pointer flex items-center justify-between gap-2"
                >
                  {{ g.name }}
                  <Check v-if="targetGroup === g.id" class="w-3.5 h-3.5 text-primary" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        <!-- 统计和操作 -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium">
              {{ loading ? '加载中...' : `${filteredBookmarks.length} 个书签` }}
            </span>
            <span v-if="selectedBookmarks.length > 0" class="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
              已选 {{ selectedBookmarks.length }}
            </span>
          </div>
          <div class="flex items-center gap-1">
            <Button variant="ghost" size="sm" @click="expandAll" :disabled="loading" class="text-[10px] px-2 h-6">
              展开
            </Button>
            <Button variant="ghost" size="sm" @click="collapseAll" :disabled="loading" class="text-[10px] px-2 h-6">
              收起
            </Button>
            <Button variant="ghost" size="sm" @click="toggleSelectAll" :disabled="loading" class="text-[10px] px-2 h-6">
              {{ filteredBookmarks.every(bm => selectedBookmarks.includes(bm.id)) ? '取消全选' : '全选' }}
            </Button>
          </div>
        </div>

        <!-- 书签列表 -->
        <div class="flex-1 overflow-y-auto bg-secondary/20 rounded-lg">
          <div v-if="loading" class="flex items-center justify-center h-full py-12">
            <div class="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          </div>
          
          <div v-else-if="browserBookmarks.length === 0" class="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
            <FolderOpen class="w-12 h-12 mb-3 opacity-50" />
            <p class="text-sm">没有找到书签</p>
          </div>

          <div v-else class="p-1.5">
            <div v-for="(bookmarks, folder) in groupedBookmarks" :key="folder" class="mb-1">
              <!-- 文件夹标题（可点击展开收起） -->
              <div 
                class="flex items-center gap-1.5 px-2 py-1.5 rounded-md cursor-pointer hover:bg-secondary/50 transition-colors"
                @click="toggleFolder(folder)"
              >
                <ChevronRight
                  class="w-3 h-3 text-muted-foreground transition-transform"
                  :class="{ 'rotate-90': expandedFolders.includes(folder) }"
                />
                <Folder v-if="!expandedFolders.includes(folder)" class="w-3.5 h-3.5 text-amber-500" />
                <FolderOpen v-else class="w-3.5 h-3.5 text-amber-500" />
                <span class="text-xs font-medium flex-1">{{ folder }}</span>
                <span class="text-[10px] text-muted-foreground">({{ bookmarks.length }})</span>
              </div>
              
              <!-- 书签项（展开时显示） -->
              <div v-if="expandedFolders.includes(folder)" class="ml-3 border-l border-border/30 pl-2 mt-0.5">
                <div
                  v-for="bookmark in bookmarks"
                  :key="bookmark.id"
                  class="flex items-center gap-2 px-2 py-1 rounded-md cursor-pointer transition-all"
                  :class="selectedBookmarks.includes(bookmark.id)
                    ? 'bg-primary/10'
                    : 'hover:bg-secondary/60'"
                  @click="toggleSelect(bookmark)"
                >
                  <!-- 选中状态 -->
                  <div
                    class="w-4 h-4 rounded flex items-center justify-center transition-all shrink-0"
                    :class="selectedBookmarks.includes(bookmark.id)
                      ? 'bg-primary text-white'
                      : 'bg-secondary/80 border border-border/50'"
                  >
                    <Check v-if="selectedBookmarks.includes(bookmark.id)" class="w-2.5 h-2.5" />
                  </div>
                  
                  <!-- 图标 -->
                  <div class="w-5 h-5 rounded bg-white/80 flex items-center justify-center shrink-0">
                    <img
                      v-if="getFaviconUrl(bookmark.url)"
                      :src="getFaviconUrl(bookmark.url)"
                      class="w-4 h-4"
                      @error="$event.target.style.display = 'none'"
                    />
                    <Globe v-else class="w-3 h-3 text-muted-foreground" />
                  </div>
                  
                  <!-- 标题 -->
                  <div class="flex-1 min-w-0">
                    <p class="text-xs truncate">{{ bookmark.title || '无标题' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- 底部操作栏 -->
        <div class="px-4 py-3 border-t border-white/10 flex items-center justify-end gap-2 shrink-0">
          <Button variant="ghost" size="sm" @click="showDrawer = false">取消</Button>
          <Button
            size="sm"
            @click="handleImport"
            :disabled="selectedBookmarks.length === 0 || loading"
            class="gap-1.5"
          >
            <Import class="w-3.5 h-3.5" />
            导入{{ selectedBookmarks.length > 0 ? ` ${selectedBookmarks.length} 项` : '' }}
          </Button>
        </div>
      </div>
    </template>
  </Drawer>

  <!-- Toast 通知 -->
  <Toast
    :show="showToast"
    :title="toastData.title"
    :message="toastData.message"
    @close="showToast = false"
  />
</template>
