<template>
	<view>
		<!-- 自定义头部navbar -->
		<navbar :back-text="selectedTeam.label">
			<view class="nav-right round u-flex-xy-center" slot="right" @click="toTeamDetail">
				<u-icon 
					name="/static/images/home/team.png" 
					width="40rpx" 
					height="40rpx" 
					label="检查组" 
					label-size="28rpx" 
					space="10rpx"
				></u-icon>
			</view>
		</navbar>
		
		<!-- 筛选 -->
		<screen placeholder="请输入隐患位置/主要问题" @confirm="getList"></screen>
		
		<!-- 隐患列表 -->
		<hidden-danger-list v-if="list.length" :list="list"></hidden-danger-list>
		<list-empty v-else></list-empty>
		
		<!-- 悬浮按钮新增 -->
		<view class="fix-button">
			<view class="box">
				<u-image src="/static/images/home/add.png" width="116rpx" height="116rpx" @click="toAddDanger"></u-image>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="button u-flex u-flex-between">
				<button class="bg-white c666" hover-class="none" @click="toExportList">导出检查表</button>
				<button hover-class="none" @click="toRecord">检查表记录</button>
			</view>
		</view>
	</view>
</template>

<script>
	import Navbar from '@/components/navbar/Navbar.vue'
	import Screen from '@/components/screen/Screen.vue'
	import HiddenDangerList from '@/components/hiddenDangerList/HiddenDangerList.vue'
	import ListEmpty from '@/components/empty/ListEmpty.vue'
	import { mapGetters } from 'vuex';
	export default {
		components: {
			Navbar,
			Screen,
			HiddenDangerList,
			ListEmpty
		},
		data() {
			return {
				list: []
			}
		},
		computed: {
			...mapGetters(['selectedOrg', 'selectedTeam'])
		},
		onShow() {
			this.getList();
		},
		methods: {
			getList(e) {
				// 获取隐患列表
				this.$http('home.dangerList', {
					orgId: this.selectedOrg.id,
					groupId: this.selectedTeam.value,
					condition: e && e.condition || '',
					status: e && e.status || '',
					startTime: e && e.timeRange[0] || '',
					endTime: e && e.timeRange[1] || ''
				}, 0).then(res => {
					if(res.code === 200) {
						this.list = res.data;
					}
				})
			},
			toTeamDetail() {
				// 检查组详情
				this.$Router.push({ 
					path: '/pages/personal/teams/detail', 
					query: { 
						page: 'detail', 
						title: '检查组详情', 
						id: this.selectedTeam.value,
					},
				});
			},
			toAddDanger() {
				// 新增隐患
				this.$Router.push('/pages/home/dangerManage/add/add');
			},
			toRecord() {
				// 检查表记录
				this.$Router.push('/pages/home/checklistRecord/list');
			},
			toExportList() {
				// 导出检查表
				this.$Router.push('/pages/home/exportChecklist/list');
			}
		}
	}
</script>

<style lang="scss">
	.nav-right {
		width: 174rpx;
		height: 64rpx;
		margin-right: 16rpx;
		border: 2rpx solid rgba(0, 0, 0 ,.08);
	}
	.fix-button {
		height: 180rpx;
		.box {
			position: fixed;
			bottom: 148rpx;
			right: 24rpx;
		}
	}
	.footer {
		height: 94rpx;
		.button {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			line-height: 94rpx;
			button {
				width: 50%;
				border-radius: 0;
			}
		}
	}
</style>
