# TOEFL Cards Lite

可以，而且我已经给你做了一个**双击即可本地运行**的方案：

- 双击 `run_local_web.bat`
- 会自动启动本地静态服务
- 自动在浏览器打开 `http://127.0.0.1:8000/index.html`

> 这就是“本地静态网页版”，体验上就是打开网页正常使用，不依赖 GitHub。

## 你现在怎么用

1. 安装 Python 3（如果还没装）。
2. 在项目根目录双击：`run_local_web.bat`
3. 浏览器会自动打开，直接使用即可。

## 停止方式

关闭名为 **TOEFL Cards Lite Server** 的命令行窗口即可停止本地服务。

## 说明（为什么不能直接双击 index.html）

项目里用到了 `fetch('./words.json')`。
如果直接用 `file://` 打开 `index.html`，浏览器通常会拦截本地文件读取，导致“页面打开但不出词”。

`run_local_web.bat` 的作用就是先起一个本地 HTTP 服务，再打开浏览器，从而保证功能正常。

## 手动运行（可选）

```bash
python -m http.server 8000
```

然后访问：

```text
http://127.0.0.1:8000/index.html
```

## 额外方案

如果你之后仍希望生成 Windows 安装包（`.exe`），可以继续使用 `desktop/` 目录里的 Electron 打包方案。
