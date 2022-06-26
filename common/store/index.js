import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import user from './modules/user.js'
import basic from './modules/basic.js'

const store = new Vuex.Store({
	modules: {
		user,
		basic
	}
})

export default store
