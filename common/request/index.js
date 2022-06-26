import Request from './request'
import apiList from './apis.js'
import store from '@/common/store/index.js'

const hdRequest = new Request();
export default function http(
	url,
	data = {},
	toastBefore = '', // 请求前加载提示
	toastAfter = true, // 请求后错误提示
) {
	let api = getApiPath(url);
	/* 请求之前拦截器 */
	hdRequest.interceptor.request((config, cancel) => {
		let token = uni.getStorageSync('token');
		// 直接在外层判断，不知道为啥会保留上次请求的token，只好给放里面判断重新赋值
		hdRequest.setConfig(config => {
			if(token && (!api.ignoreLogin)){
				config.header.Authorization = `Bearer ${token}`
			}
			else {
				config.header.Authorization = ``
			}	
		})
		if (toastBefore !== '') {
			uni.showLoading({
				title: toastBefore || '加载中...',
				mask: true
			});
		}
		return config
	});

	/* 请求之后拦截器 */
	hdRequest.interceptor.response((response) => {
		uni.hideLoading();
		switch(response.code) {
			case 200: return response;
			case 1011004:   // token为空，未登录但当前接口需要登录
				// store.dispatch('logout');
				uni.showToast({
					title: '请登录',
					icon: 'none',
					duration: 1000
				});
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}, 1000);
				return response;
				break;
			case 1011008:   // token过期注销
				// store.dispatch('logout');
				uni.showToast({
					title: response.message || '登录已过期，请重新登录',
					icon: 'none',
					duration: 1000
				});
				setTimeout(() => {
					uni.navigateTo({
						url: '/pages/login/login'
					})
				}, 1000);
				return response;
				break;
			default: 
				if (toastAfter) {
					uni.showToast({
						title: response.message || '请求出错,稍后重试',
						icon: 'none',
						mask: true
					});
				}
				return response;
		}
	})

	return hdRequest.request({
		url: api.url,
		data,
		method: api.method
	})

}

// 组装接口路径
function getApiPath(url) {
	let apiArray = url.split(".");
	let api = apiList;
	apiArray.forEach(v => {
		api = api[v];
	});
	return api;
}
