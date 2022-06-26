// 登录相关
export default {
	login: {
		wxLogin: {
			url: 'user/weChatLogin',
			method: 'POST',
			ignoreLogin: true,   // 无需登录
			// desc: '微信登录'
		},
		
		sendCode: {
			url: 'user/verificationCode',
			method: 'POST',
			ignoreLogin: true,
			// desc: '发送验证码'
		},
		phoneLogin: {
			url: 'user/phoneLogin',
			method: 'POST',
			ignoreLogin: true,
			// desc: '手机号登录'
		},
		
		loginOut: {
			url: 'user/logout',
			// desc: '退出登录'
		}
	}
}