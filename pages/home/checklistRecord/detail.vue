<template>
	<view>
		<!-- 图片 -->
		<!-- <view class="img-box u-flex-xy-center">
			<u--image :src="img" width="100vw" height="100vh" mode="aspectFit"></u--image>
		</view> -->
		
		<!-- 隐患列表 -->
		<hidden-danger-list :list="list" :toDetailAble="false"></hidden-danger-list>
		
		<!-- 按钮 -->
		<view class="footer">
			<button hover-class="none" @click="toCodePreview">导出</button>
		</view>
	</view>
</template>

<script>
	import HiddenDangerList from '@/components/hiddenDangerList/HiddenDangerList.vue'
	export default {
		components: {
			HiddenDangerList
		},
		data() {
			return {
				img: 'http://notes.seeyou.ink/toc/images/test/user_header.jpg',
				list: [],
				loading: false
			}
		},
		onLoad() {
			this.getDetail();
		},
		methods: {
			getDetail() {
				this.$http('home.getExportDangerList', { 
					ids: this.$Route.query.id,
				}, 0).then(res => {
					if(res.code === 200) {
						this.list = res.data;
					}
				})
			},
			toCodePreview() {
				// 二维码预览
				if(this.loading) return;
				this.loading = true;
				this.$http('home.getFilePath', {
					id: this.$Route.query.id
				}, 0).then(res => {
					if(res.code === 200) {
						uni.showToast({
							title: '已导出',
							icon: 'success'
						})
						const _this = this;
						setTimeout(() => {
							this.$Router.push({
								path: '/pages/home/exportChecklist/codePreview/codePreview',
								query: { fileData: encodeURIComponent(JSON.stringify(res.data)) },
							});
							_this.loading = false;
						}, 1000)
					} else {
						this.loading = false;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.img-box {
		height: calc(100vh - 94rpx - 44px);
	}
	.footer {
		height: 94rpx;
		button {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			line-height: 94rpx;
			border-radius: 0;
			z-index: 999999999;
		}
	}
</style>
