<template>
	<view>
		<!-- 头部信息 -->
		<view class="header u-flex u-flex-between u-flex-items-center white">
			<u-avatar :src="userInfo.avatarUrl" size="160rpx" default-url="/static/images/user/default_avatar.png" @click="toEdit"></u-avatar>
			<view class="name u-flex-fill">
				<text class="f34 FB">{{ userInfo.name || '' }}</text><br />
				<text class="f28 u-line-1">{{ userInfo.phone || '' }}</text>
			</view>
			<u--image src="/static/images/user/edit.png" width="60rpx" height="60rpx" @click="toEdit"></u--image>
		</view>
		
		<!-- 我的机构和检查组 -->
		<view class="nav bg-white">
			<u-grid align="center" :border="false" :col="3">
				<u-grid-item v-for="item in navList" :key="baseListIndex" @click="$Router.push(item.route)">
					<u--image :src="item.src" width="88rpx" height="88rpx"></u--image>
					<text class="f28">{{ item.title }}</text>
				</u-grid-item>
			</u-grid>
		</view>
		
		<!-- 选项列表 -->
		<view class="bg-white">
			<u-cell-group :border="false">
			    <u-cell 
					isLink 
					size="large"
					v-for="item in options"
					:key="item.title"
					:border="false" 
					:name="item.name"
					:icon="item.icon"
					:title="item.title"
					:icon-style="{ width: '48rpx', height: '48rpx' }"
					:title-style="{ fontSize: '34rpx', marginLeft: '20rpx' }"
					:right-icon-style="{ fontSize: '30rpx' }"
					@click="toOptionLink(item.path, item.query, $event)" 
				></u-cell>
			</u-cell-group>
		</view>
		
		<!-- 退出登录 -->
		<view class="logout-button bg-white txt-center f34" @click="handleLogout">退出登录</view>
		
		<!-- 关于我们弹窗 -->
		<u-popup
			mode="center" 
			round="8rpx" 
			:show="showAboutUs" 
			:closeOnClickOverlay="false"
			:custom-style="{ width: '560rpx', height: '410rpx' }"
		>
			<view class="about-popup txt-center">
				<view class="title f40 FB">{{ name }}</view>
				<view class="mt f17">公众号：<text class="main-blue FB">园区EHS云管家</text></view>
				<u-line color="#E5E5E5" margin="86rpx 0 0"></u-line>
				<view class="my-popup-button" @click="showAboutUs = false">确定</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	export default {
		data() {
			return {
				navList: [
					{ src: '/static/images/user/nav_org.png', title: '我的机构', route: '/pages/personal/organization/organization' },
					{ src: '/static/images/user/nav_team.png', title: '检查组', route: '/pages/personal/teams/list' },
				],
				options: [
					{ name: 'chooseOrg',title: '切换机构', icon: '/static/images/user/option01.png', path: '/pages/login/organization/list' },
					{ name: 'createOrg',title: '创建机构', icon: '/static/images/user/option02.png', path: '/pages/login/organization/create', query: { showPopup: true }},
					{ name: 'applyOrg',title: '申请加入机构', icon: '/static/images/user/option03.png', path: '/pages/login/organization/apply' },
					{ name: 'aboutUs', title: '关于我们', icon: '/static/images/user/option04.png', path: '' }
				],
				showAboutUs: false
			}
		},
		computed: {
			...mapGetters(['userInfo', 'name'])
		},
		onLoad() {
			// 强制路由守卫
			// this.$Router.forceGuardEach();
		},
		onShow() {
			this.getUserInfo();
			uni.removeTabBarBadge({ index: 1 });
		},
		methods: {
			...mapActions(['getUserInfo', 'logout']),
			toEdit() {
				// 修改个人信息
				this.$Router.push('/pages/personal/editPersonel/edit');
			},
			toOptionLink(path, query, e) {
				// 点击跳转选项
				if(e.name === 'aboutUs') {
					// 关于我们弹窗
					this.showAboutUs = true;
					return;
				}
				// 其它按路径跳转
				this.$Router.push({ path, query });
			},
			handleLogout() {
				// 退出登录
				this.logout().then(() => {
					this.$Router.replaceAll('/pages/login/login');
				})
			}
		}
	}
</script>

<style lang="scss">
	.header {
		height: 336rpx;
		background-image: url($IMG_URL+'user_header.jpg');
		background-size: 100%;
		padding: 148rpx 112rpx 26rpx 48rpx;
		.name {
			margin-left: 24rpx;
			line-height: 50rpx;
		}
	}
	.nav {
		height: 160rpx;
		padding-top: 20rpx;
		margin-bottom: 26rpx;
	}
	.logout-button {
		margin-top: 26rpx;
		line-height: 88rpx;
	}
	.about-popup {
		padding-top: 106rpx;
		.mt {
			margin-top: 20rpx;
		}
	}
</style>
