# MyTab

<p align="center">
  <img src="public/icons/icon128.png" alt="MyTab Logo" width="128" height="128">
</p>

<p align="center">
  <strong> 美观实用的浏览器新标签页扩展</strong>
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#安装使用">安装使用</a> •
  <a href="#开发指南">开发指南</a> •
  <a href="#项目结构">项目结构</a>
</p>

---

## 功能特性

### 多搜索引擎
- 支持 Google、Bing、百度 快速切换
- 简洁优雅的搜索框设计

### 书签管理
- **分组管理** - 创建自定义分组，灵活组织书签
- **快速添加** - 支持手动添加和浏览器书签导入
- **拖拽排序** - 直观的书签排列方式
- **图标自适应** - 自动获取网站 favicon

### 壁纸系统
- **精选壁纸** - 内置 50+ 张高质量壁纸，涵盖 9 个分类
- **在线壁纸** - 支持 Unsplash、Picsum、Bing 每日壁纸
- **分类筛选** - 自然、山脉、海洋、森林、城市、太空、抽象、简约、暗色

### 时钟组件
- 支持 12/24 小时制切换
- 可选显示秒钟
- 简约时尚的显示效果

### 个性化设置
- 数据本地存储，隐私安全
- 配置导入/导出功能
- 响应式设计，适配各种屏幕

---

## 安装使用

### Chrome / Edge 浏览器

1. **下载扩展**
   ```bash
   git clone https://github.com/Zy0913/MyTab.git
   cd MyTab
   npm install
   npm run build:ext
   ```

2. **加载扩展**
   - 打开浏览器扩展管理页面
     - Chrome: `chrome://extensions/`
     - Edge: `edge://extensions/`
   - 开启「开发者模式」
   - 点击「加载已解压的扩展程序」
   - 选择项目 `dist` 文件夹

3. **开始使用**
   - 打开新标签页即可体验

---

## 开发指南

### 环境要求
- Node.js >= 18
- npm >= 9

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```
访问 http://localhost:5173 预览效果

### 构建生产版本
```bash
# 仅构建
npm run build

# 构建并复制 manifest（用于扩展打包）
npm run build:ext
```

### 生成图标
```bash
npm run icons
```

---

## 项目结构

```
MyTab/
├── public/
│   ├── icons/              # 扩展图标
│   └── manifest.json       # Chrome 扩展配置
├── src/
│   ├── components/
│   │   ├── ui/             # 基础 UI 组件 (shadcn-vue 风格)
│   │   │   ├── button/
│   │   │   ├── card/
│   │   │   ├── dialog/
│   │   │   ├── dropdown-menu/
│   │   │   └── ...
│   │   ├── BookmarkGrid.vue    # 书签网格
│   │   ├── Clock.vue           # 时钟组件
│   │   ├── SearchBox.vue       # 搜索框
│   │   ├── Settings.vue        # 设置面板
│   │   ├── ImportBookmarks.vue # 书签导入
│   │   └── Toast.vue           # 消息提示
│   ├── stores/
│   │   └── settings.js     # 状态管理 & localStorage 持久化
│   ├── lib/
│   │   └── utils.js        # 工具函数
│   ├── App.vue             # 根组件
│   ├── main.js             # 入口文件
│   └── style.css           # 全局样式
├── scripts/
│   ├── copy-manifest.js    # 构建脚本
│   └── generate-icons.js   # 图标生成脚本
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Vue | 3.5 | 前端框架 |
| Vite | 7.x | 构建工具 |
| Tailwind CSS | 4.x | 样式框架 |
| radix-vue | 1.9 | 无障碍组件基础 |
| lucide-vue-next | 0.555 | 图标库 |
| class-variance-authority | 0.7 | 组件变体管理 |

---

## 扩展权限说明

| 权限 | 用途 |
|------|------|
| `storage` | 保存用户配置和书签数据 |
| `bookmarks` | 读取浏览器书签（用于导入功能） |

---

## 贡献

欢迎提交 Issue 和 Pull Request！

---

## License

MIT License 2024
