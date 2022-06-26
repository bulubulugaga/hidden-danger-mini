<template>
	<view>
		<!-- 搜索 -->
		<search placeholder="请输入检查组名称/创建者" @confirm="getList" @clear="getList('')"></search>
		
		<!-- 列表 -->
		<view class="list bg-white f26 c666" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
			<view class="f34 FB u-line-1 c333">{{ item.groupName }}</view>
			<view class="content u-line-1">{{ item.groupDescrip }}</view>
			<u-row>
				<u-col span="6">创建时间：{{ item.createTime | date }}</u-col>
				<u-col span="6">创建人：{{ item.createUserName }}</u-col>
			</u-row>
			<u-line color="#979797" margin="32rpx 0 20rpx"></u-line>
			<view class="u-line-1">小组成员：<text class="main-blue">{{ item.userStr }}</text></view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="button">
				<button hover-class="none" @click="toCreate">创建检查组</button>
			</view>
		</view>
	</view>
</template>

<script>
	import Search from '@/components/search/Search.vue'
	import { mapGetters } from 'vuex'
	export default {
		components: {
			Search
		},
		data() {
			return {
				list: []
			}
		},
		computed: {
			...mapGetters(['selectedOrg'])
		},
		onShow() {
			this.getList('');
		},
		methods: {
			getList(e) {
				// 获取列表
				this.$http('personel.teamList', {
					orgId: this.selectedOrg.id,
					condition: e
				}, 0).then(res => {
					if(res.code === 200) {
						this.list = res.data
					}
				})
			},
			toCreate() {
				// 创建检查组
				this.$Router.push({ path: '/pages/personal/teams/detail', query: { page: 'create', title: '创建检查组' } });
			},
			toDetail(id) {
				// 详情
				this.$Router.push({ path: '/pages/personal/teams/detail', query: { page: 'detail', title: '检查组详情', id } });
			}
		}
	}
</script>

<style lang="scss">
	.list {
		margin: 26rpx 0;
		padding: 32rpx 34rpx;
		.content {
			margin: 22rpx 0;
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
		}
	}
</style>
