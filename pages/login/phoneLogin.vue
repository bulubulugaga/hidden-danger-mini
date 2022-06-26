<template>
	<view>
		<view class="title FB f40 black">手机验证码登录</view>

		<!-- 表单内容 -->
		<view class="phone-form">
			<u--form :model="formData" :rules="rules" ref="uForm" errorType="toast">
				<u-form-item borderBottom prop="phone">
					<!-- 插件使用label时无法修改label样式，故用插槽 -->
					<u-input v-model="formData.phone" border="none" placeholder="请输入手机号码" fontSize="34rpx" type="number">
						<u--text text="中国(+86)" slot="prefix" margin="0 20rpx 0 0" size="34rpx" color="#333333"></u--text>
					</u-input>
				</u-form-item>
				<u-gap height="34rpx"></u-gap>
				<u-form-item borderBottom>
					<u-input v-model="formData.verificationCode" border="none" placeholder="请输入验证码" fontSize="34rpx"></u-input>
					<view slot="right" class="f34 code-tip" @click="getCode" :style="{ color: codeTip ? '#666' : '#333' }">
						{{ codeTip || '获取验证码' }}
					</view>
				</u-form-item>
			</u--form>
		</view>
		
		<button class="submit" hover-class="none" @click="onSubmit">登录</button>
	</view>
</template>

<script>
	import { mapActions } from 'vuex';
	export default {
		data() {
			return {
				formData: { // 表单数据
					phone: '',
					verificationCode: '',
				},
				codeTip: '', // 验证码提示
				rules: {
					// 字段名称
					phone: [
						{ required: true, message: '请输入手机号', trigger: ['blur'] }, 
						{ validator: (rule, value, callback) => this.$u.test.mobile(value), message: '手机号码不正确', trigger: ['blur'] }
					]
				}
			}
		},
		onLoad() {
			// 防止小程序规则校验失败
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			...mapActions(['login']),
			getCode() {
				// 获取验证码
				if (this.codeTip) {
					return;
				}
				this.$refs.uForm.validate().then(res => {
					this.$http('login.sendCode', this.formData, '正在获取验证码...').then(res => {
						if(res.code === 200) {
						uni.$u.toast('验证码已发送');
						// 倒计时60s
						let time = 60;
						this.codeTip = `${time}s后重试`;
						let timer = setInterval(() => {
							this.codeTip = `${--time}s后重试`;
							if (time == 0) {
								clearInterval(timer);
								this.codeTip = ''
							}
						}, 1000)}
					})
				})
			},
			onSubmit() {
				// 提交
				this.$refs.uForm.validate().then(res => {
					if(this.formData.verificationCode.length !== 6) {
						uni.$u.toast('请输入6位验证码');
						return;
					}
					this.login({
						...this.formData,
						type: 'phone'
					})
				})
			}
		}
	}
</script>

<style>
	page {
		background-color: #FFFFFF;
	}
	.title {
		padding: 80rpx 80rpx 60rpx;
	}
	.phone-form {
		padding: 0 80rpx;
	}
	.code-tip {
		width: 200rpx;
	}
	.submit {
		width: 670rpx;
		height: 94rpx;
		line-height: 94rpx;
		margin: 66rpx auto;
	}
</style>
