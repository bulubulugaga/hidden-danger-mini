<template>
	<view class="search-wrap">
		<view class="search u-flex u-flex-middle" :style="[style]">
			<u-input 
				v-model="keyword" 
				border="none" 
				:placeholder="placeholder" 
				:font-size="fontSize + 'rpx'" 
				:clearable="clearable"
				@confirm="confirm"
				@clear="clear"
			>	
				<block slot="prefix">
					<!-- 左侧插槽 -->
					<slot name="left">
						<u-icon name="search" color="#ccc" size="52rpx" margin="0 20rpx 0 0"></u-icon>
					</slot>
				</block>
				<block slot="suffix">
					<!-- 右侧插槽 -->
					<slot name="right"></slot>
				</block>
			</u-input>
		</view>
	</view>
</template>

<script>
	/**
	 * @description 用于搜索框  u-search亲测样式不好修改，所有重新封装
	 * 
	 */
	export default {
		props: {
			value: {  // 初始值
				type: String,
				default: ''
			},
			clearable: {  // 清除
				type: Boolean,
				default: true
			},
			fontSize: {  // 输入框文字大小
				type: Number,
				default: 28
			},
			placeholder: {
				type: String,
				default: '请输入'
			},
			bgColor: {  // 背景颜色
				type: String,
				default: '#fff'
			},
			circle: {  // 是否圆角
				type: Boolean,
				default: false
			},
			isFixed: {  // 是否固定位置
				type: Boolean,
				default: false
			},
			customStyle: {  // 自定义样式
				type: Object,
				default() {
					return {}
				}
			}
		},
		computed: {
			style() {
				// 样式整合
				return { 
					borderRadius: this.circle ? '300rpx' : '0',
					background: this.bgColor,
					position: this.isFixed ? 'fixed' : 'static',
					...this.customStyle 
				}
			}
		},
		data() {
			return {
				keyword: this.value
			}
		},
		methods: {
			confirm() {
				// 搜索
				this.$emit('confirm', this.keyword);
			},
			clear() {
				// 清空
				this.$emit('clear');
			}
		}
	}
</script>

<style scoped>
	.search-wrap {
		width: 100%;
		height: 94rpx;
	}
	.search {
		width: 100%;
		height: 94rpx;
		padding: 0 26rpx;
		background: #fff;
	}
</style>
