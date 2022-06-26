<template>
	<block>
		<view class="hidden-danger-item bg-white u-flex" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
			<slot></slot>
			<view class="u-flex-fill">
				<view class="f34 FB u-line-1">{{ item.location }}</view>
				<view class="content f26 c666 u-line-1">主要问题：{{ item.mainProblem }}</view>
				<view class="f26 c666">排查时间：{{ item.troubleshootingTime | date }}</view>
			</view>
			<view class="status-tag f24 round-4 txt-center white u-flex-shrink-none" :style="{ background: dangerStatusColor[item.status] }">
				{{ dangerStatus[item.status] }}
			</view>
		</view>
	</block>
</template>

<script>
	import { dangerStatus, dangerStatusColor } from '@/static/js/dictionary.js'
	export default {
		props: {
			list: {
				type: Array,
				default() {
					return []
				}
			},
			toDetailAble: {  // 是否跳转详情
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				dangerStatus,   // 隐患状态
				dangerStatusColor    // 状态颜色
			}
		},
		methods: {
			toDetail(id) {
				// 详情
				if(!this.toDetailAble) {
					return;
				}
				this.$Router.push({ path: '/pages/home/dangerManage/detail/detail', query: { id } });
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hidden-danger-item {
		height: 222rpx;
		padding: 30rpx 34rpx;
		margin-top: 26rpx;
		.content {
			margin: 20rpx 0;
		}
		.status-tag {
			width: 120rpx;
			height: 48rpx;
			line-height: 48rpx;
		}
	}
</style>
