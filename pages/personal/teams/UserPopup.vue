<template>
	<u-popup
		mode="center" 
		round="8rpx" 
		:show="true" 
		:custom-style="{width: '560rpx', height: 'auto'}"
		@close="closePopup"
	>
		<view class="popup txt-center">
			<view class="title f36 black FB">成员信息</view>
			<view class="u-flex-x-center">
				<u-avatar :src="avatar" size="146rpx" default-url="/static/images/user/default_avatar.png"></u-avatar>
			</view>
			<view class="name f36 FB">{{ info.userName }}</view>
			<view class="f34 main-blue FB">{{ info.phone }}</view>
			
			<u-line color="#E5E5E5" margin="100rpx 0 0"></u-line>
			<view class="footer-button u-flex u-flex-between">
				<button class="bg-white black" @click="closePopup">确定</button>
				<button @click="call(info.phone)">拨打电话</button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	import { callPhone } from '@/common/utils/tools.js'
	export default {
		props: {
			info: {
				type: Object,
				default() {
					return {}
				}
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			call(phone) {
				console.log(this.info)
				callPhone(phone);
			},
			closePopup() {
				// 关闭弹窗
				this.$emit('closePopup');
			}
		}
	}
</script>

<style lang="scss" scoped>
.popup {
	overflow: hidden;
	.title {
		margin: 50rpx 0 40rpx;
	}
	.name {
		margin: 20rpx 0 12rpx;
	}
	.footer-button {
		button {
			width: 50%;
			line-height: 100rpx;
			border-radius: 0;
		}
	}
}
</style>
