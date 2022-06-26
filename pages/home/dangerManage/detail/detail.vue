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
		
		<!-- 详情 -->
		<view v-if="currentTab === 0" class="detail">
			<hidden-danger-from :readonly="true" :info="info" :imgFileList="imgFileList"></hidden-danger-from>
		</view>
		
		<!-- 过程跟踪 -->
		<view v-else class="process">
			<view class="u-flex" v-for="item in list" :key="item.id">
				<view>
					<view class="f34 FB">{{ item.operatingTime | date('yyyy') }}</view>
					<view class="month f28 c999">{{ item.operatingTime | date('mm-dd') }}</view>
				</view>
				<view class="middle">
					<view class="dot bg-main-blue round"></view>
					<view class="line"></view>
				</view> 
				<view class="f28">
					<!-- 整改 -> 整改说明 -->
					<view class="word-break-all" v-if="item.operationType === 1">整改说明：{{ item.description }}</view>
					<!-- 复核 -> 复核结果 -->
					<view v-else>复核结果：
						<text :class="item.regular === 1 ? 'main-green' : 'main-red'">{{ item.regular | regularTxt }}</text>
					</view>
					<view class="person">{{ item.operationType === 1 ? '整改' : '复核' }}人：{{ item.operator }}</view>
					<view class="main-blue" @click="toProcessDetail(item)">查看详情</view>
					<u-gap height="90rpx"></u-gap>
				</view>
			</view>
		</view>
		
		<!-- 按钮 -->
		<view class="footer" v-if="currentTab === 0 && info.status !== 3">
			<button hover-class="none" @click="toRectReviewFrom">{{ info.status | btnTxt }}</button>
		</view>
		
	</view>
</template>

<script>
	import HiddenDangerFrom from '@/components/hiddenDangerFrom/HiddenDangerFrom.vue'
	export default {
		components: {
			HiddenDangerFrom
		},
		data() {
			return {
				id: this.$Route.query.id,
				tabs: [
					{ name: '基本信息' }, 
					{ name: '过程跟踪' },
				],
				currentTab: 0,
				info: {},  // 基本信息
				imgFileList: [],  // 隐患图片
				list: []  // 过程跟踪
			}
		},
		onLoad() {
			this.id = this.$Route.query.id;
			this.getDetail();
		},
		methods: {
			changeTab(e) {
				// 修改tabs
				this.currentTab = e.index;
				if(e.index === 1) {
					this.getProcessDetail();
				}
			},
			getDetail() {
				// 基本信息
				this.$http('home.dangerDetail', {
					id: this.id
				}, 0).then(res => {
					if(res.code === 200) {
						this.info = res.data;
						this.info.limitTime = this.info.limitTime && uni.$u.timeFormat(this.info.limitTime);
						this.info.troubleshootingTime = this.info.troubleshootingTime && uni.$u.timeFormat(this.info.troubleshootingTime);
						this.imgFileList = this.info.imgFileList.map(item => ({
							id: item.id,
							url: item.filePath
						}))
					}
				})
			},
			getProcessDetail() {
				// 获取过程跟踪详情
				this.$http('home.chReDetail', {
					hiddenId: this.id
				}, 0).then(res => {
					if(res.code === 200) {
						this.list = res.data;
					}
				})
			},
			toRectReviewFrom() {
				// 整改或复核
				this.$Router.push({ 
					path: '/pages/home/dangerManage/rectificationReview/form', 
					query: { id: this.info.id, status: this.info.status }
				});
			},
			toProcessDetail(item) {
				// 过程详情
				this.$Router.push({ path: '/pages/home/dangerManage/rectificationReview/detail', query: { info: encodeURIComponent(JSON.stringify(item)) } });		
			}
		},
		filters: {
			btnTxt(status) {
				// 按钮文字
				switch(status) {
					case 1: return '点击整改';
					case 2: return '点击复核';
					default: return '';
				}
			},
			regularTxt(regular) {
				// 复核结果文字
				switch(regular) {
					case 1: return '合格';
					case 2: return '不合格';
					default: return '';
				}
			}
		} 
	}
</script>

<style lang="scss">
	.detail {
		padding: 16rpx 0;
	}
	.process {
		padding: 42rpx 60rpx;
		.month {
			margin-top: 4rpx;
		}
		.middle {
			margin: 16rpx 30rpx 0 22rpx;
			.dot {
				width: 20rpx;
				height: 20rpx;
			}
			.line {
				width: 2rpx;
				height: 100%;
				margin: 0 auto;
				background: #ddd;
			}
		}
		.person {
			margin: 12rpx 0 24rpx;
		}
	}
	.footer {
		height: 94rpx;
		button {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			line-height: 94rpx;
			border-radius: 0;
			z-index: 9999;
		}
	}
</style>
