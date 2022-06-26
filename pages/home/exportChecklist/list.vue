<template>
	<view>
		<!-- 筛选 -->
		<screen placeholder="请输入隐患位置/主要问题" @confirm="getList"></screen>
		
		<!-- 导出列表 -->
		<u-checkbox-group v-model="checkedList" placement="column" @change="handleChecked">
			<view class="hidden-danger-item bg-white u-flex" v-for="item in list" :key="item.id" @click="toDetail">
				<u-checkbox size="34rpx" shape="circle" active-color="#1FB3F7" :name="item.id"></u-checkbox>
				<view class="middle u-flex-fill">
					<view class="f34 FB u-line-1">{{ item.location }}</view>
					<view class="content f26 c666 u-line-1">主要问题：{{ item.mainProblem }}</view>
					<view class="f26 c666">排查时间：{{ item.troubleshootingTime | date }}</view>
				</view>
				<view class="status-tag f24 round-4 txt-center white u-flex-shrink-none" :style="{ background: dangerStatusColor[item.status] }">
					{{ dangerStatus[item.status] }}
				</view>
			</view>
		</u-checkbox-group>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="content u-flex-y-center bg-white f28">
				<u-checkbox-group v-model="allCheckedStatus" placement="column" @change="handleAllChecked">
					<u-checkbox size="34rpx" shape="circle" active-color="#1FB3F7" :name="true"></u-checkbox>
				</u-checkbox-group>
				<view class="label f34 FB c666">全选</view>
				<view class="c999">已选</view>
				<view class="number main-red u-flex-fill">{{ checkedList.length }}条</view>
				<view class="button check-button" @click="toExportFrom(1)">检查表</view>
				<view class="button bg-main-blue white" @click="toExportFrom(2)">复查表</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { dangerStatus, dangerStatusColor } from '@/static/js/dictionary.js'
	import Screen from '@/components/screen/Screen.vue'
	import { mapGetters } from 'vuex'
	export default {
		components: {
			Screen
		},
		data() {
			return {
				dangerStatus,   // 隐患状态
				dangerStatusColor,    // 状态颜色
				list: [],
				checkedList: [],  // 已选择列表
				allChecked: [],  // 全选列表
				allCheckedStatus: []   // 全选状态
			}
		},
		computed: {
			...mapGetters(['selectedOrg', 'selectedTeam'])
		},
		onLoad() {
			uni.setNavigationBarTitle({
			    title: this.selectedTeam.label
			});
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
						// 全选列表
						this.allChecked = this.list.map(item => item.id);
						// 每次搜索重置 已选列表和全选状态
						this.checkedList = [];
						this.allCheckedStatus = [];
					}
				})
			},
			handleChecked(e) {
				// 点击列表单选
				if(e.length === this.allChecked.length) {
					this.allCheckedStatus = [true];
				} else {
					this.allCheckedStatus = [];
				}
			},
			handleAllChecked(e) {
				// 点击全选
				if(e[0]) {
					// 选择了全选
					this.checkedList = [...this.allChecked];
				} else {
					this.checkedList = [];
				}
			},
			toExportFrom(type) {
				// 导出检查表/复查表
				if(!this.checkedList.length) {
					uni.$u.toast('请选择隐患');
					return;
				}
				this.$Router.push({ 
					path: '/pages/home/exportChecklist/exportFrom/exportFrom', 
					query: { type, checkedList: this.checkedList }
				});
			}
		}
	}
</script>

<style lang="scss">
	.hidden-danger-item {
		height: 222rpx;
		padding: 30rpx 34rpx 30rpx 20rpx;
		margin-top: 26rpx;
		.middle {
			margin-left: 14rpx;
		}
		.content {
			margin: 20rpx 0;
		}
		.status-tag {
			width: 120rpx;
			height: 48rpx;
			line-height: 48rpx;
		}
	}
	.footer {
		height: 116rpx;
		.content {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 116rpx;
			padding: 0 32rpx 0 20rpx;
			.label {
				margin: 0 14rpx 0 8rpx;
			}
			.number {
				margin-left: 10rpx;
			}
			.button {
				width: 162rpx;
				line-height: 72rpx;
				border-radius: 100rpx;
				text-align: center;
			}
			.check-button {
				border: 2rpx solid #ddd;
				margin-right: 24rpx;
			}
		}
	}
</style>
