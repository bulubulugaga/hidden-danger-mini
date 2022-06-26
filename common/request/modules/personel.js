// 个人相关
export default {
	personel: {
		// 检查组
		teamList: {
			url: "group/list",
			// desc: '检查组列表'
		},
		modelList: {
			url: "exportModel/list",
			// desc: '模板列表'
		},
		userList: {
			url: "group/orgUserList",
			// desc: '用户信息列表'
		},
		createTeam: {
			url: "group/addItem",
			method: "POST",
			// desc: '创建检查组'
		},
		teamDetail: {
			url: "group/detail",
			// desc: '检查组详情'
		},
		getUserList: {
			url: "group/userList",
			// desc: '搜索检查组用户'
		},
		updateTeam: {
			url: "group/editItem",
			method: "POST",
			// desc: '修改检查组'
		},
		
		
		// 我的机构
		getOrgList: {
			url: "org/weChatOrgList",
			// desc: '机构列表'
		},
		getOrgDetail: {
			url: "org/detail",
			// desc: '机构详情'
		},
		approveOrgApply: {
			url: "userOrg/accept",
			method: "POST",
			// desc: '审批机构申请用户'
		},
		frozenOrgUser: {
			url: "userOrg/frozen",
			method: "POST",
			// desc: '冻结、解除冻结机构用户'
		},
		updateOrg: {
			url: "org/edit",
			method: "POST",
			// desc: '修改机构信息'
		},
		inviteOrgUser: {
			url: "userOrg/add",
			method: "POST",
			// desc: '邀请用户'
		},
		getOrgUser: {
			url: "user/orgUserList",
			// desc: '机构下用户'
		},
		createOrg: {
			url: "org/add",
			method: "POST",
			// desc: '创建机构'
		},
		getSearchOrg: {
			url: 'org/selectOneOrg',
			// desc: '搜索机构'
		},
		applyAddOrg: {
			url: 'userOrg/join',
			method: "POST",
			// desc: '申请加入机构'
		},
		
		
		
		// 个人信息
		getUserInfo: {
			url: "user/findMe",
			// desc: '获取用户信息'
		},
		updateUserInfo: {
			url: "user/editMyself",
			method: "POST",
			// desc: '修改用户信息'
		},
	}
}