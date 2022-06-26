<template>
	<view class="txt-center">
		<view class="link-txt f34">{{ link }}</view>
		
		<!-- 按钮 -->
		<button class="link-button f34" hover-class="none" @click="handleCopy">复制链接</button>
		<view class="f34 c666 txt-center" @click="handleDownload">下载文件到手机</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				link: ''
			}
		},
		onLoad(query) {
			// const q = decodeURIComponent(query.q);
			const q = '11111?url=url&fileId=fileId&title=title';
			this.link = q.split('?url=')[1].split('&fileId=')[0];
			this.fileId = q.split('&fileId=')[1].split('&title=')[0];
			this.title = q.split('&title=')[1];
			
			uni.setNavigationBarTitle({
				title: this.title
			})
		},
		methods: {
			handleCopy() {
				// 复制
				uni.setClipboardData({
				    data: this.link
				});
			},
			handleDownload() {
				// 下载到手机
				uni.showLoading({
					title: '下载中...'
				})
				uni.downloadFile({
					// 下载至小程序临时文件
					url: this.link,
					filePath: wx.env.USER_DATA_PATH + '/' + this.title,  //指定文件下载后存储的路径（本地路径）
					success: res => { 
						// 打开文件预览
						uni.openDocument({
							filePath: res.filePath,  //文件路径，可通过 downFile 获得
							showMenu: true,//	是否显示右上角菜单
							success: () => {
								console.log('打开文档成功');
							},
							fail: err => {
								uni.$u.toast('下载失败：' + err.errMsg);
							}
						});
					},
					fail: error => {
						uni.$u.toast('下载失败：' + error.errMsg);
					},
					complete: () => {
						uni.hideLoading();
					}
				});
			}
		}
	}
</script>

<style>
	.link-txt {
		font-size: 48rpx;
		word-break: break-all;
		padding: 300rpx 64rpx 240rpx;
	}
	.link-button {
		width: 670rpx;
		height: 94rpx;
		line-height: 94rpx;
		margin: 0 auto 60rpx;
	}
</style>
