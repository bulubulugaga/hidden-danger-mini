/**
 * 图片处理-预览图片
 * @param {Array} urls - 图片列表
 * @param {Number} current - 首个预览下标
 */
export function previewImage(urls = [], current = 0) {
	uni.previewImage({
		urls: urls,
		current: current,
		indicator: 'default',
		loop: true,
		fail(err) {
			console.log('previewImage出错', urls, err)
		},
	})
}

/**
 * 打电话
 * @param {String<Number>} phoneNumber - 数字字符串
 */
export function callPhone(phoneNumber = '') {
	let num = phoneNumber.toString()
	uni.makePhoneCall({
		phoneNumber: num,
		fail(err) {
			console.log('makePhoneCall出错', err)
		},
	});
}


function toDouble(m){
	//缺0补位
	return m < 10 ? '0' + m : m + '';
}
/**
 * 获取今天后的第day天
 * @param { number | String } day - 今天后的第几天
 * @param { String } type - 今天后的第几天
 */
export function getAfterDay(day, type) { 
	let today = new Date();
	if(day) {
		let targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * Number(day);
		today.setTime(targetday_milliseconds); //注意，这行是关键代码 
	}
	let data = {
		year: today.getFullYear().toString(),
		month: toDouble(today.getMonth()+1),
		day: toDouble(today.getDate()),
		hour: toDouble(today.getHours()),
		minute: toDouble(today.getMinutes()),
		second: toDouble(today.getSeconds()),
		week: today.getDay().toString()
	};
	
	// 根据type格式返回
	if(type == 'YY-MM-DD') {
		return data.year + '-' + data.month + '-' + data.day;
	}
	else {
		//其他类型……未设置，暂时返回时间对象
		return data;
	}
}

