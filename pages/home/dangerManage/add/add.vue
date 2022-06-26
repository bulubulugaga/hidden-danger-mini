<template>
	<view>
		<!-- 隐患库引导 -->
		<view class="library u-flex-y-center u-flex-between bg-white round" @click="toDangerLibrary">
			<view class="left u-flex-xy-center">
				<u-icon
					name="/static/images/home/book.png" 
					width="52rpx" 
					height="52rpx"
					label="隐患库"
					label-size="34rpx"
					label-color="#1FB3F7"
					space="10rpx"
				></u-icon>
			</view>
			<u-icon
				name="arrow-right" 
				size="30rpx" 
				color="#C7C7CC"
				label="去引用隐患库内容"
				label-pos="left"
				label-size="28rpx"
				label-color="#B2B2B2"
				space="10rpx"
			></u-icon>
		</view>
		
		<!-- 表单 -->
		<hidden-danger-from ref="dangerFrom"></hidden-danger-from>
		
		
		<!-- 按钮 -->
		<view class="footer">
			<button hover-class="none" @click="handleSubmit">确定</button>
		</view>
	</view>
</template>

<script>
	import HiddenDangerFrom from '@/components/hiddenDangerFrom/HiddenDangerFrom.vue'
	import { mapGetters } from 'vuex';
	export default {
		components: {
			HiddenDangerFrom
		},
		computed: {
			...mapGetters(['selectedOrg', 'selectedTeam'])
		},
		methods: {
			toDangerLibrary() {
				// 隐患库
				this.$Router.push('/pages/home/dangerManage/library/library');
			},
			handleSubmit() {
				// 提交
				this.$refs.dangerFrom.$refs.uForm.validate().then(res => {
					const formData = this.$refs.dangerFrom.formData;
					const picUrls = formData.picUrls.length ? formData.picUrls.join(',') : '';
					if(!formData.limitTime){
						delete formData.limitTime;
					}
					this.$http('home.createDanger', {
						...this.$refs.dangerFrom.formData,
						picUrls,
						orgId: this.selectedOrg.id,
						groupId: this.selectedTeam.value,
					}, 0).then(res => {
						if(res.code === 200) {
							this.$Router.back();
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.library {
		width: 702rpx;
		height: 88rpx;
		margin: 34rpx auto;
		overflow: hidden;
		padding-right: 30rpx;
		.left {
			width: 232rpx;
			height: 88rpx;
			background: #DFF4FE;
		}
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
			z-index: 98;
		}
	}
</style>
