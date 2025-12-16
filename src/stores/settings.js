import { ref, watch, computed } from 'vue'

// 搜索引擎配置（带图标和颜色）
const searchEngines = [
  { id: 'google', name: 'Google', url: 'https://www.google.com/search?q=', icon: 'G', color: '#4285F4' },
  { id: 'bing', name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'B', color: '#008373' },
  { id: 'baidu', name: '百度', url: 'https://www.baidu.com/s?wd=', icon: '百', color: '#2932E1' },
  { id: 'duckduckgo', name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=', icon: 'D', color: '#DE5833' }
]

// 可用的分组图标（Lucide 图标名称）
const availableIcons = [
  'Star', 'Heart', 'Bookmark', 'Folder', 'Home',
  'Code', 'Terminal', 'Database', 'Globe', 'Briefcase',
  'Film', 'Music', 'Image', 'Camera', 'Gamepad2',
  'MessageCircle', 'Users', 'Mail', 'Phone', 'Video',
  'ShoppingBag', 'CreditCard', 'Wallet', 'Gift', 'Tag',
  'Book', 'GraduationCap', 'Lightbulb', 'PenTool', 'Palette',
  'Plane', 'Car', 'Coffee', 'Utensils', 'Dumbbell'
]

// 默认分组（使用 Lucide 图标名称）
const defaultGroups = [
  { id: 'default', name: '常用', icon: 'Star' },
  { id: 'dev', name: '开发', icon: 'Code' },
  { id: 'media', name: '媒体', icon: 'Film' },
  { id: 'social', name: '社交', icon: 'MessageCircle' }
]

// 默认书签（带分组）
const defaultBookmarks = [
  { id: '1', title: 'GitHub', url: 'https://github.com', icon: 'https://github.githubassets.com/favicons/favicon.svg', groupId: 'dev' },
  { id: '2', title: 'Google', url: 'https://google.com', icon: 'https://www.google.com/favicon.ico', groupId: 'default' },
  { id: '3', title: 'YouTube', url: 'https://youtube.com', icon: 'https://www.youtube.com/favicon.ico', groupId: 'media' },
  { id: '4', title: '知乎', url: 'https://zhihu.com', icon: 'https://static.zhihu.com/heifetz/favicon.ico', groupId: 'social' },
  { id: '5', title: '哔哩哔哩', url: 'https://bilibili.com', icon: 'https://www.bilibili.com/favicon.ico', groupId: 'media' },
  { id: '6', title: '掘金', url: 'https://juejin.cn', icon: 'https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/static/favicons/favicon-32x32.png', groupId: 'dev' },
  { id: '7', title: 'Stack Overflow', url: 'https://stackoverflow.com', icon: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/favicon.ico', groupId: 'dev' },
  { id: '8', title: 'Twitter', url: 'https://twitter.com', icon: 'https://abs.twimg.com/favicons/twitter.ico', groupId: 'social' },
  { id: '9', title: '百度', url: 'https://baidu.com', icon: 'https://www.baidu.com/favicon.ico', groupId: 'default' },
  { id: '10', title: 'Netflix', url: 'https://netflix.com', icon: 'https://assets.nflxext.com/us/ffe/siteui/common/icons/nficon2016.ico', groupId: 'media' }
]

// 一言类型配置
const hitokotoTypes = [
  { id: 'a', name: '动画', checked: true },
  { id: 'b', name: '漫画', checked: true },
  { id: 'c', name: '游戏', checked: true },
  { id: 'd', name: '文学', checked: false },
  { id: 'e', name: '原创', checked: false },
  { id: 'f', name: '网络', checked: false },
  { id: 'g', name: '其他', checked: false },
  { id: 'h', name: '影视', checked: false },
  { id: 'i', name: '诗词', checked: false },
  { id: 'j', name: '网易云', checked: false },
  { id: 'k', name: '哲学', checked: false },
  { id: 'l', name: '抖机灵', checked: false }
]

// 壁纸源配置
const wallpaperSources = [
  { id: 'local', name: '精选壁纸', description: '本地精选高质量壁纸' },
  { id: 'random', name: '随机壁纸', description: '随机高清壁纸 API' },
  { id: 'unsplash', name: 'Unsplash', description: '全球最大免费图库' },
  { id: 'picsum', name: 'Picsum', description: '随机精美图片' },
  { id: 'bing', name: 'Bing 每日', description: '必应每日精选' }
]

// Unsplash 壁纸分类（用于 Unsplash API）
const unsplashCategories = [
  { id: 'nature', name: '自然', query: 'nature' },
  { id: 'mountain', name: '山脉', query: 'mountain' },
  { id: 'ocean', name: '海洋', query: 'ocean,sea' },
  { id: 'forest', name: '森林', query: 'forest' },
  { id: 'city', name: '城市', query: 'city,architecture' },
  { id: 'space', name: '太空', query: 'space,galaxy' },
  { id: 'abstract', name: '抽象', query: 'abstract,gradient' },
  { id: 'minimal', name: '简约', query: 'minimal,simple' },
  { id: 'dark', name: '暗色', query: 'dark,night' }
]

// 本地精选壁纸分类
const wallpaperCategories = [
  { id: 'nature', name: '自然' },
  { id: 'mountain', name: '山脉' },
  { id: 'ocean', name: '海洋' },
  { id: 'forest', name: '森林' },
  { id: 'city', name: '城市' },
  { id: 'space', name: '太空' },
  { id: 'abstract', name: '抽象' },
  { id: 'minimal', name: '简约' },
  { id: 'dark', name: '暗色' }
]

// 默认背景图片（来自 Unsplash - 精选高质量壁纸）
const defaultBackgrounds = [
  // 自然风光
  { id: 'n1', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80', category: 'nature' },
  { id: 'n2', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&q=80', category: 'nature' },
  { id: 'n3', url: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=1920&q=80', category: 'nature' },
  { id: 'n4', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1920&q=80', category: 'nature' },
  { id: 'n5', url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&q=80', category: 'nature' },
  { id: 'n6', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&q=80', category: 'nature' },
  
  // 山脉
  { id: 'm1', url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80', category: 'mountain' },
  { id: 'm2', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=80', category: 'mountain' },
  { id: 'm3', url: 'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1920&q=80', category: 'mountain' },
  { id: 'm4', url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=1920&q=80', category: 'mountain' },
  { id: 'm5', url: 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80', category: 'mountain' },
  { id: 'm6', url: 'https://images.unsplash.com/photo-1445363692815-ebcd599f7621?w=1920&q=80', category: 'mountain' },
  
  // 海洋
  { id: 'o1', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80', category: 'ocean' },
  { id: 'o2', url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1920&q=80', category: 'ocean' },
  { id: 'o3', url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&q=80', category: 'ocean' },
  { id: 'o4', url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&q=80', category: 'ocean' },
  { id: 'o5', url: 'https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1920&q=80', category: 'ocean' },
  { id: 'o6', url: 'https://images.unsplash.com/photo-1468413253725-0d5181091126?w=1920&q=80', category: 'ocean' },
  
  // 森林
  { id: 'f1', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&q=80', category: 'forest' },
  { id: 'f2', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80', category: 'forest' },
  { id: 'f3', url: 'https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=1920&q=80', category: 'forest' },
  { id: 'f4', url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1920&q=80', category: 'forest' },
  { id: 'f5', url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1920&q=80', category: 'forest' },
  { id: 'f6', url: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=1920&q=80', category: 'forest' },
  
  // 城市
  { id: 'c1', url: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1920&q=80', category: 'city' },
  { id: 'c2', url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1920&q=80', category: 'city' },
  { id: 'c3', url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1920&q=80', category: 'city' },
  { id: 'c4', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1920&q=80', category: 'city' },
  { id: 'c5', url: 'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1920&q=80', category: 'city' },
  { id: 'c6', url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1920&q=80', category: 'city' },
  
  // 太空
  { id: 's1', url: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=1920&q=80', category: 'space' },
  { id: 's2', url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80', category: 'space' },
  { id: 's3', url: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&q=80', category: 'space' },
  { id: 's4', url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920&q=80', category: 'space' },
  { id: 's5', url: 'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1920&q=80', category: 'space' },
  { id: 's6', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80', category: 'space' },
  
  // 抽象/渐变
  { id: 'a1', url: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&q=80', category: 'abstract' },
  { id: 'a2', url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1920&q=80', category: 'abstract' },
  { id: 'a3', url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=1920&q=80', category: 'abstract' },
  { id: 'a4', url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&q=80', category: 'abstract' },
  { id: 'a5', url: 'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&q=80', category: 'abstract' },
  { id: 'a6', url: 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=1920&q=80', category: 'abstract' },
  
  // 简约
  { id: 'mi1', url: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?w=1920&q=80', category: 'minimal' },
  { id: 'mi2', url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=1920&q=80', category: 'minimal' },
  { id: 'mi3', url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1920&q=80', category: 'minimal' },
  { id: 'mi4', url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=1920&q=80', category: 'minimal' },
  { id: 'mi5', url: 'https://images.unsplash.com/photo-1488866022504-f2584929ca5f?w=1920&q=80', category: 'minimal' },
  { id: 'mi6', url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1920&q=80', category: 'minimal' },
  
  // 暗色系
  { id: 'd1', url: 'https://images.unsplash.com/photo-1536859355448-76f92ebdc33d?w=1920&q=80', category: 'dark' },
  { id: 'd2', url: 'https://images.unsplash.com/photo-1531306728370-e2ebd9d7bb99?w=1920&q=80', category: 'dark' },
  { id: 'd3', url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1920&q=80', category: 'dark' },
  { id: 'd4', url: 'https://images.unsplash.com/photo-1532003885409-ed84d334f6cc?w=1920&q=80', category: 'dark' },
  { id: 'd5', url: 'https://images.unsplash.com/photo-1505533321630-975218a5f66f?w=1920&q=80', category: 'dark' },
  { id: 'd6', url: 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=1920&q=80', category: 'dark' }
]

// 从 localStorage 加载数据
function loadFromStorage(key, defaultValue) {
  try {
    const stored = localStorage.getItem(`mytab_${key}`)
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

// 保存到 localStorage
function saveToStorage(key, value) {
  try {
    localStorage.setItem(`mytab_${key}`, JSON.stringify(value))
  } catch (e) {
    console.error('Failed to save to localStorage:', e)
  }
}

// 响应式状态
const currentEngine = ref(loadFromStorage('searchEngine', 'google'))
const groups = ref(loadFromStorage('groups', defaultGroups))
const bookmarks = ref(loadFromStorage('bookmarks', defaultBookmarks))
const activeGroupId = ref(loadFromStorage('activeGroupId', 'default'))
const backgroundUrl = ref(loadFromStorage('backgroundUrl', defaultBackgrounds[0].url))
const wallpaperSource = ref(loadFromStorage('wallpaperSource', 'local'))
const showClock = ref(loadFromStorage('showClock', true))
const showSeconds = ref(loadFromStorage('showSeconds', false))
const use24Hour = ref(loadFromStorage('use24Hour', true))
const backgroundBrightness = ref(loadFromStorage('backgroundBrightness', 70))
const backgroundBlur = ref(loadFromStorage('backgroundBlur', 8))
const selectedHitokotoTypes = ref(loadFromStorage('hitokotoTypes', ['a', 'b', 'c']))

// 计算属性：当前分组的书签
const activeGroupBookmarks = computed(() => {
  return bookmarks.value.filter((b) => b.groupId === activeGroupId.value)
})

// 自动保存
watch(currentEngine, (val) => saveToStorage('searchEngine', val))
watch(groups, (val) => saveToStorage('groups', val), { deep: true })
watch(bookmarks, (val) => saveToStorage('bookmarks', val), { deep: true })
watch(activeGroupId, (val) => saveToStorage('activeGroupId', val))
watch(backgroundUrl, (val) => saveToStorage('backgroundUrl', val))
watch(wallpaperSource, (val) => saveToStorage('wallpaperSource', val))
watch(showClock, (val) => saveToStorage('showClock', val))
watch(showSeconds, (val) => saveToStorage('showSeconds', val))
watch(use24Hour, (val) => saveToStorage('use24Hour', val))
watch(backgroundBrightness, (val) => saveToStorage('backgroundBrightness', val))
watch(backgroundBlur, (val) => saveToStorage('backgroundBlur', val))
watch(selectedHitokotoTypes, (val) => saveToStorage('hitokotoTypes', val), { deep: true })

// 导出
export {
  searchEngines,
  availableIcons,
  wallpaperSources,
  wallpaperCategories,
  unsplashCategories,
  defaultBackgrounds,
  hitokotoTypes,
  currentEngine,
  groups,
  bookmarks,
  activeGroupId,
  activeGroupBookmarks,
  backgroundUrl,
  wallpaperSource,
  showClock,
  showSeconds,
  use24Hour,
  backgroundBrightness,
  backgroundBlur,
  selectedHitokotoTypes
}

// 根据分类筛选壁纸
export function getWallpapersByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') {
    return defaultBackgrounds
  }
  return defaultBackgrounds.filter((bg) => bg.category === categoryId)
}

// 随机获取一张壁纸
export function getRandomWallpaper(categoryId) {
  const wallpapers = getWallpapersByCategory(categoryId)
  const randomIndex = Math.floor(Math.random() * wallpapers.length)
  return wallpapers[randomIndex]
}

// 设置随机壁纸（本地精选）
export function setRandomWallpaper(categoryId) {
  const wallpaper = getRandomWallpaper(categoryId)
  if (wallpaper) {
    backgroundUrl.value = wallpaper.url
  }
}

// 预加载图片并等待加载完成
export function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const cleanup = () => {
      img.onload = null
      img.onerror = null
    }
    img.onload = () => {
      cleanup()
      resolve(url)
    }
    img.onerror = () => {
      cleanup()
      reject(new Error('Image load failed'))
    }
    img.src = url
  })
}

// 设置壁纸（带预加载）
export async function setWallpaperWithPreload(url) {
  try {
    await preloadImage(url)
    backgroundUrl.value = url
    return url
  } catch (e) {
    console.error('Failed to preload image:', e)
    throw e
  }
}

// 从 Unsplash 获取随机壁纸（使用 Picsum 作为可靠替代）
export async function fetchUnsplashWallpaper(category = 'nature') {
  // Picsum 支持分类关键词
  const categorySeeds = {
    nature: ['nature', 'landscape', 'green'],
    mountain: ['mountain', 'peak', 'alpine'],
    ocean: ['ocean', 'sea', 'beach', 'water'],
    forest: ['forest', 'trees', 'woods'],
    city: ['city', 'urban', 'building'],
    space: ['night', 'stars', 'dark'],
    abstract: ['abstract', 'pattern', 'texture'],
    minimal: ['minimal', 'simple', 'clean'],
    dark: ['dark', 'moody', 'shadow']
  }
  const seeds = categorySeeds[category] || categorySeeds.nature
  const seed = seeds[Math.floor(Math.random() * seeds.length)] + Date.now()
  const url = `https://picsum.photos/seed/${seed}/1920/1080`
  return setWallpaperWithPreload(url)
}

// 从 Picsum 获取随机壁纸
export async function fetchPicsumWallpaper() {
  const seed = Math.random().toString(36).substring(7) + Date.now()
  const url = `https://picsum.photos/seed/${seed}/1920/1080`
  return setWallpaperWithPreload(url)
}

// 从随机壁纸 API 获取壁纸
export async function fetchRandomApiWallpaper() {
  // 使用随机参数避免缓存
  const url = `https://imgapi.xl0408.top/index.php?t=${Date.now()}`
  return setWallpaperWithPreload(url)
}

// 从 Bing 获取每日壁纸
export async function fetchBingWallpaper() {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    const response = await fetch(
      'https://corsproxy.io/?https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN',
      { signal: controller.signal }
    )
    clearTimeout(timeoutId)

    const data = await response.json()
    if (data.images && data.images.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.images.length)
      const url = `https://www.bing.com${data.images[randomIndex].url}`
      return setWallpaperWithPreload(url)
    }
  } catch (e) {
    if (e.name === 'AbortError') {
      console.error('Bing wallpaper request timeout, using Picsum fallback')
    } else {
      console.error('Failed to fetch Bing wallpaper, using Picsum fallback')
    }
    return fetchPicsumWallpaper()
  }
}

// 根据当前壁纸源获取壁纸
export async function fetchWallpaperBySource(category = 'nature') {
  const source = wallpaperSource.value
  switch (source) {
    case 'random':
      return fetchRandomApiWallpaper()
    case 'unsplash':
      return fetchUnsplashWallpaper(category)
    case 'picsum':
      return fetchPicsumWallpaper()
    case 'bing':
      return fetchBingWallpaper()
    case 'local':
    default:
      const wallpaper = getRandomWallpaper(category)
      if (wallpaper) {
        return setWallpaperWithPreload(wallpaper.url)
      }
      return backgroundUrl.value
  }
}

// 添加书签
export function addBookmark(bookmark) {
  const id = Date.now().toString()
  bookmarks.value.push({ ...bookmark, id })
}

// 删除书签
export function removeBookmark(id) {
  const index = bookmarks.value.findIndex((b) => b.id === id)
  if (index > -1) {
    bookmarks.value.splice(index, 1)
  }
}

// 更新书签
export function updateBookmark(id, data) {
  const bookmark = bookmarks.value.find((b) => b.id === id)
  if (bookmark) {
    Object.assign(bookmark, data)
  }
}

// 获取当前搜索引擎
export function getCurrentEngine() {
  return searchEngines.find((e) => e.id === currentEngine.value) || searchEngines[0]
}

// 执行搜索
export function doSearch(query) {
  if (!query.trim()) return
  const engine = getCurrentEngine()
  window.open(engine.url + encodeURIComponent(query), '_self')
}

// 分组管理
export function addGroup(group) {
  const id = Date.now().toString()
  groups.value.push({ ...group, id })
  return id
}

export function removeGroup(id) {
  // 不能删除默认分组
  if (id === 'default') return false
  const index = groups.value.findIndex((g) => g.id === id)
  if (index > -1) {
    groups.value.splice(index, 1)
    // 将该分组下的书签移动到默认分组
    bookmarks.value.forEach((b) => {
      if (b.groupId === id) {
        b.groupId = 'default'
      }
    })
    // 如果当前激活的是被删除的分组，切换到默认
    if (activeGroupId.value === id) {
      activeGroupId.value = 'default'
    }
    return true
  }
  return false
}

export function updateGroup(id, data) {
  const group = groups.value.find((g) => g.id === id)
  if (group) {
    Object.assign(group, data)
  }
}

// 移动书签到指定分组
export function moveBookmarkToGroup(bookmarkId, groupId) {
  const bookmark = bookmarks.value.find((b) => b.id === bookmarkId)
  if (bookmark) {
    bookmark.groupId = groupId
  }
}

// 获取分组下的书签
export function getBookmarksByGroup(groupId) {
  return bookmarks.value.filter((b) => b.groupId === groupId)
}

// 检查是否在扩展环境中
export function isExtensionEnv() {
  return typeof chrome !== 'undefined' && chrome.bookmarks
}

// 获取浏览器书签树
export async function getBrowserBookmarks() {
  if (!isExtensionEnv()) {
    return null
  }
  
  try {
    const tree = await chrome.bookmarks.getTree()
    return tree
  } catch (e) {
    console.error('Failed to get browser bookmarks:', e)
    return null
  }
}

// 扁平化书签树，提取所有书签（不包含文件夹）
function flattenBookmarks(nodes, result = [], folderPath = '') {
  for (const node of nodes) {
    if (node.url) {
      // 是书签
      result.push({
        id: node.id,
        title: node.title,
        url: node.url,
        folder: folderPath
      })
    } else if (node.children) {
      // 是文件夹，递归处理
      const newPath = folderPath ? `${folderPath} / ${node.title}` : node.title
      flattenBookmarks(node.children, result, newPath)
    }
  }
  return result
}

// 获取扁平化的书签列表
export async function getFlatBrowserBookmarks() {
  const tree = await getBrowserBookmarks()
  if (!tree) return []
  
  return flattenBookmarks(tree)
}

// 检查是否是内网/本地地址
function isLocalOrPrivateUrl(url) {
  try {
    const hostname = new URL(url).hostname
    return (
      hostname === 'localhost' ||
      hostname === 'newtab' ||
      hostname.startsWith('127.') ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname) ||
      /^\d+\.\d+\.\d+\.\d+$/.test(hostname) // 任何 IP 地址
    )
  } catch {
    return true
  }
}

// 获取安全的 favicon URL
export function getSafeFaviconUrl(url) {
  try {
    const urlObj = new URL(url)
    if (isLocalOrPrivateUrl(url)) {
      return ''
    }
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`
  } catch {
    return ''
  }
}

// 导入浏览器书签到指定分组
export async function importBrowserBookmarks(selectedBookmarks, targetGroupId = 'default') {
  const imported = []
  
  for (const bm of selectedBookmarks) {
    // 检查是否已存在
    const exists = bookmarks.value.some((b) => b.url === bm.url)
    if (exists) continue
    
    // 获取 favicon（过滤内网地址）
    const icon = getSafeFaviconUrl(bm.url)
    
    const newBookmark = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: bm.title,
      url: bm.url,
      icon,
      groupId: targetGroupId
    }
    
    bookmarks.value.push(newBookmark)
    imported.push(newBookmark)
  }
  
  return imported
}

// 导出配置
export function exportConfig() {
  const config = {
    version: 1,
    exportTime: new Date().toISOString(),
    data: {
      groups: groups.value,
      bookmarks: bookmarks.value,
      backgroundUrl: backgroundUrl.value,
      wallpaperSource: wallpaperSource.value,
      currentEngine: currentEngine.value,
      showClock: showClock.value,
      showSeconds: showSeconds.value,
      use24Hour: use24Hour.value
    }
  }
  
  const json = JSON.stringify(config, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const a = document.createElement('a')
  a.href = url
  a.download = `mytab-config-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  
  URL.revokeObjectURL(url)
  return true
}

// 导入配置
export function importConfig(file) {
  return new Promise((resolve, reject) => {
    // 文件大小检查 (限制 10MB)
    if (file.size > 10 * 1024 * 1024) {
      reject(new Error('配置文件过大 (最大 10MB)'))
      return
    }

    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const config = JSON.parse(e.target.result)

        // 验证配置格式
        if (!config.version || !config.data) {
          throw new Error('无效的配置文件格式')
        }

        // 验证版本号
        if (typeof config.version !== 'number' || config.version < 1) {
          throw new Error('不支持的配置文件版本')
        }

        const { data } = config

        // 验证数据类型
        if (data.groups && !Array.isArray(data.groups)) {
          throw new Error('分组数据格式错误')
        }
        if (data.bookmarks && !Array.isArray(data.bookmarks)) {
          throw new Error('书签数据格式错误')
        }

        // 验证分组结构
        if (data.groups) {
          for (const group of data.groups) {
            if (!group.id || !group.name) {
              throw new Error('分组缺少必需字段')
            }
          }
        }

        // 验证书签结构
        if (data.bookmarks) {
          for (const bookmark of data.bookmarks) {
            if (!bookmark.id || !bookmark.title || !bookmark.url) {
              throw new Error('书签缺少必需字段')
            }
          }
        }

        // 导入各项配置
        if (data.groups && Array.isArray(data.groups)) {
          groups.value = data.groups
        }
        if (data.bookmarks && Array.isArray(data.bookmarks)) {
          bookmarks.value = data.bookmarks
        }
        if (data.backgroundUrl) {
          backgroundUrl.value = data.backgroundUrl
        }
        if (data.wallpaperSource) {
          wallpaperSource.value = data.wallpaperSource
        }
        if (data.currentEngine) {
          currentEngine.value = data.currentEngine
        }
        if (typeof data.showClock === 'boolean') {
          showClock.value = data.showClock
        }
        if (typeof data.showSeconds === 'boolean') {
          showSeconds.value = data.showSeconds
        }
        if (typeof data.use24Hour === 'boolean') {
          use24Hour.value = data.use24Hour
        }

        resolve({
          success: true,
          message: '配置导入成功',
          importTime: config.exportTime
        })
      } catch (err) {
        reject(new Error('配置文件解析失败: ' + err.message))
      }
    }
    
    reader.onerror = () => reject(new Error('文件读取失败'))
    reader.readAsText(file)
  })
}
