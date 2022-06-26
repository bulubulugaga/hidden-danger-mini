<template>
	<view>
		<!-- 搜索 -->
		<search placeholder="请输入姓名/电话" @confirm="getList" @clear="getList('')"></search>
		
		<!-- 用户列表 -->
		<view class="user-list">
			<u-checkbox-group v-model="checkedUsers" placement="column">
				<view class="item round-10 u-flex-y-center bg-white" v-for="item in userList" :key="item.userId">
					<u-checkbox size="34rpx" shape="circle" active-color="#1FB3F7" :name="encodeURIComponent(JSON.stringify(item))"></u-checkbox>
					<view class="avatar">
						<u-avatar :src="item.avatarUrl" size="96rpx" default-url="/static/images/user/default_avatar.png"></u-avatar>
					</view>
					<view>
						<view class="f34 FB">{{ item.userName }}</view>
						<text class="f28 main-blue">{{ item.phone }}</text>
					</view>
				</view>
			</u-checkbox-group>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="button">
				<button hover-class="none" @click="handleConfirm">确定</button>
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
				userList: [],
				checkedUsers: []
			}
		},
		computed: {
			...mapGetters(['selectedOrg'])
		},
		onLoad() {
			this.checkedUsers = this.$Route.query.addUsers.map(item => encodeURIComponent(JSON.stringify(item)));
			this.getList('');
		},
		methods: {
			getList(e) {
				// 获取用户列表
				this.$http('personel.userList', {
					orgId: this.selectedOrg.id,
					condition: e
				}, 0).then(res => {
					if(res.code === 200) {
						this.userList = res.data;
					}
				})
			},
			handleConfirm() {
				// 确认
				const beforePage = getCurrentPages()[getCurrentPages().length- 2];
				beforePage.$vm.addUsers = this.checkedUsers.map(item => JSON.parse(decodeURIComponent(item)));
				this.$Router.back();
			}
		}
	}
</script>

<style lang="scss">
	.search {
		padding: 0 24rpx;
		height: 94rpx;
	}
	.user-list {
		padding: 0 30rpx 26rpx;
		.item {
			width: 690rpx;
			box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, .1);
			margin-top: 26rpx;
			padding: 22rpx 18rpx;
			.avatar {
				margin: 0 16rpx 0 10rpx;
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
		}
	}
</style>
