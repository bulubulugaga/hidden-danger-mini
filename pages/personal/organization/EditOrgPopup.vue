<template>
	<u-popup
		mode="center" 
		round="8rpx" 
		:show="isShow" 
		:custom-style="{width: '560rpx', height: 'auto'}"
		@close="this.isShow = false"
	>
		<view class="popup">
			<view class="title f36 black FB txt-center">修改机构信息</view>
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
					<u-form-item prop="name" label="机构名称" required>
						<view class="input u-flex-y-center round-4">
							<u-input v-model="formData.name" border="none" placeholder="请输入机构名称" font-size="28rpx" maxlength="50"></u-input>
						</view>
					</u-form-item>
					<u-form-item prop="code" label="统一社会信用代码" required>
						<view class="input u-flex-y-center round-4">
							<u-input v-model="formData.code" border="none" placeholder="请输入统一社会信用代码" font-size="28rpx" maxlength="50"></u-input>
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
	import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				isShow: false,
				formData: { // 表单数据
					id: '',
					name: '',
					code: '',
				},
				rules: {
					// 字段名称
					name: [{ required: true, message: '请输入机构名称', trigger: ['blur'] }],
					code: [
						{ required: true, message: '请输入统一社会信用代码', trigger: ['blur'] },
						{ pattern: /^[0-9a-zA-Z]*$/g, transform: value => String(value), message: '统一社会信用代码只能包含字母或数字'}
					]
				}
			}
		},
		computed: {
			...mapGetters(['selectedOrg'])
		},
		onReady() {
			// 防止小程序规则校验失败
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			...mapMutations(['setSelectedOrg']),
			handleSubmit() {
				// 修改机构信息
				this.$refs.uForm.validate().then(res => {
					this.$http('personel.updateOrg', this.formData, 0).then(res => {
						if(res.code === 200) {
							// 修改成功
							this.isShow = false;
							// 如果修改的是当前选中的机构
							if(this.selectedOrg.id === this.formData.id) {
								this.setSelectedOrg({
									...this.selectedOrg,
									...this.formData
								})
							}
							uni.showToast({
								icon: 'success',
								title: '已修改'
							})
							// 修改页面数据信息
							this.$emit('editOrg', this.formData);
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
