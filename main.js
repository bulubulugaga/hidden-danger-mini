import Vue from 'vue'
import App from './App'
import { router, RouterMount } from "@/common/router";
import store from "@/common/store";
import http from '@/common/request';

import uView from '@/uni_modules/uview-ui';
Vue.use(uView);

uni.$u.setConfig({
	// 修改$u.config对象的属性
	config: {
		// 修改默认单位为rpx，相当于执行 uni.$u.config.unit = 'rpx'
		unit: 'rpx'
	}
})

Vue.config.productionTip = false

App.mpType = 'app'

// 引入路由
Vue.use(router);

// 挂载请求
Vue.prototype.$http = http;

const app = new Vue({
    ...App,
	store
})
app.$mount()
