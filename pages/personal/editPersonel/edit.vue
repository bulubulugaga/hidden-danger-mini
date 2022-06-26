<template>
	<view>
		<view class="form bg-white">
			<u--form ref="uForm" error-type="toast" :model="formData" :rules="rules">
				<u-form-item prop="avatar">
					<view class="u-flex-y-center" @click="toChooseAvar">
						<view class="f34 u-flex-fill">头像</view>
						<u-avatar 
							mode="aspectFill" 
							size="64rpx" 
							default-url="/static/images/user/default_avatar.png" 
							:src="avatarUrl" 
						></u-avatar>
						<view class="arrow"><u-icon name="arrow-right" color="#C7C7CC" size="28rpx"></u-icon></view>
					</view>
				</u-form-item>
				<u-form-item prop="name">
					<u-input 
						v-model="formData.name" 
						border="none" 
						placeholder="请输入" 
						font-size="34rpx" 
						color="#b2b2b2" 
						maxlength="10" 
						input-align="right"
					>
						<u--text text="姓名" slot="prefix" margin="0 36rpx 0 0" size="34rpx" color="#333"></u--text>
					</u-input>
				</u-form-item>
			</u--form>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="button">
				<button hover-class="none" @click="handleSubmit">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	export default {
		data() {
			return {
				formData: {
					avatar: '',   // 头像id
					name: ''
				},
				avatarUrl: '',
				rules: {
					name: [{ required: true, message: '请输入姓名', trigger: ['blur'] }]
				}
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad() {
			this.formData = {
				avatar: this.userInfo.avatar,
				name: this.userInfo.name
			}
			this.avatarUrl = this.userInfo.avatarUrl;
		},
		methods: {
			toChooseAvar() {
				const _this = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['compressed'],
				    success: function (res) {
						_this.$Router.push({ path: '/pages/personal/editPersonel/chooseAvar/chooseAvar', query: { url: res.tempFilePaths } });
					}
				});
			},
			handleSubmit() {
				// 提交个人信息
				this.$refs.uForm.validate().then(res => {
					this.$http('personel.updateUserInfo', this.formData, 0).then(res => {
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
	.form {
		padding: 20rpx 54rpx 20rpx 30rpx;
		.arrow {
			margin: 0 -40rpx 0 10rpx;
		}
	}
	.footer {
		height: 94rpx;
		.button {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 94rpx;
			button {
				line-height: 94rpx;
				border-radius: 0;
			}
		}
	}
</style>
