<template>
	<view>
		<!-- 基本信息 -->
		<view class="base bg-white">
			<u--form ref="uForm" error-type="toast" :model="formData" :rules="rules">
				<u-form-item prop="groupName">
					<u-input 
						v-model="formData.groupName" 
						border="none" 
						placeholder="请输入" 
						font-size="34rpx"  
						maxlength="20" 
						disabled-color="transparent"
						:disabled="!isEdit"
					>
						<view slot="prefix" class="prefix-input f34 txt-right">
							<text v-if="page !== 'detail'" class="main-red">*</text>检查组名称
						</view>
					</u-input>
				</u-form-item>
				<u-form-item>
					<u-input 
						v-model="formData.groupDescrip" 
						border="none" 
						placeholder="请输入" 
						font-size="34rpx" 
						maxlength="50"
						disabled-color="transparent"
						:disabled="!isEdit"
					>	
						<view slot="prefix" class="prefix-input f34 txt-right">检查组描述</view>
					</u-input>
				</u-form-item>
			</u--form>
		</view>
		
		<!-- 模板 -->
		<view class="template-box bg-white">
			<view class="prefix-input f34 txt-right">
				<text v-if="page !== 'detail'" class="main-red">*</text>检查表模板
			</view>
			<view class="template u-flex u-flex-between">
				<!-- 上传 -->
				<view v-for="item in templateList" :key="item.name" @click="toTemplate(item)">
					<view class="upload u-flex-xy-center">
						<view class="img-box" v-if="page === 'detail' || formData[item.propSrc]">
							<view class="img-title f26 u-line-1 bg-main-blue white txt-center">{{ formData[item.propTitle] }}</view>
							<u--image :src="formData[item.propSrc]" width="196rpx" height="248rpx" mode="aspectFit"></u--image>
						</view>
						<u-icon v-else name="/static/images/user/add_gray.png" width="52rpx" height="52rpx"></u-icon>					
					</view>
					<view class="txt-center">{{ item.name }}</view>
				</view>
			</view>
		</view>
		
		<!-- 小组成员 -->
		<view class="people bg-white">
			<view class="u-flex-y-center">
				<view class="line bg-main-blue"></view>
				<view class="f36 FB">小组成员</view>
			</view>
			<!-- 详情搜索功能 -->
			<search
				v-if="page === 'detail'"
				placeholder="请输入姓名或电话" 
				bg-color="#F8F8F8"
				circle
				:custom-style="{ marginTop: '26rpx' }"
				@confirm="searchKey" 
				@clear="searchKey('')"
			></search>
			<!-- 人员宫格 -->
			<u-grid :border="false" col="5">
				<!-- 添加用户 -->
				<u-grid-item v-if="page === 'create'">
					<view class="avatar">
						<u-avatar :src="userInfo.avatarUrl" size="96rpx" default-url="/static/images/user/default_avatar.png"></u-avatar>
					</view>
					<text class="f28">{{ userInfo.name }}</text>
				</u-grid-item>
				<u-grid-item v-if="page !== 'detail'">
					<view class="add-user-img">
						<u-image src="/static/images/user/add_user.png" width="108rpx" height="108rpx" @click="toAddUser"></u-image>
					</view>
				</u-grid-item>
				<!-- 用户列表 -->
				<u-grid-item v-for="(item, index) in formData.userResultList" :key="item.userId">
					<view class="avatar" @click="handleUser(item)">
						<u-avatar :src="item.avatarUrl" size="96rpx" default-url="/static/images/user/default_avatar.png"></u-avatar>
						<!-- 删除按钮(默认第一个是创建人，不可删除，普通用户不能删除) -->
						<view v-if="isEdit && index !== 0" class="delete" @click.stop="handleDeleteOUser(index)">
							<u-image src="/static/images/user/delete.png" width="42rpx" height="42rpx"></u-image>
						</view>
					</view>
					<text class="f28">{{ item.userName }}</text>
				</u-grid-item>
				<u-grid-item v-for="(item, index) in addUsers" :key="item.userId">
					<view class="avatar" @click="handleUser(item)">
						<u-avatar :src="item.avatarUrl" size="96rpx" default-url="/static/images/user/default_avatar.png"></u-avatar>
						<!-- 删除按钮 -->
						<view v-if="page !== 'detail'" class="delete" @click.stop="handleDeleteUser(index)">
							<u-image src="/static/images/user/delete.png" width="42rpx" height="42rpx"></u-image>
						</view>
					</view>
					<text class="f28">{{ item.userName }}</text>
				</u-grid-item>
			</u-grid>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="button u-flex u-flex-between">
				<!-- 详情 -->
				<block v-if="page === 'detail'">
					<!-- 管理员不能退出 -->
					<button v-if="!isAdmin" class="quit bg-white main-red" hover-class="none" @click="isShowQuit = true">退出检查组</button>
					<button class="u-flex-fill" hover-class="none" @click="toEdit">修改</button>
				</block>
				<!-- 创建或编辑 -->
				<button v-else class="u-flex-fill" hover-class="none" @click="handleConfirm">确定</button>
			</view>
		</view>
		
		<!-- 退出检查组确认弹窗 -->
		<u-modal 
			content="退出后无法整改检查组隐患，确认退出吗？" 
			width="560rpx"
			:show="isShowQuit" 
			:zoom="false"
			:show-cancel-button="true"
			@confirm="handleQuit"
			@cancel="isShowQuit = false"
		></u-modal>
		
		<!-- 用户信息弹窗 -->
		<user-popup v-if="showUserPopup" :info="handleUserInfo" @closePopup="showUserPopup = false"></user-popup>
	</view>
</template>

<script>
	import Search from '@/components/search/Search.vue'
	import UserPopup from './UserPopup.vue'
	import { mapGetters } from 'vuex'
	import { previewImage } from '@/common/utils/tools.js'
	export default {
		components: {
			Search,
			UserPopup
		},
		data() {
			return {
				page: this.$Route.query.page,   // 当前页面
				formData: { // 表单数据
					groupName: '',
					groupDescrip: '',
					checkId: '',
					checkUrl: '',
					checkName: '',
					reviewId: '',
					reviewUrl: '',
					reviewName: ''
				},
				rules: {
					groupName: [{ required: true, message: '请输入检查组名称', trigger: ['blur'] }]
				},
				templateList: [
					{ name: '检查表', type: 1, propSrc: 'checkUrl', propTitle: 'checkName' },
					{ name: '复查表', type: 2, propSrc: 'reviewUrl', propTitle: 'reviewName' }
				],
				
				addUsers: [],  // 新添加的用户
				deleteUsers: [],  // 删除的用户
				isAdmin: false,   // 是否为管理员
				
				isShowQuit: false,
				showUserPopup: false,   // 用户信息弹窗
				
				id: this.$Route.query.id,   // 详情和编辑下检查组id
				handleUserInfo: ''   // 详情下点击的用户
			}
		},
		computed: {
			...mapGetters(['selectedOrg', 'userInfo']),
			isEdit() {
				// 是否能编辑所有内容(创建页面或者修改页面且为管理员)
				return this.page === 'create' || (this.page === 'edit' && this.isAdmin);
			}
		},
		onShow() {
			if(this.page === 'detail') {
				this.getDetail();
			}
		},
		onLoad() {
			this.page = this.$Route.query.page;
			uni.setNavigationBarTitle({ title: this.$Route.query.title });
			
			this.id = this.$Route.query.id;
			
			if(this.page === 'edit') {
				this.getDetail();
			}
		},
		methods: {
			getDetail() {
				// 获取详情
				this.$http('personel.teamDetail', {
					id: this.id
				}, 0).then(res => {
					if(res.code === 200) {
						this.formData = res.data;
						this.isAdmin = this.formData.createUser === this.userInfo.id;
					}
				})
			},
			toTemplate(item) {
				// 模板列表
				if(this.isEdit) {
					this.$Router.push({ path: '/pages/personal/teams/template/template', query: { type: item.type } });
				}
				if(this.page === 'detail') {
					// 详情预览
					previewImage([this.formData[item.propSrc]]);
				}
			},
			toAddUser() {
				// 添加人员
				const addUsers = this.addUsers.map(item => encodeURIComponent(JSON.stringify(item)));
				this.$Router.push({ path: '/pages/personal/teams/addUser/addUser', query: { addUsers } });
			},
			handleDeleteUser(index) {
				// 删除人员
				this.addUsers.splice(index, 1);
			},
			handleDeleteOUser(index) {
				// 删除原有用户
				this.deleteUsers.push({
					userId: this.formData.userResultList[index].userId,
					status: this.formData.userResultList[index].status,
				})
				this.formData.userResultList.splice(index, 1);
			},
			handleQuit() {
				// 退出检查组
				this.$http('personel.updateTeam', {
					...this.formData,
					// delUserList: [{ userId: this.userInfo.id, status: this.userInfo.status }]
					delUserList: [{ userId: this.userInfo.id, status: 1 }]
				}, '修改中...').then(res => {
					if(res.code === 200) {
						uni.showToast({
							title: '已退出',
							icon: 'success'
						})
						this.isShowQuit = false;
						this.$Router.back();
					}
				})
			},
			toEdit() {
				// 修改
				this.$Router.push({ path: '/pages/personal/teams/detail', query: { page: 'edit', title: '修改检查组', id: this.id } });
			},
			handleConfirm() {
				this.$refs.uForm.validate().then(res => {
					if(!this.formData.checkId) {
						this.$u.toast('请选择检查表模板');
						return;
					}
					if(!this.formData.reviewId) {
						this.$u.toast('请选择复查表模板');
						return;
					}
					
					if(this.page === 'create') {
						// 创建
						this.$http('personel.createTeam', {
							...this.formData,
							orgId: this.selectedOrg.id,
							// addUserList: this.addUsers.map(item => ({ userId: item.userId, status: item.status }))
							addUserList: this.addUsers.map(item => ({ userId: item.userId, status: 1 }))
						}, '创建中...').then(res => {
							if(res.code === 200) {
								uni.showToast({
									title: '创建成功',
									icon: 'success'
								})
								this.$Router.back();
							}
						})
					} else {
						// 修改
						this.$http('personel.updateTeam', {
							...this.formData,
							// addUserList: this.addUsers.map(item => ({ userId: item.userId, status: item.status }))
							addUserList: this.addUsers.map(item => ({ userId: item.userId, status: 1 })),
							delUserList: this.deleteUsers
						}, '修改中...').then(res => {
							if(res.code === 200) {
								uni.showToast({
									title: '修改成功',
									icon: 'success'
								})
								this.$Router.back();
							}
						})
					}
					
				})
			},
			searchKey(e) {
				// 搜索用户
				this.$http('personel.getUserList', {
					id: this.id,
					condition: e
				}, 0).then(res => {
					if(res.code === 200) {
						this.formData.userResultList = res.data;
					}
				})
			},
			handleUser(userInfo) {
				// 点击用户头像
				if(this.page === 'detail') {
					this.handleUserInfo = userInfo;
					this.showUserPopup = true;
				}
			}
		}
	}
</script>

<style lang="scss">
	.base {
		padding: 0 30rpx;
		margin: 16rpx 0;
	}
	.prefix-input {
		width: 190rpx;
		margin-left: -20rpx;
		margin-right: 40rpx;
	}
	.template-box {
		padding: 20rpx 30rpx 10rpx;
		margin: 16rpx 0;
		.template {
			width: 476rpx;
			margin: 54rpx auto 44rpx;
			.upload {
				width: 196rpx;
				height: 248rpx;
				border: 2rpx dashed #DDDDDD;
				margin-bottom: 14rpx;
			}
			.img-box {
				position: relative;
			}
			.img-title {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				width: 100%;
				line-height: 42rpx;
				z-index: 2;
			}
		}
	}
	.people {
		padding: 30rpx 30rpx 100rpx;
		margin: 16rpx 0;
		.line {
			width: 8rpx;
			height: 38rpx;
			margin-right: 12rpx;
		} 
		.add-user-img {
			padding: 28rpx 0;
		}
		.avatar {
			position: relative;
			margin: 22rpx 0 8rpx;
			.delete {
				position: absolute;
				right: -16rpx;
				top: -4rpx;
				z-index: 1;
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
