/**
 * 接口列表文件
 */
import login from './modules/login.js'
import home from './modules/home.js'
import message from './modules/message.js'
import personel from './modules/personel.js'
export default {

	/** 公共 ↓ **/
	common: {
		upload: {
			url: "sysFileInfo/upload",
			method: "POST",
			// desc: '上传图片'
		}
	},
	
	...login,
	...home,
	...message,
	...personel,

};
