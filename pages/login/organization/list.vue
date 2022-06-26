<template>
	<!-- 多个机构 -->
	<view v-if="orgList.length">
		<!-- 机构列表 -->
		<org-list :orgList="orgList"></org-list>
		<!-- 提示 -->
		<view class="tip f26 txt-center c999">使用咨询：“微信公众号”园区EHS云管家</view>
		<!-- 按钮 -->
		<u-gap height="110rpx"></u-gap>
		<view class="footer">
			<u-row>
				<u-col span="6">
					<button class="button bg-white c666" @click="toApplyOrg">申请加入机构</button>
				</u-col>
				<u-col span="6">
					<button class="button" @click="toCreateOrg">创建机构</button>
				</u-col>
			</u-row>
		</view>
	</view>
	
	<!-- 没有机构 -->
	<view v-else class="none-org txt-center">
		<image class="info" src="/static/images/login/none_org_info.png"></image>
		<view class="tip f36">当前账号还未分配机构<br />您可以尝试</view>
		<button class="botton" hover-class="none" @click="toCreateOrg">创建机构</button>
		<button class="botton bg-white c666" hover-class="none" @click="toApplyOrg">申请加入机构</button>
	</view>
</template>

<script>
	import OrgList from './components/OrgList.vue'
	import { mapMutations } from 'vuex';
	export default {
		components: {
			OrgList
		},
		data() {
			return {
				orgList: []
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			...mapMutations(['setSelectedOrg']),
			getList() {
				this.$http('personel.getOrgList', {}, 0).then(res => {
					if(res.code === 200) {
						this.orgList = res.data;
						// 登录时只有一个机构跳转首页
						// if(this.$Route.query.judge && this.orgList.length === 1) {
						// 	this.setSelectedOrg(this.orgList[0]);
						// 	this.$Router.pushTab({ path: '/pages/tabbar/home/home' });
						// }
					}
				})
			},
			toCreateOrg() {
				// 创建机构
				this.$Router.push('/pages/login/organization/create');
			},
			toApplyOrg() {
				// 申请加入机构
				this.$Router.push('/pages/login/organization/apply');
			},
		}
	}
</script>

<style lang="scss">
	.tip {
		margin-top: 26rpx;
	}
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		width: 750rpx;
		.button {
			height: 94rpx;
			line-height: 94rpx;
			font-size: 34rpx;
			border-radius: 0;
		}
	}
	
	/* 无机构 */
	.none-org {
		.info {
			width: 200rpx;
			height: 200rpx;
			margin-top: 146rpx;
		}
		.tip {
			line-height: 56rpx;
			margin: 60rpx 0;
		}
		.botton {
			width: 670rpx;
			height: 94rpx;
			line-height: 94rpx;
			margin: 40rpx auto;
		}
	}
</style>
