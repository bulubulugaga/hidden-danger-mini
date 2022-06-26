// 常用的一些对应关系


// 隐患状态
export const dangerStatusList = [
	{ label: '待整改', value: 1 },
	{ label: '待复核', value: 2 },
	{ label: '已消除', value: 3 }
]
// 隐患状态
export const dangerStatus = {
	1: '待整改',
	2: '待复核',
	3: '已消除'
}
// 隐患状态颜色
export const dangerStatusColor = {
	1: '#FC4C2F',
	2: '#FF8000',
	3: '#36D68D'
}


// 隐患级别
export const dangerLevelList = [
	{ label: '一般隐患', value: 1 },
	{ label: '重大隐患', value: 2 }
]
// 隐患级别名字
export const dangerLevel = {
	1: '一般隐患',
	2: '重大隐患'
}
// 隐患级别颜色
export const dangerLevelColor = {
	1: '#1FB3F7',
	2: '#FC4C2F',
}


// 整改期限
export const dangerLimiteList = [
	{ label: '立即整改', value: 1 },
	{ label: '期限整改', value: 2 }
]
// 整改期限名字
export const dangerLimite = {
	1: '立即整改',
	2: '期限整改'
}