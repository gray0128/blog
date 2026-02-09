# 绑定 GitHub 仓库实现自动部署

将你的 Astro 博客与 GitHub 仓库绑定，实现每次推送代码自动触发 Cloudflare Pages 构建和部署。

## 1. 准备 GitHub 仓库
确保你的本地项目已经是一个 Git 仓库，并且已推送到 GitHub。

```bash
# 初始化 Git (如果尚未初始化)
git init
git add .
git commit -m "Initial commit"

# 关联远程仓库 (替换为你自己的 GitHub 仓库地址)
git remote add origin https://github.com/你的用户名/你的仓库名.git
git branch -M main
git push -u origin main
```

## 2. 在 Cloudflare Dashboard 中连接 GitHub
1.  登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)。
2.  进入 **Workers & Pages** -> **Overview**。
3.  点击 **Create application** -> **Pages** -> **Connect to Git**。
4.  选择你的 GitHub 账号（如果没授权过，会跳转 GitHub 授权）。
5.  在列表中选择你的博客仓库 -> **Begin setup**。

## 3. 配置构建设置 (关键步骤)
在 "Set up builds and deployments" 页面，正确填写以下信息：

*   **Project name**: 自定义项目名称 (例如 `my-astro-blog`)
*   **Production branch**: `main`
*   **Framework preset**: 选择 **Astro**
*   **Build command**: `npm run build`
*   **Build output directory**: `dist`
*   **Root directory**: `web` (重要：因为你的 Astro 项目在 `web` 子目录下)

## 4. 保存并部署
点击 **Save and Deploy**。
Cloudflare 会立即拉取你的代码，开始第一次自动构建。

## 5. 验证与后续更新
构建成功后，你会获得一个 `*.pages.dev` 的永久域名。

以后写完文章或修改代码后，只需推送到 GitHub：

```bash
git add .
git commit -m "Update blog post"
git push
```

Cloudflare 会自动检测更新并重新发布你的博客。
