<template>
	<view>
		<!-- 头部 -->
		<view class="header u-flex u-flex-between bg-white">
			<view>
				<e-select :initSelect="currentOrg" :options="orgs" :customStyle="selectStyle" @handleSelect="selectOrg"></e-select>
				<view class="mt f28 u-flex">
					<view class="admin">管理员：{{ info.adminName || '' }}</view>
					<view>管理员电话：<text class="main-blue" @click="call(info.phone)">{{ info.phone }}</text></view>
				</view>
			</view>
			<u--image v-if="isAdmin" src="/static/images/user/edit_black.png" width="60rpx" height="60rpx" @click="handleShowEidtPopup"></u--image>
		</view>
		
		<!-- 申请列表 -->
		<view class="apply-list bg-white" v-if="isAdmin && applyList.length">
			<view class="u-flex-y-center">
				<view class="line bg-main-blue"></view>
				<view class="f36 FB">申请列表</view>
			</view>
			<view class="item round-10" v-for="item in applyList" :key="item.id">
				<view class="u-flex-y-center">
					<u-avatar :src="item.avatarUrl" size="96rpx" default-url="/static/images/user/default_avatar.png"></u-avatar>
					<view class="name u-flex-fill">
						<view class="f34 FB">{{ item.name }}</view>
						<text class="f28 main-blue u-line-1" @click="call(item.phone)">{{ item.phone }}</text>
					</view>
					<view class="refuse main-red" @click="handleApprove(item.id, 2)">拒绝</view>
					<view class="agree main-blue" @click="handleApprove(item.id, 1)">同意</view>
				</view>
				<u-line color="#ddd" margin="16rpx 0"></u-line>
				<view class="remark f26">申请备注：<text class="c999">{{ item.remark || '无' }}</text></view>
			</view>
		</view>
		
		<!-- 人员列表 -->
		<view class="person-list bg-white">
			<view class="u-flex-y-center">
				<view class="line bg-main-blue"></view>
				<view class="f36 FB u-flex-fill">人员列表</view>
				<u--image src="/static/images/user/add.png" width="46rpx" height="46rpx" @click="isShowInvitePopup = true"></u--image>
			</view>
			<!-- 搜索框 -->
			<search 
				placeholder="请输入姓名或电话" 
				bg-color="#F8F8F8"
				circle
				:custom-style="{ marginTop: '26rpx' }"
				@confirm="searchUser" 
				@clear="searchUser('')"
			></search>
			<!-- 列表 -->
			<view class="item round-10 u-flex-y-center" v-for="item in userList" :key="item.id">
				<u-avatar :src="item.avatarUrl" size="96rpx" default-url="/static/images/user/default_avatar.png"></u-avatar>
				<view class="name u-flex-fill">
					<view class="f34 FB">{{ item.name }}</view>
					<text class="f28 main-blue u-line-1" @click="call(item.phone)">{{ item.phone }}</text>
				</view>
				<!-- u-switch未知原因，关闭时原点偏移消失 -->
				<!-- 管理员可修改，且状态不为管理员 -->
				<switch v-if="isAdmin && item.status !== 4" :checked="item.status === 2" color="#08B906" @change="changePerson(item.id, $event)"></switch>
			</view>
		</view>
		
		<!-- 修改机构信息弹窗 -->
		<edit-org-popup ref="editOrgPopup" @editOrg="editOrgSuccess"></edit-org-popup>
		<!-- 邀请人员弹窗 -->
		<invite-person-popup v-if="isShowInvitePopup" :orgId="currentOrg.value" @submit="handleInvite" @closePopup="isShowInvitePopup = false"></invite-person-popup>
	</view>
</template>

<script>
	import ESelect from '@/components/select/easy-select.vue'
	import Search from '@/components/search/Search.vue'
	import EditOrgPopup from './EditOrgPopup.vue'
	import InvitePersonPopup from './InvitePersonPopup.vue'
	import { callPhone } from '@/common/utils/tools.js'
	import { mapGetters } from 'vuex'
	export default {
		components: {
			ESelect,
			Search,
			EditOrgPopup,
			InvitePersonPopup
		},
		data() {
			return {
				isAdmin: false,
				
				selectStyle: { width: '260rpx', height: '68rpx', border: 'none', fontSize: '36rpx', color: '#333', fontWeight: 'bold' },  // 下拉选择框样式
				orgs: [],  // 机构列表
				currentOrg: {},   // 选中的机构
				info: {},   // 选中的机构详情
				
				applyList: [],   // 申请列表
				userList: [],   // 用户列表
				
				
				isShowInvitePopup: false,
				
				loading: false   // 审批加载
			}
		},
		computed: {
			...mapGetters(['userInfo', 'selectedOrg'])
		},
		onLoad() {
			this.getOrgList();
		},
		methods: {
			getOrgList() {
				// 机构列表
				this.$http('personel.getOrgList', {}, 0).then(res => {
					if(res.code === 200) {
						this.orgs = res.data.map(item => ({
							value: item.id,
							label: item.name
						}))
						// 默认路由传参或者当前选择的机构
						if(this.$Route.query.select) {
							this.currentOrg = this.$Route.query.select
						} else {
							this.currentOrg = {
								value: this.selectedOrg.id,
								label: this.selectedOrg.name
							};
						}
						this.getOrgDetail();
					}
				})
			},
			getOrgDetail() {
				// 机构详情
				this.applyList = [];
				this.userList = [];
				this.$http('personel.getOrgDetail', {
					id: this.currentOrg.value
				}, 0).then(res => {
					if(res.code === 200) {
						this.info = res.data;
						// 是否管理员
						this.isAdmin = res.data.adminId === this.userInfo.id;
						// 过滤用户列表
						this.info.orgUserList.forEach(item => {
							if(item.status === 1) {
								this.applyList.push(item);
							} else {
								this.userList.push(item);
							}
						})
					}
				})
			},
			selectOrg(option) {
				// 切换机构
				this.currentOrg = option;
				this.getOrgDetail();
			},
			call(phone) {
				uni.showModal({
					content: `是否拨打${phone}电话?`,
					success: subRes => {
						if (subRes.confirm) {
							callPhone(phone);
						}
					}
				})
			},
			handleApprove(id, acceptOrNot) {
				// 审批申请用户
				if(this.loading) {
					// 当前还有审批状态
					return;
				}
				this.loading = true;
				this.$http('personel.approveOrgApply', {
					id,
					acceptOrNot
				}, 0).then(res => {
					if(res.code === 200) {
						uni.showToast({
							icon: 'success',
							title: res.data
						})
						const _this = this;
						setTimeout(() => {
							_this.getOrgDetail();
							_this.loading = false;
						}, 1000)
					} else {
						this.loading = false;
					}
				})
			},
			searchUser(e) {
				// 搜索用户
				this.$http('personel.getOrgUser', {
					orgId: this.currentOrg.value,
					searchValue: e
				}, 0).then(res => {
					if(res.code === 200) {
						this.userList = res.data;
					}
				})
			},
			changePerson(id, e) {
				// 修改用户状态
				this.$http('personel.frozenOrgUser', {
					id
				}, 0).then(res => {
					const title = e.detail.value ? '人员已解除冻结' : '人员已被冻结';
					uni.showToast({
						icon: 'success',
						title
					})
				})
			},
			handleShowEidtPopup() {
				// 修改机构信息
				this.$refs.editOrgPopup.formData = {
					id: this.info.id,
					name: this.info.name,
					code: this.info.code
				}
				this.$refs.editOrgPopup.isShow = true;
			},
			editOrgSuccess(e) {
				// 修改成功，修改页面信息(不涉及id信息，直接修改页面，减少数据请求)
				this.info.name = e.name;
				this.info.code = e.code;
				this.currentOrg.label = e.name;
			},
			handleInvite() {
				// 邀请用户重新请求数据（涉及用户id冻结）
				this.getOrgDetail();
				this.isShowInvitePopup = false;
			}
		}
	}
</script>

<style lang="scss">
	.header {
		height: 168rpx;
		padding: 24rpx 24rpx 0 10rpx;
		.mt {
			margin-top: 8rpx;
		}
		.admin {
			margin-left: 16rpx;
			width: 276rpx;
		}
	}
	
	.apply-list, .person-list {
		margin: 26rpx 0;
		padding: 30rpx 30rpx 44rpx;
		.line {
			width: 8rpx;
			height: 38rpx;
			margin-right: 12rpx;
		}
		.item {
			width: 690rpx;
			box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, .1);
			margin-top: 26rpx;
			padding: 16rpx 14rpx;
			.name {
				margin-left: 16rpx;
			}
			.agree {
				margin: 0 30rpx 0 40rpx;
			}
			.remark {
				line-height: 40rpx;
			}
		}
	}
	.person-list .item {
		padding: 22rpx 14rpx;
	}
</style>
