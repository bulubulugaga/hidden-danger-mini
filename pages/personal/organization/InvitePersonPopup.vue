<template>
	<u-popup
		mode="center" 
		round="8rpx" 
		:show="true" 
		:custom-style="{width: '560rpx', height: 'auto'}"
		@close="closePopup"
	>
		<view class="popup">
			<view class="title f36 black FB txt-center">邀请人员</view>
			<!-- 表单 -->
			<view class="form">
				<u--form  
					ref="uForm" 
					error-type="toast" 
					label-position="top"
					label-width="300rpx"
					:model="formData" 
					:rules="rules" 
					:label-style="{ fontSize: '34rpx', color: '#000' }"
				>
					<u-form-item prop="userName" label="姓名" required>
						<view class="input u-flex-y-center round-4">
							<u-input v-model="formData.userName" border="none" placeholder="请输入姓名" font-size="28rpx" maxlength="10"></u-input>
						</view>
					</u-form-item>
					<u-form-item prop="phone" label="手机号" required>
						<view class="input u-flex-y-center round-4">
							<u-input v-model="formData.phone" border="none" placeholder="请输入手机号" font-size="28rpx" type="number"></u-input>
						</view>
					</u-form-item>
					<view class="f26 c999 txt-center">系统将对该手机号发送邀请短信</view>
				</u--form>
			</view>
			
			<u-line color="#E5E5E5" margin="30rpx 0 0"></u-line>
			<view class="my-popup-button" @click="handleSubmit">确定</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		props: {
			orgId: {
				type: String,
				default: ''
			}
		},
		data() {
			return {
				formData: { // 表单数据
					userName: '',
					phone: '',
				},
				rules: {
					// 字段名称
					userName: [{ required: true, message: '请输入姓名', trigger: ['blur'] }],
					phone: [
						{ required: true, message: '请输入手机号', trigger: ['blur'] },
						{ validator: (rule, value, callback) => this.$u.test.mobile(value), message: '手机号码不正确', trigger: ['change','blur'] }
					]
				}
			}
		},
		onReady() {
			// 防止小程序规则校验失败
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			handleSubmit() {
				// 确认
				this.$refs.uForm.validate().then(res => {
					this.$http('personel.inviteOrgUser', {
						orgId: this.orgId,
						...this.formData
					}, 0).then(res => {
						if(res.code === 200) {
							uni.showToast({
								icon: 'success',
								title: '已提交'
							})
							this.$emit('submit');
						}
					})
				})
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
	.title {
		margin: 50rpx 0 20rpx;
	}
	.form {
		padding: 0 40rpx;
	}
	.input {
		width: 466rpx;
		height: 68rpx;
		background-color: #F4F4F4;
		padding: 0 34rpx;
		margin-top: 4rpx;
	}
	.my-popup-button {
		line-height: 100rpx;
	}
}
</style>
