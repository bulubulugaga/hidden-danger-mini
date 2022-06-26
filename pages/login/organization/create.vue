<template>
	<view>
		<view class="tip">
			<view class="f48 FB">创建机构需知</view>
			<view class="list f28">
				1.机构创建后您将成为新机构的管理员<br />
				2.其他人员可以通过搜索机构名申请加入<br />
				3.机构创建后将拥有<text class="strong f34 FB">3天试用</text>时间，到期后需联系系统管理员购买使用
			</view>
		</view>
		
		<!-- 表单 -->
		<view class="form bg-white">
			<u--form :model="formData" :rules="rules" ref="uForm" errorType="toast">
				<u-form-item borderBottom prop="name" >
					<u-input v-model="formData.name" border="none" placeholder="请输入" fontSize="34rpx" maxlength="50">
						<u--text text="机构名称" slot="prefix" margin="0 36rpx 0 0" size="34rpx" color="#000"></u--text>
					</u-input>
				</u-form-item>
				<u-form-item prop="code" ref="item1">
					<u-input v-model="formData.code" border="none" placeholder="请输入" fontSize="34rpx" maxlength="50">
						<u--text text="统一社会信用代码" slot="prefix" margin="0 36rpx 0 0" size="34rpx" color="#000"></u--text>
					</u-input>
				</u-form-item>
			</u--form>
		</view>
		
		<!-- 按钮 -->
		<view class="footer">
			<button class="button" hover-class="none" @click="onSubmit">确定</button>
		</view>
	</view>
</template>

<script>
	import { mapMutations } from 'vuex'
	export default {
		data() {
			return {
				formData: {
					name: '',
					code: ''
				},
				rules: {
					name: [{ required: true, message: '请输入机构名称', trigger: ['blur'] }],
					code: [
						{ required: true, message: '请输入统一社会信用代码', trigger: ['blur'] },
						{ pattern: /^[0-9a-zA-Z]*$/g, transform: value => String(value), message: '只能包含字母或数字' }
					]
				},
				loading: false   
			}
		},
		onLoad() {
			// 防止小程序规则校验失败
			this.$refs.uForm.setRules(this.rules);
		},
		methods: {
			...mapMutations(['setSelectedOrg']),
			onSubmit() {
				// 提交
				if(this.loading) {
					return;
				}
				this.$refs.uForm.validate().then(res => {
					this.$http('personel.createOrg', this.formData, 0).then(res => {
						if(res.code === 200) {
							const _this = this;
							switch(res.data.resultType) {
								// 创建成功
								case 0:
									if(this.$Route.query.showPopup) {
										// 弹窗确认是否跳转首页
										uni.showModal({
											title: '提示',
											content: '机构创建成功，是否切换至新机构?',
											success: subRes => {
												if (subRes.confirm) {
													// 确认
													_this.setSelectedOrg(res.data);
													_this.$Router.pushTab('/pages/tabbar/home/home');
												} else if (subRes.cancel) {
													_this.$Router.back();
												}
											}
										})
									} else {
										uni.showToast({ title: '创建成功', icon: 'success' });
										_this.loading = true;
										_this.setSelectedOrg(res.data);
										setTimeout(() => {
											_this.$Router.pushTab('/pages/tabbar/home/home');
											_this.loading = false;
										}, 2000);
									}
								break;
								// 机构名重复
								case 1: 
								case 2:
									_this.loading = true;
									uni.$u.toast(res.data.resultMessage);
									setTimeout(() => {
										_this.$Router.push({ 
											path: '/pages/login/organization/apply', 
											query: { create: true, orgInfo: encodeURIComponent(JSON.stringify(res.data)) 
										} });
										_this.loading = false;
									}, 1000);
									break;
							}
						} else {
							this.loading = false;
						}
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	.tip {
		width: 100%;
		height: 328rpx;
		background-color: #FFEDEA;
		margin: 16rpx 0 26rpx;
		padding: 40rpx 24rpx;
		.list {
			line-height: 46rpx;
			margin-top: 20rpx;
		}
		.strong {
			color: #FC4C2F;
		}
	}
	.form {
		padding: 0 24rpx;
		border-top: 2rpx solid #E5E5E5;
		border-bottom: 2rpx solid #E5E5E5;
	}
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 750rpx;
		.button {
			line-height: 94rpx;
			border-radius: 0;
		}
	}
</style>
 