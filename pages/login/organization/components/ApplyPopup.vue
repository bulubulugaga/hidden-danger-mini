<template>
	<u-popup
		mode="center" 
		round="8rpx" 
		:show="isShow" 
		:custom-style="{width: '560rpx', height: 'auto'}"
		@close="this.isShow = false"
	>
		<view class="popup">
			<view class="title f36 black FB txt-center">申请加入机构</view>
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
					<u-form-item prop="userName" label="您的姓名" required>
						<view class="input u-flex-y-center round-4">
							<u-input v-model="formData.userName" border="none" placeholder="请输入" font-size="28rpx"  maxlength="10"></u-input>
						</view>
					</u-form-item>
					<u-form-item label="申请备注">
						<view class="input u-flex-y-center round-4">
							<u-input v-model="formData.remark" border="none" placeholder="请输入" font-size="28rpx" maxlength="20"></u-input>
						</view>
					</u-form-item>
				</u--form>
			</view>
			
			<u-line color="#E5E5E5" margin="48rpx 0 0"></u-line>
			<view class="my-popup-button" @click="handleSubmit">确定</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		data() {
			return {
				isShow: false,
				formData: { // 表单数据
					orgId: '',
					userName: '',
					remark: ''
				},
				rules: {
					// 字段名称
					userName: [{ required: true, message: '请输入您的姓名', trigger: ['blur'] }]
				}
			}
		},
		onReady() {
			// 防止小程序规则校验失败
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			handleSubmit() {
				// 提交信息
				this.$refs.uForm.validate().then(res => {
					this.$http('personel.applyAddOrg', this.formData, 0).then(res => {
						if(res.code === 200) {
							// 提交成功
							this.isShow = false;
							this.$emit('confirm');
						}
					})
				})
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
		padding: 10rpx 40rpx;
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
