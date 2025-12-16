<script setup>
import { ref, computed } from 'vue'
import { Plus, Pencil, Trash2, Globe, MoreVertical, MoreHorizontal, FolderPlus } from 'lucide-vue-next'
import DynamicIcon from '@/components/DynamicIcon.vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import {
  groups,
  activeGroupId,
  activeGroupBookmarks,
  availableIcons,
  addBookmark,
  removeBookmark,
  updateBookmark,
  addGroup,
  removeGroup,
  updateGroup,
  moveBookmarkToGroup,
  getSafeFaviconUrl
} from '@/stores/settings'

// 获取书签的安全图标 URL
function getBookmarkIcon(bookmark) {
  // 如果有自定义图标且不是 gstatic 的（可能 404）
  if (bookmark.icon && !bookmark.icon.includes('gstatic.com')) {
    return bookmark.icon
  }
  // 否则重新生成安全的 favicon URL
  return getSafeFaviconUrl(bookmark.url)
}

// 书签弹窗
const showBookmarkDialog = ref(false)
const editBookmarkMode = ref(false)
const currentBookmark = ref(null)
const bookmarkForm = ref({ title: '', url: '', icon: '' })

// 分组弹窗
const showGroupDialog = ref(false)
const editGroupMode = ref(false)
const currentGroup = ref(null)
const groupForm = ref({ name: '', icon: 'Folder' })

// 跟踪图标加载失败的书签
const failedIcons = ref(new Set())

// 处理图标加载错误
function handleIconError(bookmarkId) {
  failedIcons.value = new Set([...failedIcons.value, bookmarkId])
}

// 切换分组
function switchGroup(groupId) {
  activeGroupId.value = groupId
}

// 打开添加书签弹窗
function openAddBookmarkDialog() {
  editBookmarkMode.value = false
  bookmarkForm.value = { title: '', url: '', icon: '' }
  showBookmarkDialog.value = true
}

// 打开编辑书签弹窗
function openEditBookmarkDialog(bookmark) {
  editBookmarkMode.value = true
  currentBookmark.value = bookmark
  bookmarkForm.value = { ...bookmark }
  showBookmarkDialog.value = true
}

// 提交书签
function handleBookmarkSubmit() {
  if (!bookmarkForm.value.title || !bookmarkForm.value.url) return

  let url = bookmarkForm.value.url
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  let icon = bookmarkForm.value.icon
  if (!icon) {
    try {
      const urlObj = new URL(url)
      icon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
    } catch {
      icon = ''
    }
  }

  if (editBookmarkMode.value && currentBookmark.value) {
    updateBookmark(currentBookmark.value.id, { ...bookmarkForm.value, url, icon })
  } else {
    addBookmark({ ...bookmarkForm.value, url, icon, groupId: activeGroupId.value })
  }

  showBookmarkDialog.value = false
}

// 删除书签
function handleDeleteBookmark(id) {
  removeBookmark(id)
}

// 打开书签
function openBookmark(url) {
  window.open(url, '_self')
}

// 键盘导航处理
function handleBookmarkKeydown(event, bookmark) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openBookmark(bookmark.url)
  }
}

// 打开添加分组弹窗
function openAddGroupDialog() {
  editGroupMode.value = false
  groupForm.value = { name: '', icon: '📁' }
  showGroupDialog.value = true
}

// 打开编辑分组弹窗
function openEditGroupDialog(group) {
  editGroupMode.value = true
  currentGroup.value = group
  groupForm.value = { ...group }
  showGroupDialog.value = true
}

// 提交分组
function handleGroupSubmit() {
  if (!groupForm.value.name) return

  if (editGroupMode.value && currentGroup.value) {
    updateGroup(currentGroup.value.id, groupForm.value)
  } else {
    addGroup(groupForm.value)
  }

  showGroupDialog.value = false
}

// 删除分组
function handleDeleteGroup(id) {
  removeGroup(id)
}

// 移动书签到分组
function handleMoveBookmark(bookmarkId, groupId) {
  moveBookmarkToGroup(bookmarkId, groupId)
}

// Dock 风格放大效果
const hoveredIndex = ref(null)

function handleMouseEnter(index) {
  hoveredIndex.value = index
}

function handleMouseLeave() {
  hoveredIndex.value = null
}

// 计算书签项的缩放比例（Dock 风格）
function getBookmarkScale(index) {
  if (hoveredIndex.value === null) return 1
  
  const distance = Math.abs(index - hoveredIndex.value)
  if (distance === 0) return 1.15  // 悬停项
  if (distance === 1) return 1.08  // 相邻项
  if (distance === 2) return 1.03  // 次相邻
  return 1
}

// 计算 Y 轴偏移（悬停时上浮）
function getBookmarkTranslateY(index) {
  if (hoveredIndex.value === null) return 0
  
  const distance = Math.abs(index - hoveredIndex.value)
  if (distance === 0) return -4
  if (distance === 1) return -2
  return 0
}
</script>

<template>
  <div class="w-full max-w-4xl mx-auto">
    <!-- 分组标签页 -->
    <Tabs :model-value="activeGroupId" @update:model-value="switchGroup" class="w-full">
      <!-- 标签列表 -->
      <div class="flex items-center justify-center mb-4">
        <TabsList>
          <TabsTrigger
            v-for="group in groups"
            :key="group.id"
            :value="group.id"
            class="gap-1.5"
          >
            <DynamicIcon :name="group.icon" :size="14" />
            {{ group.name }}
          </TabsTrigger>

          <!-- 添加分组按钮 -->
          <Button
            variant="ghost"
            size="sm"
            class="ml-1 rounded-full transition-colors"
            style="color: var(--theme-text-muted);"
            @click="openAddGroupDialog"
          >
            <Plus class="w-4 h-4" />
          </Button>
        </TabsList>

        <!-- 分组管理下拉菜单 -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button 
              variant="ghost" 
              size="icon" 
              class="ml-2 rounded-full transition-colors"
              style="color: var(--theme-text-muted);"
            >
              <MoreHorizontal class="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="openAddGroupDialog" class="cursor-pointer">
              <FolderPlus class="w-4 h-4 mr-2" />
              添加分组
            </DropdownMenuItem>
            <template v-for="group in groups" :key="group.id">
              <DropdownMenuItem
                v-if="group.id !== 'default'"
                @click="openEditGroupDialog(group)"
                class="cursor-pointer"
              >
                <Pencil class="w-4 h-4 mr-2" />
                编辑「{{ group.name }}」
              </DropdownMenuItem>
            </template>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <!-- 书签内容区域 -->
      <TabsContent v-for="group in groups" :key="group.id" :value="group.id" class="mt-0">
        <div class="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 gap-3" @mouseleave="handleMouseLeave">
          <!-- 书签项 -->
          <ContextMenu v-for="(bookmark, index) in activeGroupBookmarks" :key="bookmark.id">
            <ContextMenuTrigger>
              <div 
                class="group relative"
                @mouseenter="handleMouseEnter(index)"
              >
                <Card
                  class="bookmark-card aspect-square flex flex-col items-center justify-center p-1.5 cursor-pointer backdrop-blur-xl shadow-lg rounded-xl transition-all duration-200 ease-out"
                  :style="{
                    transform: `scale(${getBookmarkScale(index)}) translateY(${getBookmarkTranslateY(index)}px)`,
                    background: 'var(--theme-bg)',
                    border: '1px solid var(--theme-border)'
                  }"
                  tabindex="0"
                  role="link"
                  :aria-label="`打开 ${bookmark.title}`"
                  @click="openBookmark(bookmark.url)"
                  @keydown="handleBookmarkKeydown($event, bookmark)"
                >
                  <!-- 图标 -->
                  <div class="w-8 h-8 mb-1 flex items-center justify-center">
                    <img
                      v-if="getBookmarkIcon(bookmark) && !failedIcons.has(bookmark.id)"
                      :src="getBookmarkIcon(bookmark)"
                      :alt="bookmark.title"
                      class="w-6 h-6 object-contain"
                      @error="handleIconError(bookmark.id)"
                    />
                    <Globe v-else class="w-6 h-6" style="color: var(--theme-text-muted);" />
                  </div>
                  <!-- 标题 -->
                  <span class="text-[10px] text-center truncate w-full px-0.5 leading-tight" style="color: var(--theme-text-secondary);">
                    {{ bookmark.title }}
                  </span>
                  <!-- 快捷操作菜单 - 右上角内部竖向三点 -->
                  <DropdownMenu>
                    <DropdownMenuTrigger as-child>
                      <button
                        class="absolute top-1 right-1 w-4 h-5 flex items-center justify-center rounded opacity-0 group-hover:opacity-100 transition-all"
                        style="color: var(--theme-text-muted);"
                        @click.stop
                      >
                        <MoreVertical class="w-3 h-3" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="min-w-[100px]">
                      <DropdownMenuItem @click="openEditBookmarkDialog(bookmark)" class="cursor-pointer gap-2">
                        <Pencil class="w-3.5 h-3.5" />
                        编辑
                      </DropdownMenuItem>
                      <DropdownMenuItem @click="handleDeleteBookmark(bookmark.id)" class="cursor-pointer gap-2 text-destructive focus:text-destructive">
                        <Trash2 class="w-3.5 h-3.5" />
                        删除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </Card>

              </div>
            </ContextMenuTrigger>

            <!-- 右键菜单 -->
            <ContextMenuContent>
              <ContextMenuItem @click="openBookmark(bookmark.url)" class="cursor-pointer">
                打开链接
              </ContextMenuItem>
              <ContextMenuItem @click="openEditBookmarkDialog(bookmark)" class="cursor-pointer">
                <Pencil class="w-4 h-4 mr-2" />
                编辑
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem
                v-for="g in groups.filter(x => x.id !== bookmark.groupId)"
                :key="g.id"
                @click="handleMoveBookmark(bookmark.id, g.id)"
                class="cursor-pointer"
              >
                移动到「{{ g.icon }} {{ g.name }}」
              </ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem @click="handleDeleteBookmark(bookmark.id)" class="cursor-pointer text-red-500">
                <Trash2 class="w-4 h-4 mr-2" />
                删除
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>

          <!-- 添加按钮 -->
          <Card
            class="aspect-square flex flex-col items-center justify-center p-1.5 cursor-pointer rounded-xl transition-all"
            style="background: transparent; border: 1px dashed var(--theme-border);"
            @click="openAddBookmarkDialog"
          >
            <Plus class="w-6 h-6" style="color: var(--theme-text-muted);" />
            <span class="text-[10px] mt-0.5" style="color: var(--theme-text-muted);">添加</span>
          </Card>
        </div>
      </TabsContent>
    </Tabs>

    <!-- 书签弹窗 -->
    <Dialog v-model:open="showBookmarkDialog">
      <DialogContent class="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>{{ editBookmarkMode ? '编辑书签' : '添加书签' }}</DialogTitle>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">名称</label>
            <Input v-model="bookmarkForm.title" placeholder="网站名称" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">网址</label>
            <Input v-model="bookmarkForm.url" placeholder="https://example.com" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">图标 URL（可选）</label>
            <Input v-model="bookmarkForm.icon" placeholder="留空自动获取" />
          </div>
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button @click="handleBookmarkSubmit">
            {{ editBookmarkMode ? '保存' : '添加' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 分组弹窗 -->
    <Dialog v-model:open="showGroupDialog">
      <DialogContent class="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>{{ editGroupMode ? '编辑分组' : '添加分组' }}</DialogTitle>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">分组名称</label>
            <Input v-model="groupForm.name" placeholder="分组名称" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium">选择图标</label>
            <div class="grid grid-cols-7 gap-2 p-3 bg-muted/50 rounded-lg max-h-48 overflow-y-auto">
              <button
                v-for="iconName in availableIcons"
                :key="iconName"
                type="button"
                class="p-2 rounded-md hover:bg-background transition-colors flex items-center justify-center"
                :class="{ 'bg-primary text-white': groupForm.icon === iconName }"
                @click="groupForm.icon = iconName"
              >
                <DynamicIcon :name="iconName" :size="20" />
              </button>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            v-if="editGroupMode && currentGroup?.id !== 'default'"
            variant="destructive"
            class="mr-auto"
            @click="handleDeleteGroup(currentGroup.id); showGroupDialog = false"
          >
            删除分组
          </Button>
          <DialogClose as-child>
            <Button variant="outline">取消</Button>
          </DialogClose>
          <Button @click="handleGroupSubmit">
            {{ editGroupMode ? '保存' : '添加' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
