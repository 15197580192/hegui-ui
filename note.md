## 启动
- Clone repo
```
git clone https://github.com/15197580192/hegui-ui.git
cd hegui-ui
```
- Install dependencies
```
yarn install
```
- Compiles and hot-reloads for development
```
yarn run serve
```

## 路由

```
src/config/router.config.js
```

## 新增页面

```
src/views/finance/
src/views/purchase/ 	# 未开发
```

## 前后端交互

配置文件

```
# vue.config.js
  devServer: {
    // development server port 8000
    port: 8000,
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    proxy: {
      '/api': {
        target: 'http://localhost:8081/hegui/api',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''// rewrite path
        }
      }
    }
  },
```

前端请求

```
src/api/invoice.js
```

## 去除权限控制

为了便于开发，暂时屏蔽登录和权限

https://pro.antdv.com/docs/remove-authority-management

## eslint规则配置

```
.eslintrc.js
```

