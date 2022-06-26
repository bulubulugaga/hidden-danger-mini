//上传图片
import { API_URL } from '@/env'
export function uploadFile(data) {
	//data传数组
	return new Promise((resolve, reject) => {
		let images = [];
		let i = 1;
		data.forEach(item => {
			//循环数组
			uni.uploadFile({
				url: API_URL + 'sysFileInfo/upload',
				filePath: item.thumb,
				name: 'file',
				header: {
					token: uni.getStorageSync('token')
				},
				success(res) {
					if(JSON.parse(res.data).code === 200) {
						// 上传成功
						images.push(JSON.parse(res.data).data);
						//上传完后才返回
						if(i == data.length) 
							resolve(images);
					}
					else {
						uni.$u.toast('上传图片失败');
					}
				},
				fail(err) {
					console.log(err);
					uni.$u.toast(err.errMsg);
				},
				complete() {
					i++;
				}
			});
		})
	})
}