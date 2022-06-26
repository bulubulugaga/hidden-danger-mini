<template>
	<view>
		<!-- tabs选项 -->
		<u-sticky bgColor="#fff">
			<view class="u-flex-x-center">
				<u-tabs
					line-width="80rpx"
					line-height="8rpx"
					line-color="#1FB3F7"
					:list="tabs" 
					:current="currentTab" 
					:inactive-style="{ fontSize: '34rpx', color: '#666' }"
					:active-style="{ fontSize: '34rpx', color: '#333', fontWeight: 'bold' }"
					:item-style="{ height: '94rpx', padding: '0 66rpx' }"
					@change="changeTab"
				></u-tabs>
			</view>
		</u-sticky>
		
		<!-- 筛选 -->
		<screen ref="screen" placeholder="请输入表格抬头" :isShowStatus="false" @confirm="getList"></screen>
		
		<!-- 列表 -->
		<view class="list-item bg-white u-flex-y-center" v-for="item in list" :key="item.id" @click="toDetail(item.hiddenIds)">
			<u-image :src="currentTab | imgSrc" width="120rpx" height="120rpx"></u-image>
			<view>
				<view class="title f34 FB u-line-1">{{ item.title }}</view>
				<view class="u-flex">
					<view class="time f26 c666">检查时间：{{ item.exportDate | date }}</view>
					<view class="f26 c666">隐患数量：{{ item.qty }}</view>
				</view>
			</view>
		</view>
		
	</view>
</template>

<script>
	import Screen from '@/components/screen/Screen.vue'
	export default {
		components: {
			Screen
		},
		data() {
			return {
				tabs: [
					{ name: '检查表' }, 
					{ name: '复查表' },
				],
				currentTab: 0,
				list: [],
				// search: {}   // 搜索条件
			}
		},
		onLoad() {
			this.getList();
		},
		methods: {
			getList(e) {
				// 获取隐患列表
				// this.search = e;
				this.$http('home.getExportList', {
					type: this.currentTab + 1,
					title: e && e.condition || '',
					startDate: e && e.timeRange[0] || '',
					endDate: e && e.timeRange[1] || ''
				}, 0).then(res => {
					if(res.code === 200) {
						this.list = res.data;
					}
				})
			},
			changeTab(e) {
				// 修改tabs
				this.currentTab = e.index;
				// 清空筛选搜索
				this.$refs.screen.timeRange = ['', ''];
				this.$refs.screen.$refs.searchInput.keyword = '';
				this.getList();
			},
			toDetail(id) {
				// 详情
				this.$Router.push({ path: '/pages/home/checklistRecord/detail', query: { id } })
			}
		},
		filters: {
			imgSrc(val) {
				switch(val) {
					case 0: return '/static/images/home/record_check.png';
					case 1: return '/static/images/home/record_review.png';
				}
			}
		}
	}
</script>

<style lang="scss">
	.list-item {
		height: 166rpx;
		margin-top: 26rpx;
		padding: 0 24rpx;
		.title {
			margin: 4rpx 0 20rpx 18rpx;
		}
		.time {
			margin: 0 64rpx 0 18rpx;
		}
	}
</style>
