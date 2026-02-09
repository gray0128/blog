# 无废话 Astro

> 作者：老胡闲话
> 制作时间：2026 年 2 月 8 日
> 字数：0.1 万
> 1 篇文章
> 本内容由「新枝」导出


## 目录

[为什么选择 Astro](#为什么选择-astro)
[快速开始](#快速开始)
[核心概念](#核心概念)
[集成系统](#集成系统)
[五个常见坑点](#五个常见坑点)
[生态与基础设施](#生态与基础设施)
[Astro vs Next.js](#astro-vs-next.js)
[总结](#总结)
[参考资料](#参考资料)


## 无废话 Astro

> 原发布于 [微信公众号](https://mp.weixin.qq.com/s?__biz=MzIyOTY1NDYyMw==&mid=2247485614&idx=1&sn=318804690221e5f18dc3be3e846d8533&chksm=e90673c5fda78253698be129c661d8d015f719389e7dadbc726c7295649d7e3f8fb2aedaac04&mpshare=1&scene=1&srcid=0208faON3REfRMigapo4AbVu&sharer_shareinfo=b43d8954bca1adfe6f1dd703c604ecf1&sharer_shareinfo_first=b43d8954bca1adfe6f1dd703c604ecf1#rd)，老胡闲话

借着 Astro 加入 Cloudflare 的热度，决定写一篇关于它的文章。同时也算是我们自己在用它做了若干项目之后的的踩坑总结，两年间，我们用它做了若干尝试：中英文技术站点，开源的 Astro Theme，以及若干 Astro Integration和项目。

一句话总结：Astro 值得你花时间尝试，但需要了解它的一些限制，它的设计哲学也很简单：**内容优先，JavaScript 能少则少**。

### 为什么选择 Astro

在众多 Web 框架中，Astro 有三个特性让我印象深刻。

#### 默认零 JS

Astro 默认输出纯 HTML，不会自动打包一堆 JavaScript 到客户端。

```
<html>
  <body>
    <h1>Hello World</h1>
  </body>
</html>
```

需要交互？通过 Islands Architecture 按需添加。这意味着你的页面加载速度会快得多，尤其是对于内容为主的站点。

#### 内置 Content Collections

类型安全的内容管理是 Astro 的一大亮点。

```
// src/content.config.ts
const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
  }),
});
```

定义好 schema，Astro 会自动校验你的 Markdown frontmatter，IDE 里还能获得完整的类型提示。告别运行时才发现字段拼错的尴尬。

#### 开发体验一流

- 热更新快到飞起
- 图片、CSS 等静态资源自动优化
- 丰富的集成生态，一条命令搞定


### 快速开始

四步创建你的第一个 Astro 站点：

```
# 1. 创建项目
npm create astro@latest

# 2. 安装依赖
pnpm install

# 3. 在 src/content/ 下写 Markdown

# 4. 启动开发服务器
pnpm dev
```

就这么简单。不需要写一行 JavaScript，只管写 Markdown。

### 核心概念

Astro 的架构围绕四个核心模块展开：

- **Content**：Collections、Loaders、Schemas，负责内容管理
- **Components**：.astro 文件、Islands、Layouts，负责 UI 构建
- **Routing**：基于文件系统、动态路由、API Routes
- **Server**：Middleware、Actions、SSR/Hybrid 渲染模式


基本开发流程：定义 Schema → 创建页面 → 添加组件 → 部署。路由、优化、构建这些事情 Astro 帮你处理。

### 集成系统

Astro 的扩展能力很强，一条命令就能添加新功能：

```
# 添加 React 支持
npx astro add react
```

#### 官方集成

UI 框架React, Vue, Svelte, Solid部署适配器Vercel, Cloudflare, Node工具MDX, Sitemap, Partytown

#### 自定义集成

也可以编写自己的集成：

```
// integrations/analytics/index.ts
export default function analytics(): AstroIntegration {
  return {
    name: "my-analytics",
    hooks: {
      "astro:config:setup": ({ injectScript }) => {
        injectScript("page", `console.log("page view")`);
      },
    },
  };
}
```

然后在配置中引入：

```
// astro.config.mjs
import analytics from "./integrations/analytics";

export default defineConfig({
  integrations: [analytics()],
});
```

集成是基于源码的，可以从本地文件或 npm 包导入。

### 五个常见坑点

用 Astro 开发时，这些坑要注意。

#### 1. 环境变量泄露

`PUBLIC_*` 前缀的变量会被打包进客户端 JS，任何人都能在浏览器 DevTools 里看到。

```
// ❌ 危险 - 密钥暴露给客户端
const key = import.meta.env.PUBLIC_API_KEY;

// ✅ 安全 - 仅服务端可见
const key = import.meta.env.API_KEY;
```

#### 2. Server Hooks 只在开发环境运行

`astro:server:*` 钩子只在开发服务器中执行，生产环境不会触发。

```
hooks: {
  "astro:server:setup": ({ server }) => {
    // 这里的代码只在 dev 模式运行！
  }
}
```

生产环境的请求处理请使用 middleware。

#### 3. 集成的心智模型

集成是**源码级别**的，不是包级别的：

- 代码在构建时运行，不是运行时
- 配置在构建时就固定了
- 把它想象成编译过程，而非执行过程


#### 4. 运行时配置的陷阱

集成配置在构建时就锁定了：

```
// ❌ 不行 - 配置在构建时锁定，astro.config.mjs
export default defineConfig({
  integrations: [myIntegration({ apiKey: process.env.API_KEY })]
});

// ✅ 使用运行时配置文件，config/my-integration.ts
export default {
  apiKey: process.env.API_KEY,
};
```

#### 5. 部署前务必 Preview

`pnpm dev` 和生产环境不一样。部署前一定要本地测试构建产物：

```
pnpm build && pnpm preview
```

这能帮你提前发现 SSR/hybrid 渲染、环境变量、构建时与运行时行为差异等问题。

### 生态与基础设施

#### 推荐的技术栈

- **UI**：React, TailwindCSS, shadcn/ui
- **存储**：Flydrive
- **认证**：Better Auth


#### 部署方案

- **托管**：Vercel, Cloudflare
- **数据库**：Supabase, D1, Turso
- **对象存储**：Cloudflare R2


#### 项目模板

不想从零开始？astro.build/themes 提供了大量预置模板，涵盖博客、文档、作品集、电商等场景。

如果你对本站的样式感兴趣，欢迎试试我们开源的 MonaKit 主题。

### Astro vs Next.js

设计理念内容优先，零 JS应用优先，React 运行时默认 JS无React hydrationUI 框架任选（React, Vue, Svelte 等）仅 React适用场景博客、文档、营销站Web 应用、后台系统

**选择建议**：

- **Astro**：内容站点、追求性能、需要混用多框架
- **Next.js**：复杂交互应用、深度依赖 React 生态


### 总结

如果你的网站以内容为核心，追求加载性能，又不想被单一框架绑定，Astro 是个靠谱的选择。

它不会取代 Next.js 或其他全栈框架，但在内容驱动的场景下，Astro 做到了简单与强大的平衡。

### 参考资料

- Astro 官方文档
- Astro Themes
- Astro 集成指南




