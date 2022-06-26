# 小程序使用说明

1. 首次安装需要 npm i 加载相关依赖 

2. 基于uni-app，需要下载hbuilderX进行编译

3. manifest.json中配置相关信息

4. 引用uview组件库开发

# 部分文件结构说明

1. common -- 功能文件      
  request -- 网络请求    
  router -- 路由配置   
  store -- 仓库管理    
  utils -- 静态工具文件      
  wechat -- 微信方法封装   
2. uni_modules/uview-ui -- uview 组件   
3. env.js -- 全局配置文件    


# 其它
1. 引用了 [uni-simple-router](https://hhyang.cn/v2/start/introduction.html) 插件，后续页面跳转可用$Router，也可用uni.跳转，都能判断到路由相关配置。
2. [uview-ui](https://www.uviewui.com/components/intro.html)
3. [uni-app](https://uniapp.dcloud.io/README)
4. [微信开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
5. uview的日历选择不太好用，引入[uni-datetime-picker](https://uniapp.dcloud.io/component/uniui/uni-datetime-picker)
5. 引入了一个二维码生成器(暂时取消二维码跳转小程序)
