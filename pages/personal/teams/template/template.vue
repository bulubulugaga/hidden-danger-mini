<template>
	<view>
		<!-- 标题 -->
		<view class="title txt-center FB">{{ list[currentNum].name }}</view>
		
		<!-- 轮播图 -->
		<view class="swiper-wrap">
			<u-swiper
				height="860rpx"
				img-mode="aspectFit"
				bg-color="#f9f9f9"
				:list="imgList"
				:current="currentNum"
				:autoplay="false"
				@change="e => currentNum = e.current"
				@click="handleSwiper">
			 </u-swiper>
		</view>
		
		<!-- 数字指示点 -->
		<view class="number txt-center">
			<text class="f34 FB">{{ list.length ? currentNum + 1 : 0 }}</text>/
			<text class="f26 c666">{{ list.length }}</text>
		</view>
		
		<!-- 指示点 -->
		<scroll-view 
			class="dot" 
			:class="list.length < 11 ? 'u-flex-x-center' : 'u-flex'" 
			:scroll-x="true" 
			:scroll-left="scrollLeft"
			:enable-flex="true"
			 @scroll="scroll">
			<view 
				class="dot-item u-flex-shrink-none" 
				:class="{ active: item === currentNum }" 
				v-for="item in list.length" 
				:key="item" 
				@click="handleDot(item)"
			></view>
		</scroll-view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="button">
				<button hover-class="none" @click="handleSelect">选择当前模板</button>
			</view>
		</view>
	</view>
</template>

<script>
	import { previewImage } from '@/common/utils/tools.js'
	export default {
		data() {
			return {
				type: this.$Route.query.type,   // 模板类型
				
				imgList: [],   // 图片列表
				list: [],   // 模板列表
				currentNum: 0,   // 当前选中模板下标
				            
				scrollLeft: 0,
				old: {
				    scrollLeft: 0
				}
			}
		},
		onLoad() {
			this.type = this.$Route.query.type;
			uni.setNavigationBarTitle({
				title: this.type === '1' ? '检查表模板' : '复查表模板'
			})
			this.getList();
		},
		methods: {
			getList() {
				// 获取模板列表
				this.$http('personel.modelList', {
					type: this.type
				}).then(res => {
					if(res.code === 200) {
						this.list = res.data;
						this.imgList = this.list.map(item => item.picUrl);
					}
				})
			},
			handleDot(index) {
				// 点击指示点
				this.currentNum = index;
			},
			scroll(e) {
				// 滚动指示点
				this.old.scrollLeft = e.detail.scrollLeft;
			},
			resize() {
				// 重新计算指示点位置
				if(this.list.length < 11) {
					return;
				}
				
				// 靠左
				this.scrollLeft = this.old.scrollLeft;
				if(this.currentNum < 5) {
					this.$nextTick(() => {
						this.scrollLeft = 0;
					});
					return;
				}
				// 靠左
				if(this.list.length - this.currentNum < 7) {
					this.$nextTick(() => {
						this.scrollLeft = (this.list.length - 10) * 36 + 'rpx';
					});
					return;
				}
				// 居中
				this.$nextTick(() => {
					this.scrollLeft = 10 + 38 * (this.currentNum - 5) + 'rpx';
				});
			},
			handleSelect() {
				// 选择模板
				const beforePage = getCurrentPages()[getCurrentPages().length- 2];
				const checked = this.list[this.currentNum];
				let formData = beforePage.$vm.formData;
				if(this.type === '1') {
					formData.checkId = checked.id;
					formData.checkUrl = checked.picUrl;
					formData.checkName = checked.name;
				} else {
					formData.reviewId = checked.id;
					formData.reviewUrl = checked.picUrl;					
					formData.reviewName = checked.name;
				}
				this.$Router.back();
			},
			handleSwiper(index) {
				// 点击图片预览
				previewImage(this.imgList, index);
			}
		},
		watch: {
			currentNum: {
				immediate: true,
				handler (newValue, oldValue) {
					// 内外部值不相等时，才尝试移动滑块
					if (newValue !== oldValue) {
						this.$nextTick(() => {
							this.resize();
						})
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: white;
	}
	.title {
		margin-top: 20rpx;
	}
	.swiper-wrap {
		width: 640rpx;
		height: 860rpx;
		margin: 26rpx auto;
	}
	.dot {
		width: 400rpx;
		height: 10rpx;
		margin: 26rpx auto;
		&-item {
			width: 20rpx;
			height: 10rpx;
			margin: 0 8rpx;
			background-color: #ddd;
			border-radius: 100rpx;
			&.active {
				width: 60rpx;
				background: #1FB3F7;
			}
		}
	}
	.footer {
		height: 94rpx;
		.button {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			height: 94rpx;
			button {
				line-height: 94rpx;
				border-radius: 0;
			}
			.quit {
				width: 50%;
			}
		}
	}
</style>
