<template>
	<!-- 搜索中高级筛选 -->
	<view>
		<!-- 输入框 -->
		<view class="screen-wrap">
			<search ref="searchInput" :isFixed="true" :placeholder="placeholder" @confirm="confirm" @clear="clearKey"></search>
			<!-- tab筛选 -->
			<view class="tab-wrap">
				<view class="tab u-flex bg-white">
					<view class="item f28 c666" :class="{ 'active-all': status.currentIndex === '' }" @click="handleAll">全部</view>
					<scroll-view class="container u-flex" :scroll-x="true" :enable-flex="true">
						<view class="item u-flex-y-center" v-for="(item, index) in list" :key="item.id">
							<u-icon
								size="20rpx"
								label-pos="left"
								space="6rpx"
								:label="item.title"
								:name="getTabIconName(item, index)" 
								:color="status.currentIndex === index ? '#1FB3F7' : '#666'" 
								:label-size="status.currentIndex === index ? '34rpx' : '28rpx'"
								:label-color="status.currentIndex === index ? '#1FB3F7' : '#666'"
								@click="changeTab(item, index)"
							></u-icon>
						</view>
					</scroll-view>
				</view>
			</view>
			<!-- 默认内容 -->
			<!-- <u-transition :show="isShowScreen" mode="slide-down"> -->
				<view class="content bg-white f28 u-flex" v-if="isShowScreen">
					<scroll-view class="left u-flex-shrink-none" :scroll-y="true">
						<view 
							class="item u-flex-y-center" 
							v-for="(item, index) in list[status.currentIndex].children" 
							:key="item.id" 
							:class="{ 'main-blue' : status.currentSubIndex === index }"
							@click="changeLeft(item, index)"
						>
							<view class="u-flex-fill u-line-1">{{ item.title }}</view>
							<u-icon v-if="item.children && item.children.length" name="arrow-right" color="#666" size="20rpx"></u-icon>
						</view>
					</scroll-view>
					<scroll-view class="right u-flex-fill" :scroll-y="true">
						<view 
							class="item" 
							v-for="(item, index) in list[status.currentIndex].children[status.currentSubIndex].children" 
							:key="item.id"
							:class="{ 'main-blue' : status.currentThrIndex === index }"
							@click="changeRight(item.id, index)"
						>
							{{ item.title }}
						</view>
					</scroll-view>
				</view>
			<!-- </u-transition> -->
		</view>
		<!-- 遮罩层 -->
		<view class="screen" v-if="isShowScreen" @touchmove.stop.prevent="moveHandle" @click="isShowScreen = false"></view>
	</view>
</template>

<script>
	/**
	 * @description 含隐患库筛选的搜索
	 * 
	 */
	import Search from '@/components/search/Search.vue'
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
			},
			list: {
				type: Array,
				default() {
					return []
				}
			}
		},
		data() {
			return {
				isShowScreen: false,    //高级筛选
				status: {
					currentIndex: '',
					currentSubIndex: '',
					currentThrIndex: ''
				},
				industryId: ''
			}
		},
		methods: {
			clearKey() {
				// 输入框清空
				this.$emit('confirm', {
					keyword: '',
					industryId: ''
				});
			},
			moveHandle(e) {
				// 禁止屏幕滚动
				return;
			},
			getTabIconName(item, index) {
				// 没有子节点不展示小图标
				if(!item.children || !item.children.length) {
					return ' ';
				}
				return this.status.currentIndex === index ? 'arrow-down-fill' : 'arrow-up-fill';
			},
			changeStatus(value) {
				// 修改状态
				this.currentStatus = value;
			},
			confirm() {
				// 高级筛选
				this.isShowScreen = false;
				this.$emit('confirm', { 
					keyword: this.$refs.searchInput.keyword,
					industryId: this.industryId
				});
			},
			changeTab(item, index) {
				// 点击第一层隐患库筛选
				
				const old = this.status.currentIndex;
				if(this.status.currentIndex !== index) {
					this.status.currentSubIndex = '';
					this.status.currentThrIndex = '';
				}
				this.status.currentIndex = index;
				
				if(!item.children || !item.children.length) {
					// 没有子节点，直接筛选
					if(old === index) {
						// 点击同一节点不处理
						return;
					}
					this.industryId = item.id;
					this.confirm();
					return;
				}
				this.isShowScreen = true;
			},
			changeLeft(item, index) {
				// 点击第二层隐患库筛选
				this.status.currentSubIndex = index;
				if(!item.children || !item.children.length) {
					// 没有子节点，直接筛选
					this.industryId = item.id;
					this.confirm();
				}
			},
			changeRight(id, index) {
				// 点击第三层隐患库筛选
				this.status.currentThrIndex = index;
				this.industryId = id;
				this.confirm();
			},
			handleAll() {
				// 点击全部
				if(this.status.currentIndex === '') {
					// 重复点击
					return;
				}
				this.status = {
					currentIndex: '',
					currentSubIndex: '',
					currentThrIndex: ''
				}
				this.industryId = '';
				this.confirm();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.screen-wrap {
		position: relative;
		z-index: 100;
	}
	.tab-wrap {
		height: 100rpx;
		.tab {
			position: fixed;
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			padding: 0 36rpx;
			white-space: nowrap;
			.container {
				width: calc(100% - 125rpx);
			}
			.item {
				margin-right: 60rpx;
			}
			.active-all {
				color: #1FB3F7;
				font-size: 34rpx;
				font-weight: bold;
			}
		}
	}
	.content {
		position: fixed;
		width: 100%;
		height: 556rpx;
		border-top: 2rpx solid #ddd;
		.item {
			line-height: 40rpx;
			margin-top: 34rpx;
		}
		.left {
			width: 252rpx;
			height: 554rpx;
			border-right: 2rpx solid #ddd;
			padding: 0 24rpx;
		}
		.right {
			height: 554rpx;
			padding: 0 24rpx;
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
