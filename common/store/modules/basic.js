const state = {
	logo: '/static/logo.png',
	name: '安全检查智能管理平台'
}

const getters = {
	logo: state => state.logo,
	name: state => state.name,
}

export default {
	state,
	getters
}
