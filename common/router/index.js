// 路由
import {
	RouterMount,
	createRouter
} from './uni-simple-router.js'
import store from '@/common/store'
const router = createRouter({
	platform: process.env.VUE_APP_PLATFORM,
	applet: {
		animationDuration: 300 // 页面切换时间 默认 300ms 
	},
	routerErrorEach: ({
		type,
		msg
	}) => {
		if(type === 3){       
			router.$lockStatus=false;
		}
	},
	// 通配符，非定义页面，跳转404
	routes: [
		...ROUTES,
		{
			path: '*',
			redirect: (to) => {
				return {
					name: '404'
				}
			}
		},
	]
});


//全局路由前置守卫
router.beforeEach((to, from, next) => {
	if (to.meta && to.meta.white) {
		// 访问免登陆白名单，直接进入
		next();
	} else if(!store.getters.isLogin) {
		// 未登录
		next({ path: '/pages/login/login' });
	} else if(!Object.keys(store.getters.selectedOrg).length && to.meta && !to.meta.organization) {
		// 登录但未选择机构  且除去选择机构页面
		next({ path: '/pages/login/organization/list' });
	} else {
		next();
	}
});

export {
	router,
	RouterMount
}
