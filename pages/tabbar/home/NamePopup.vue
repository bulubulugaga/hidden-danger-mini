<template>
	<u-popup
		mode="center" 
		round="8rpx" 
		:show="true" 
		:closeOnClickOverlay="false"
		:custom-style="{width: '560rpx', height: 'auto'}"
	>
		<view class="name-popup txt-center">
			<view class="title f36">为便于机构人员查找<br />请输入您的姓名</view>
			<view class="input round u-flex u-flex-items-center">
				<u--input
					placeholder="请输入您的姓名"
					border="none"
					shape="circle"
					maxlength="10"
					fontSize="28rpx"
					v-model="personName"
				></u--input>
			</view>
			<u-line color="#E5E5E5" margin="0 0 0"></u-line>
			<view class="my-popup-button" @click="handleSubmit">确定</view>
		</view>
	</u-popup>
</template>

<script>
	import { mapActions } from 'vuex';
	export default {
		data() {
			return {
				personName: ''
			}
		},
		methods: {
			...mapActions(['getUserInfo']),
			handleSubmit() {
				// 确认
				if(!this.personName) {
					uni.$u.toast('请输入姓名');
					return false;
				}
				console.log(this.personName);
				this.$http('personel.updateUserInfo', {
					name: this.personName
				}, 0).then(res => {
					if(res.code === 200) {
						// 更新用户信息
						this.getUserInfo();
						this.$emit('handleComfirm');
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.name-popup {
	.title {
		margin: 50rpx 0 40rpx;
	}
	.input {
		width: 466rpx;
		height: 68rpx;
		background-color: #F4F4F4;
		margin: 0 auto 50rpx;
		padding-left: 40rpx;
	}
	.my-popup-button {
		line-height: 100rpx;
	}
}
</style>
