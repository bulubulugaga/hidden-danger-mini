<template>
	<view>
		<image class="logo" mode="aspectFit" :src="logo"></image>
		<view class="f36 txt-center FB">{{ name }}</view>

		<button class="wx-login" hover-class="none" @click="wxLogin">微信快捷登录</button>
		<view class="f36 c666 txt-center" @click="toPhoneLogin">手机账号登录</view>

		<!-- 授权手机号弹窗 -->
		<u-popup 
			mode="center" 
			round="10rpx" 
			:show="showPopup" 
			:closeOnClickOverlay="false"
			:custom-style="{width: '560rpx', height: '546rpx'}"
		>
			<view class="wx-popup txt-center">
				<view class="title f36 FB">提示</view>
				<view class="f34">为了更好的服务<br />请开启微信手机号授权</view>
				<button class="popup-button phone-auth bg-main-green" hover-class="none" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">授权登录手机号</button>
				<button class="popup-button cancel main-green" hover-class="none" @click="handleCancel">拒绝</button>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	export default {
		data() {
			return {
				showPopup: false, // 是否展示授权手机弹窗
				loading: false
			}
		},
		computed: {
			...mapGetters(['logo', 'name'])
		},
		onLoad() {
			// 隐藏返回首页
			uni.hideHomeButton();
		},
		methods: {
			...mapActions(['login']),
			wxLogin() {
				/*
					1. 获取用户信息
					2. 弹窗展示登录
					3. 获取手机号
					4. 登录，手机code和微信登录code
					注意：只要拒绝就从获取用户信息开始重新操作；选择手机验证码登录，不传用户信息
				*/
			   if(this.loading) {
				   return;
			   }
			   this.loading = true;
				uni.showLoading({
					title: '获取用户信息中...'
				})
				uni.getUserProfile({
					desc: '用于完善用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
					success: (res) => {
						this.showPopup = true;
						uni.hideLoading();
						this.loading = false;
					},
					fail: err => {
						console.log(err.errMsg);
						uni.hideLoading();
						this.loading = false;
					}
				})
			},
			handleCancel() {
				// 取消手机授权
				this.showPopup = false;
			},
			getPhoneNumber(e) {
				this.showPopup = false;
				uni.showLoading({
					title: '获取手机号...'
				})
				if(!e.detail.code) {
					// 获取手机号失败
					uni.$u.toast('获取手机号失败，请重试或者使用手机号登录');
					uni.hideLoading();
					return;
				}
				const _this = this;
				uni.login({
					success(res) {
						uni.hideLoading();
						if (res.code) {
							//发起网络请求，登录
							// console.log({
							// 	loginCode: res.code,
							// 	phoneCode: e.detail.code
							// })
							_this.login({
								type: 'wx',
								loginCode: res.code,
								phoneCode: e.detail.code,
							})
						} else {
							console.log('登录失败！' + res.errMsg);
						}
					},
					fail(err) {
						uni.hideLoading();
						console.log('登录失败！' + err);
					}
				})
			},
			toPhoneLogin() {
				// 跳转手机登录页
				this.$Router.push('/pages/login/phoneLogin');
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}
	.logo {
		display: block;
		margin: 110rpx auto 40rpx;
		height: 228rpx;
	}
	.wx-login {
		width: 670rpx;
		height: 94rpx;
		line-height: 94rpx;
		margin: 110rpx auto 50rpx;
	}
	
	/* 微信登录获取手机号提示弹窗 */
	.wx-popup {
		.title {
			margin: 44rpx 0 40rpx;
		}
		.popup-button {
			width: 456rpx;
			line-height: 72rpx;
			font-size: 34rpx;
			margin: 32rpx auto;
			letter-spacing: 2rpx;
		}
		.phone-auth {
			margin-top: 80rpx;
		}
		.cancel {
			background-color: rgba(0, 0, 0, .05);
		}
	}
</style>
