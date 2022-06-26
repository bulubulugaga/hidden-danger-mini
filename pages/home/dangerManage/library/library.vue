<template>
	<view>
		<!-- 筛选 -->
		<l-search :list="libraryList" placeholder="请输入主要问题/法律法规" @confirm="confirm" @clear="confirm"></l-search>
		
		
		<!-- 列表 -->
		<view class="item bg-white f28" v-for="(item, index) in list" :key="item.id">
			<view class="u-flex u-flex-between">
				<view class="FB">第{{ index + 1 }}条</view>
				<view class="FB" :style="{ color: dangerLevelColor[item.level] }">{{ dangerLevel[item.level] }}</view>
			</view>
			<u-line color="#DDDDDD" margin="24rpx 0"></u-line>
			<view class="sub-title">主要问题</view>
			<view class="c666">{{ item.problemPoint }}</view>
			<view class="sub-title">法律法规</view>
			<view class="c666">{{ item.basis }}</view>
			<view class="sub-title">整改建议</view>
			<view class="c666">{{ item.standard }}</view>
			<view class="u-flex u-flex-end">
				<button class="button round-4" hover-class="none" @click="handleChecked(item)">引用</button>
			</view>
		</view>
	</view>
</template>

<script>
	import LSearch from './LSearch.vue'
	import { dangerLevel, dangerLevelColor } from '@/static/js/dictionary.js'
	export default {
		components: {
			LSearch
		},
		data() {
			return {
				dangerLevel,  // 隐患级别
				dangerLevelColor,  // 隐患颜色
				
				list: [],
				libraryList: [],
				
				params: {
					industryId: '',
					condition: ''
				}
			}
		},
		onLoad() {
			this.getLibrary();
			this.getList();
		},
		methods: {
			getLibrary() {
				// 获取隐患库分类
				this.$http('home.dangerIndustry').then(res => {
					if(res.code === 200) {
						this.libraryList = res.data[0].children;
					}
				})
			},
			getList() {
				// 隐患库列表
				this.$http('home.dangerLibrary', this.params, 0).then(res => {
					if(res.code === 200) {
						this.list = res.data;
					}
				})
			},
			confirm(e) {
				// 搜索框确认
				this.params = {
					industryId: e.industryId,
					condition: e.keyword
				}
				this.getList();
			},
			handleChecked(item) {
				// 引用
				const beforePage = getCurrentPages()[getCurrentPages().length- 2];
				let formData = beforePage.$vm.$refs.dangerFrom.formData;
				formData.hiddenLevel = item.level;
				formData.mainProblem = item.problemPoint;
				formData.law = item.basis;
				formData.rectificationSuggestion = item.standard;
				this.$Router.back();
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		margin-top: 16rpx;
		padding: 20rpx 36rpx 24rpx;
		line-height: 40rpx;
		.sub-title {
			margin: 24rpx 0 8rpx;
			font-weight: bold;
		}
		.button {
			width: 144rpx;
			line-height: 68rpx;
			font-size: 28rpx;
			margin-top: 24rpx;
		}
	}
</style>
