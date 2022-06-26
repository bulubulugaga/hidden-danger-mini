<template>
	<view class="cu-custom" :style="[{ height: customBar + 'px' }]" @touchmove.stop.prevent="moveHandle">
		<view class="cu-bar u-flex-y-center u-row-between" :class="{ fixed: isFixed }" :style="[style]">
			<!-- 左侧内容（默认返回） -->
			<view class="action u-flex-y-center" @click="goBack" v-if="isBack">
				<u-icon :name="backIconName" :color="backIconColor" :size="backIconSize + 'rpx'"></u-icon>
				<view class="back-text u-line-1" v-if="backText" :style="[backTextStyle]">{{ backText || '' }}</view>
			</view>
			<!-- 中间内容，自适应宽度 -->
			<view class="content" :style="[{ top: statusBarHeight + 'px' }]"><slot name="content"></slot></view>
			<!-- 右侧内容 -->
			<slot name="right"></slot>
		</view>
	</view>
</template>

<script>
/**
 * navbar -自定义标题栏
 */

// 获取系统状态栏的信息
let systemInfo = uni.getSystemInfoSync();
// 获取胶囊信息
let menuButtonInfo = uni.getMenuButtonBoundingClientRect();
export default {
	name: 'navbar',
	data() {
		return {
			statusBarHeight: systemInfo.statusBarHeight   // 状态栏高度
		};
	},
	computed: {
		// navbar样式
		style() {
			let statusBarHeight = systemInfo.statusBarHeight;
			let style = {};
			style.height = `${this.customBar}px`;
			style.paddingTop = `${statusBarHeight}px`;
			style.paddingRight = `${menuButtonInfo.width + 10}px`;
			Object.assign(style, this.background);
			return style;
		},
		// 高度
		customBar() {
			return menuButtonInfo.bottom + menuButtonInfo.top - systemInfo.statusBarHeight;
		}
	},
	props: {
		isBack: {
			type: Boolean,
			default: true
		},
		isFixed: {  // 是否固定在顶部
			type: Boolean,
			default: true
		},
		background: {
			type: Object,
			default() {
				return {
					background: '#ffffff'
				};
			}
		},
		// 返回箭头的颜色
		backIconColor: {
			type: String,
			default: '#000'
		},
		// 左边返回的图标
		backIconName: {
			type: String,
			default: 'arrow-left'
		},
		// 左边返回图标的大小，rpx
		backIconSize: {
			type: [String, Number],
			default: '44'
		},
		// 返回的文字提示
		backText: {
			type: String,
			default: ''
		},
		// 返回的文字的 样式
		backTextStyle: {
			type: Object,
			default() {
				return {
					color: '#000',
					fontSize: '34rpx'
				};
			}
		}
	},
	methods: {
		goBack() {
			uni.navigateBack();
		},
		moveHandle() {
			return;
		}
	}
};
</script>

<style lang="scss" scoped>
.cu-custom {
	width: 100%;
	.fixed {
		position: fixed;
		width: 100%;
		top: 0;
		z-index: 1024;
	}
}
.cu-bar {
	width: 100%;
	.action {
		padding-left: 4px;
	}
	.back-text {
		margin-left: 4px;
	}
	.content {
		width: 560rpx;
		display: flex;
		flex-direction: row;
		flex: 1;
		align-items: center;
		pointer-events: auto;
	}
}
</style>
