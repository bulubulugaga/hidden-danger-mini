// 用户数据模块
import http from '@/common/request/index'

const state = {
	token: uni.getStorageSync("token") || "",
	isLogin: uni.getStorageSync("isLogin") || false, // 是否登陆
	userInfo: uni.getStorageSync("userInfo") || {}, // 用户信息
	selectedOrg: uni.getStorageSync("selectedOrg") || {}, // 当前选择的机构
	selectedTeam: uni.getStorageSync("selectedTeam") || {}, // 当前选择的检查组
}

const getters = {
	token: state => state.token,
	isLogin: state => state.isLogin,
	userInfo: state => state.userInfo,
	selectedOrg: state => state.selectedOrg,
	selectedTeam: state => state.selectedTeam
}

const actions = {
	// 登录
	async login({
		commit,
		dispatch
	}, params) {
		return new Promise((resolve, reject) => {
			const api = params.type === 'wx' ? 'login.wxLogin' : 'login.phoneLogin';
			http(api, params, '登录中...').then(res => {
				if(res.code === 200) {
					uni.showToast({
						icon: 'success',
						title: '已登录'
					})
					commit('setToken', res.data.token);
					commit('setIsLogin', true);
					
					// 获取用户信息
					dispatch('getUserInfo');
					// uni.navigateTo({
					// 	url: '/pages/login/organization/list?judge=true'
					// })
					
					// 判断机构数量(考虑到多次调用接口，还是放在页面判断)
					http('personel.getOrgList', {}, 0).then(res => {
						if(res.code === 200) {
							// 只有一个机构跳转首页
							if(res.data.length === 1) {
								commit('setSelectedOrg', res.data[0]);
								uni.switchTab({
									url: '/pages/tabbar/home/home'
								});
							} else {
								uni.navigateTo({
									url: '/pages/login/organization/list'
								})
							}
						}
					})
				}
			});
		});
	},

	// 获取用户信息
	getUserInfo({
		commit
	}, token = '') {
		return new Promise((resolve, reject) => {
			http('personel.getUserInfo').then(res => {
				if (res.code === 200) {
					commit('setUserInfo', res.data);
					resolve(res.data)
				}
			})
		})
	},

	// 退出登录
	logout({
		commit
	}) {
		return new Promise((resolve, reject) => {
			http('login.loginOut', {}, 0).then(res => {
				if(res.code === 200) {
					commit('setToken', "");
					commit('setIsLogin', false);
					commit('setUserInfo', {});
					commit('setSelectedOrg', {});
					commit('setSelectedTeam', {});
					resolve()
				}
			});
		})
	}
}

const mutations = {
	setToken(state, payload) {
		state.token = payload;
		uni.setStorageSync("token", payload);
	},
	// 登录态
	setIsLogin(state, data) {
		state.isLogin = data;
		uni.setStorageSync('isLogin', data);
	},
	// 用户信息
	setUserInfo(state, data) {
		state.userInfo = data;
		uni.setStorageSync("userInfo", data);
	},
	// 当前选择的机构
	setSelectedOrg(state, data) {
		state.selectedOrg = data;
		uni.setStorageSync("selectedOrg", data);
	},
	// 当前选择的检查组
	setSelectedTeam(state, data) {
		state.selectedTeam = data;
		uni.setStorageSync("selectedTeam", data);
	},
}



export default {
	state,
	mutations,
	actions,
	getters
}
