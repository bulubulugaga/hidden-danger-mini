<template>
	<view>
		<!-- 头部 -->
		<view class="header bg-main-blue white">
			<view class="FB u-line-1 f36">{{ selectedOrg.name }}</view>
			<view class="header-number u-flex u-flex-between txt-center">
				<view>
					<view class="FB f48">{{ number.groupQty }}</view>
					<view class="header-txt f26">检查组数</view>
				</view>
				<view>
					<view class="FB f48">{{ number.hiddenQty }}</view>
					<view class="header-txt f26">累计隐患排查数</view>
				</view>
			</view>
		</view>
		
		<!-- 搜索框 -->
		<view class="search bg-white round-10 u-flex u-flex-between u-flex-items-center">
			<view class="f34">检查组</view>
			<view class="right u-flex-fill round u-flex u-flex-between">
				<e-select 
					:initSelect="selectedTeam" 
					:options="teams" 
					:disabled="false" 
					:customStyle="selectStyle" 
					@handleSelect="handleSelectTeam"
					@handleChangeInput="handleSearchTeam"
				></e-select>
				<button class="button round f34" hover-class="none" @click="toDangerManage">进入</button>
			</view>
		</view>
		
		<!-- 隐患列表 -->
		<hidden-danger-list :list="list"></hidden-danger-list>
		
		<!-- 姓名弹窗 -->
		<name-popup v-if="showPopup" @handleComfirm="handleComfirm"></name-popup>
	</view>
</template>

<script>
	import ESelect from '@/components/select/easy-select.vue'
	import HiddenDangerList from '@/components/hiddenDangerList/HiddenDangerList.vue'
	import NamePopup from './NamePopup.vue'
	import { mapGetters, mapMutations } from 'vuex';
	export default {
		components: {
			ESelect,
			HiddenDangerList,
			NamePopup
		},
		data() {
			return {
				selectStyle: { width: '360rpx', height: '68rpx', border: 'none' },   // 下拉选择样式
				number: {},   // 数量统计
				teams: [],   // 检查组列表
				selectedTeam: {},   // 选择的检查组
				list: [],
				showPopup: false  // 展示姓名弹窗
			}
		},
		computed: {
			...mapGetters(['selectedOrg', 'userInfo'])
		},
		onShow() {
			if(!this.userInfo.name) {
				// 用户姓名为空，展示姓名弹窗
				this.showPopup = true;
				uni.hideTabBar();
			} else {
				this.showPopup = false;
				uni.showTabBar();
			}
			uni.removeTabBarBadge({ index: 1 });
			this.getTeamList();
			// this.getList();
			this.getNumber();
		},
		onLoad() {
			
		},
		methods: {
			...mapMutations(['setSelectedTeam']),
			getTeamList(key) {
				// 获取检查组列表
				this.$http('personel.teamList', {
					orgId: this.selectedOrg.id,
					condition: key || ''
				}, 0).then(res => {
					if(res.code === 200) {
						this.teams = res.data.map(item => ({
							value: item.id,
							label: item.groupName
						}))
						if(this.teams.length) {
							this.selectedTeam = this.teams[0];
							this.getList();
						} else {
							this.selectedTeam = {}
						}
					}
				})
			},
			getList() {
				// 获取隐患列表
				// 获取所有检查组所有列表
				// this.$http('home.homeDangerList', {
				// 	orgId: this.selectedOrg.id
				// }, 0).then(res => {
				// 	if(res.code === 200) {
				// 		this.list = res.data;
				// 	}
				// })
				// 获取当前检查组隐患列表
				this.$http('home.dangerList', {
					orgId: this.selectedOrg.id,
					groupId: this.selectedTeam.value,
				}, 0).then(res => {
					if(res.code === 200) {
						this.list = res.data;
					}
				})
			},
			getNumber() {
				// 数量统计
				this.$http('home.homeNumber', {
					orgId: this.selectedOrg.id
				}, 0).then(res => {
					if(res.code === 200) {
						this.number = res.data;
					}
				})
			},
			handleSelectTeam(option) {
				// 选择检查组
				this.selectedTeam = option;
				this.getList();
			},
			handleSearchTeam(e) {
				// 搜索检查组
				this.getTeamList(e);
			},
			toDangerManage() {
				// 隐患管理
				if(!Object.keys(this.selectedTeam).length) {
					uni.$u.toast('请先选择检查组');
					return;
				}
				this.setSelectedTeam(this.selectedTeam);
				this.$Router.push({ path: '/pages/home/dangerManage/list' });
			},
			handleComfirm() {
				// 提交姓名，关闭弹窗
				this.showPopup = false;
				uni.showTabBar();
			}
		}
	}
</script>

<style lang="scss">
	.header {
		width: 100%;
		height: 386rpx;
		padding: 54rpx 24rpx;
		&-number {
			padding: 40rpx 134rpx;
		}
		&-txt {
			margin-top: 10rpx;
		}
	}
	.search {
		width: 702rpx;
		height: 140rpx;
		margin: -70rpx auto 0;
		padding: 0 24rpx;
		box-shadow: 0 8rpx 16rpx 0 rgba(0, 0, 0, .08);
		.right {
			margin-left: 20rpx;
			padding-left: 20rpx;
			background-color: #F4F4F4;
			.button {
				width: 140rpx;
				height: 68rpx;
				line-height: 68rpx;
			}
		}
	}
</style>
