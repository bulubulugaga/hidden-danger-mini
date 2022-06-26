<template>
	<view class="easy-select" @click.stop="trigger" :style="[customStyle]">
		<!-- 选择的文本展示区 -->
		<input 
			type="text" 
			v-model="currentSelect.label" 
			:placeholder="placeholder" 
			:disabled="disabled" 
			clearable 
			@confirm="confirmInput"
			@input="changeInput"
		/>
		<!-- 右侧小图标 -->
		<view v-if="showIcon" class="easy-select-suffix" :class="[showSuffix]">
			<u-icon name="arrow-down-fill" color="#999" size="24rpx"></u-icon>
		</view>
		<!-- 下方选择框 -->
		<u-transition :show="showOptions" mode="fade">
		    <view 
				class="easy-select-options" 
				:style="{'min-width': boundingClientRect.width + 'px', top: optionsGroupTop, margin: optionsGroupMargin}"
			>
				<block v-if="options.length">
					<view
						class="easy-select-options-item"
						v-for="item in options" 
						:key="item.value"  
						:class="{active: currentSelect.value === item.value}"
						@click.stop="select(item)" 
					>
						<text>{{item.label}}</text>
					</view>
				</block>
		    	<view v-else class="easy-select-options-item">
		    		<text>无</text>
		    	</view>
		    </view>
		</u-transition>
	</view>
</template>

<script>
	/**
	 * easy-select
	 * @author Snoop zhang
	 * @description Select Component
	 *     基于（https://ext.dcloud.net.cn/plugin?id=2511 ）插件修改
	 * */
	const COMPONENT_NAME = 'easy-select'
	const MAX_OPTIONS_HEIGHT = 137 // 修改务必也修改easy-select-options的css部分
	const OPTIONS_ITEM_HEIGHT = 33 // 修改务必也修改easy-select-options-item的css部分
	const OPTIONS_MARGIN = 10
	const OPTIONS_PADDING = 6 * 2 + 2 // + 2是border
	const OPTIONS_OTHER_HEIGHT = OPTIONS_MARGIN + OPTIONS_PADDING
	const STORAGE_KEY = '_easyWindowHeight'
	
	export default {
		name: COMPONENT_NAME,
		props: {
			windowHeight: {
				// 可用视口的高度
				type: [Number, String],
				default: 0
			},
			placeholder: {
				type: String,
				default: '请选择'
			},
			initSelect: {
				// 初始化选项
				type: Object,
				default() {
					return {
						value: '',
						label: ''
					}
				}
			},
			options: {
				type: Array,
				default () {
					return [{
						value: '',
						label: '无'
					}]
				}
			},
			customStyle: {
				// 自定义样式
				type: Object,
				default() {
					return {
						width: '100%',
						height: '100%'
					}
				}
			},
			disabled: {  
				// 是否禁用输入（对输入框）
				type: Boolean,
				default: true
			},
			readonly: {
				// 是否只读（对整个下拉选择）
				type: Boolean,
				default: false
			},
			showIcon: {
				// 是否展示右侧小图标
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				showOptions: false,
				currentSelect: this.initSelect,
				boundingClientRect: {},
				optionsGroupTop: 'auto',
				optionsGroupMargin: ''
			}
		},
		computed: {
			showSuffix() {
				return this.showOptions ? 'showOptions' : 'no-showOptions'
			},
		},
		mounted() {
			const elQuery = uni.createSelectorQuery().in(this)
			elQuery.select('.easy-select').boundingClientRect(data => {
				this.boundingClientRect = data
			}).exec();
			try {
				if (!this.windowHeight) {
					const storageHeihgt = uni.getStorageSync(STORAGE_KEY)
					if (storageHeihgt) {
						this.easyWindowHeight = storageHeihgt
						return
					}
					const res = uni.getSystemInfoSync();
					this.easyWindowHeight = res.windowHeight
					uni.setStorageSync(STORAGE_KEY, this.easyWindowHeight)
				}
			} catch (e) {
			    // error
			}
		},
		methods: {
			trigger(e) {
				// 点击select
				
				if(this.readonly) {
					// 只读
					return;
				}
				
				const view = uni.createSelectorQuery().in(this)
				view.select('.easy-select').fields({rect: true}, data => {
					let {	top, bottom } = data
					const thresholdHeight = Math.min(MAX_OPTIONS_HEIGHT + OPTIONS_MARGIN, (this.options.length * OPTIONS_ITEM_HEIGHT) +
						OPTIONS_OTHER_HEIGHT)
					bottom = Number(this.windowHeight || this.easyWindowHeight) - (top + this.boundingClientRect.height) // 距离底部的距离等于视口的高度减上top加select组件的高度

					// judge direction
					if (bottom < thresholdHeight) {
						this.optionsGroupDirection = 'up'
						this.optionsGroupTop = -thresholdHeight - 12 + 'px'
						this.optionsGroupMargin = '0'
					} else {
						this.optionsGroupDirection = 'down'
						this.optionsGroupTop = 'auto'
						this.optionsGroupMargin = '10px 0 0 0'
					}

					// if (this.scrollTop < )
					this.showOptions = !this.showOptions
				}).exec();
			},
			select(options) {
				// 选择下拉选择
				this.showOptions = false
				this.currentSelect = options
				this.$emit('handleSelect', options)
			},
			hideOptions() {
				// 隐藏下拉
				this.showOptions = false
			},
			confirmInput() {
				// 输入框开启输入，确认
				this.$emit('handleInputConfirm', this.currentSelect.label);
			},
			changeInput() {
				// 输入框开启输入，值修改时，开启防抖
				const _this = this;
				uni.$u.debounce(() => {
					_this.$emit('handleChangeInput', _this.currentSelect.label)
				}, 500);
				
			}
		},
		watch: {
			initSelect: {
				handler(newVal, oldVal) {
					this.currentSelect = newVal
				},
				deep: true
			}
		}
	}
</script>

<style scoped>
	.easy-select {
		position: relative;
		border: 2rpx solid #dcdfe6;
		border-radius: 10rpx;
		font-size: 28rpx;
		color: #666;
		outline: none;
		box-sizing: content-box;
	}

	.easy-select input {
		padding: 0 18rpx;
		padding-right: 30rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		height: 100% !important;
		min-height: 100% !important;
	}

	.easy-select .easy-select-suffix {
		position: absolute;
		box-sizing: border-box;
		height: 100%;
		right: 10rpx;
		top: 0;
		display: flex;
		align-items: center;
		transform: rotate(180deg);
		transition: all .3s;
		transform-origin: center;
	}

	.easy-select .showOptions {
		transform: rotate(0) !important;
	}

	.easy-select .no-showOptions {
		transform: rotate(180deg) !important;
	}

	.easy-select .easy-select-options {
		position: absolute;
		padding: 12rpx 0;
		margin-top: 20rpx;
		border: 2rpx solid #e4e7ed;
		border-radius: 8rpx;
		background-color: #fff;
		box-shadow: 0 4rpx 24rpx 0 rgba(0, 0, 0, .1);
		box-sizing: border-box;
		transform-origin: center top;
		z-index: 2238;
		overflow: scroll;
		max-height: 274rpx;
	}

	.easy-select .easy-select-options-item {
		padding: 0 20rpx;
		position: relative;
		white-space: nowrap;
		font-size: 28rpx;
		color: #606266;
		height: 66rpx;
		line-height: 66rpx;
		box-sizing: border-box;
	}

	.easy-select .active {
		background-color: #1FB3F7;
		color: white
	}
</style>
