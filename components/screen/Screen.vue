<template>
	<!-- 搜索中高级筛选 -->
	<view>
		<!-- 输入框 -->
		<view class="screen-wrap">
			<search ref="searchInput" :isFixed="true" :placeholder="placeholder" @confirm="confirm" @clear="clearKey">
				<view slot="right" class="right">
					<u-icon name="/static/images/home/screen.png" width="40rpx" height="40rpx" @click="isShowScreen = true"></u-icon>
				</view>
			</search>
			<!-- 筛选插槽 -->
			<view class="content">
				<slot name="content">
					<!-- 默认内容 -->
					<u-transition :show="isShowScreen" mode="slide-down">
						<view class="default bg-white">
							<view class="title f36 FB">高级筛选</view>
							<view v-if="isShowStatus" class="sub-title f34">隐患状态</view>
							<view v-if="isShowStatus" class="u-flex">
								<view 
									class="status-item round txt-center" 
									v-for="item in status" 
									:key="item.value"
									:class="{ 'status-item-active': item.value === currentStatus }"
									@click="changeStatus(item.value)"
								>{{ item.label }}</view>
							</view>
							<view class="sub-title f34">排查时间</view>
							<!-- 日期选择：由于样式不好修改，自定义 -->
							<uni-datetime-picker type="daterange" v-model="timeRange">
								<view class="date-range round u-flex-xy-center">
									<view class="date-range-input">
										<u--input v-model="timeRange[0]" placeholder="开始时间" border="none" readonly input-align="center" font-size="28rpx"></u--input>
									</view>
									-
									<view class="date-range-input">
										<u--input v-model="timeRange[1]" placeholder="结束时间" border="none" readonly input-align="center" font-size="28rpx"></u--input>
									</view>
								</view>
							</uni-datetime-picker>
							<view class="button txt-center f34 u-flex u-flex-between">
								<view><text @click="reset">重置</text></view>
								<view><text class='main-blue' @click="confirm">搜索</text></view>
							</view>
						</view>
						
					</u-transition>
				</slot>
			</view>
		</view>
		<!-- 遮罩层 -->
		<view class="screen" v-if="isShowScreen" @touchmove.stop.prevent="moveHandle" @click="isShowScreen = false"></view>
	</view>
</template>

<script>
	/**
	 * @description 含高级筛选的搜索
	 * 
	 */
	import Search from '../search/Search.vue'
	import { dangerStatusList } from '@/static/js/dictionary.js'
	export default {
		components:{
			Search
		},
		props: {
			placeholder: {
				type: String,
				default: '请输入'
			},
			isShowStatus: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				isShowScreen: false,    //高级筛选
				isShowCalendar: false,   // 日期
				
				status: dangerStatusList,
				
				// 数据不要组合成对象，否则日期双向绑定失败
				currentStatus: '',
				timeRange: ['', ''],
			}
		},
		methods: {
			moveHandle(e) {
				// 禁止屏幕滚动
				return;
			},
			changeStatus(value) {
				// 修改状态
				this.currentStatus = value;
			},
			confirm() {
				// 高级筛选
				this.isShowScreen = false;
				this.$emit('confirm', { 
					condition: this.$refs.searchInput.keyword,
					status: this.currentStatus, 
					timeRange: this.timeRange
				});
			},
			clearKey() {
				// 输入框清空
				this.$emit('confirm', {
					condition: '',
					status: this.currentStatus, 
					timeRange: this.timeRange
				});
			},
			reset() {
				// 高级筛选重置
				this.isShowScreen = false;
				this.currentStatus = '',
				this.timeRange = ['', ''];
				this.$refs.searchInput.keyword = '';
				this.clearKey();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.screen-wrap {
		position: relative;
		z-index: 100;
		.right {
			padding-left: 20rpx;
		}
		.content {
			position: fixed;
		}
		.default {
			width: 100vw;
			padding: 24rpx 0 0;
			.title {
				margin-left: 28rpx;
			}
			.sub-title {
				margin: 58rpx 40rpx 0;
			}
			.status-item {
				width: 150rpx;
				line-height: 68rpx;
				margin: 34rpx 32rpx 0 40rpx;
				background: #F4F4F4;
			}
			.status-item-active {
				background: #1FB3F7;
				color: white;
			}
			.date-range {
				width: 670rpx;
				height: 68rpx;
				margin: 34rpx auto 56rpx;
				background: #F4F4F4;
			}
			.date-range-input{
				width: 300rpx;
			}
			.button {
				line-height: 100rpx;
				border-top: 2rpx solid #E5E5E5;
				view {
					width: 50%;
				}
			}
		}
	}
	.screen {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, .5);
		overflow: scroll;
		z-index: 99;
	}
</style>
