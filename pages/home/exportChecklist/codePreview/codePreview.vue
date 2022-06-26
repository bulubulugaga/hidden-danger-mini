<template>
	<view>
		<!-- 二维码 -->
		<!-- <view class="code-img u-flex-x-center">
			<u--image :src="url" width="344rpx" height="344rpx"></u--image>
			<uqrcode ref="uQRCode" :text="text" size="172" />
		</view>
		<view class="tip-txt f34 txt-center">受检方人员微信扫码后复制链接<br />可通过“文件传输助手”在电脑下载打印</view> -->
		
		<!-- 链接 -->
		<view class="link-txt f34">{{ fileData.filePath }}</view>
		
		<!-- 按钮 -->
		<button class="link-button f34" hover-class="none" @click="handleCopy">复制链接</button>
		<view class="f34 c666 txt-center" @click="handleDownload">下载文件到手机</view>
		<view class="f28 c999 txt-center" @click="handleDownload">(进入预览页，点击右上角...可选择保存到手机)</view>
		
	</view>
</template>

<script>
	import { CODE_URL } from '@/env'
	export default {
		data() {
			return {
				text: '',
				fileData: {}
			}
		},
		onLoad() {
			this.fileData = JSON.parse(decodeURIComponent(this.$Route.query.fileData));
			this.text = `${CODE_URL}?a=1&url=${this.fileData.filePath}&fileId=${this.fileData.id}&title=${this.fileData.fileOriginName}`
		},
		methods: {
			handleCopy() {
				// 复制
				uni.setClipboardData({
				    data: this.fileData.filePath,
					fail: err => {
						uni.$u.toast('复制失败：' + err.errMsg);
					}
				});
			},
			handleDownload() {
				// 下载到手机
				// this.$http('home.downloadFile', { id: this.fileData.id }, 0);
				
				uni.showLoading({
					title: '下载中...'
				})
				// 由于直接下载有问题，所以考虑先预览，在预览页进项下载
				uni.downloadFile({
					// 下载至小程序临时文件
					url: this.fileData.filePath,
					filePath: wx.env.USER_DATA_PATH + '/' + this.fileData.fileOriginName,  //指定文件下载后存储的路径（本地路径）
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
	.code-img {
		margin: 194rpx 0 40rpx;
	}
	.tip-txt {
		line-height: 48rpx;
	}
	.link-txt {
		font-size: 48rpx;
		word-break: break-all;
		padding: 240rpx 64rpx 120rpx;
	}
	.link-button {
		width: 670rpx;
		height: 94rpx;
		line-height: 94rpx;
		margin: 92rpx auto 60rpx;
	}
</style>
