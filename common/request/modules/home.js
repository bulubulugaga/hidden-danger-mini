// 首页相关
export default {
	home: {
		homeNumber: {
			url: "hiddenDanger/sumQty",
			// desc: '首页数量统计'
		},
		homeDangerList: {
			url: "hiddenDanger/orgList",
			// desc: '首页隐患列表'
		},
		
		
		dangerList: {
			url: "hiddenDanger/list",
			// desc: '隐患列表'
		},
		dangerDetail: {
			url: "hiddenDanger/detail",
			// desc: '隐患详情'
		},
		dangerLibrary: {
			url: "basis/basisList",
			// desc: '隐患库列表'
		},
		dangerIndustry: {
			url: "industry/industryTreeList",
			// desc: '隐患库行业'
		},
		createDanger: {
			url: "hiddenDanger/addItem",
			method: "POST",
			// desc: '新增隐患'
		},
		checkDanger: {
			url: "rectificationRecord/addCheck",
			method: "POST",
			// desc: '整改隐患'
		},
		reviewDanger: {
			url: "rectificationRecord/addReview",
			method: "POST",
			// desc: '复核隐患'
		},
		chReDetail: {
			url: "rectificationRecord/detail",
			// desc: '整改复核详情'
		},
		
		
		export: {
			url: "export/addItem",
			method: "POST",
			// desc: '导出检查表'
		},
		getExportList: {
			url: "export/list"
			// desc: '检查表记录'
		},
		downloadFile: {
			url: "sysFileInfo/download",
			ignoreLogin: true,
			// desc: '下载'
		},
		getFilePath: {
			url: "export/getFilePath",
			// desc: '获取文件地址'
		},
		getExportDangerList: {
			url: "hiddenDanger/idsList",
			// desc: '获取检查表详情'
		}
	}
}