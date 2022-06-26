<template>
	<view>
		<view class="org-list-item bg-white u-flex u-flex-between" v-for="item in orgList" :key="item.id" @click="handleChoose(item)">
			<view class="left">
				<view class="u-line-1 FB f34">{{ item.name }}</view>
				<view class="second u-flex f26 c666">
					<view class="admin">管理员：{{ item.adminName }}</view>
					<view class="u-flex-fill">机构人数：{{ item.userNum }}</view>
				</view>
			</view>
			
			
			<view class="right u-flex u-flex-items-center u-flex-end">
				<!-- 选择机构 -->
				<block v-if="item.status === 2 || (item.type === 1 && item.deadlineStatus === 2)" >
					<view
						class="status-tag f24 round-4 txt-center white" 
						:style="{backgroundColor: item.status === 2 ? '#1FB3F7' : '#FC4C2F'}">
						{{ getStatusText(item) }}
					</view>
					<u-icon v-if="!apply" name="arrow-right" color="#C7C7CC" size="30rpx"></u-icon>
				</block>
				
				<!-- 申请加入机构 -->
				<block v-else-if="apply">
					<view v-if="item.userStatus === 1" class="apply-tip FB f28">管理员确认中</view>
					<button v-else class="apply-button round-4 f28" hover-class="none" @click.stop="handleApply(item.id)">申请加入</button>
				</block>
				
				
				
			</view>
		</view>
		
		<!-- 申请加入弹窗 -->
		<apply-popup ref="applyPopup" @confirm="confirmApply"></apply-popup>
	</view>
</template>

<script>
	import { mapGetters, mapMutations } from 'vuex';
	import { ApplyPopup } from './ApplyPopup.vue'
	export default {
		props: {
			orgList: {  // 列表数据
				type: Array,
				default() {
					return []
				}
			},
			apply: {  // 是否为申请加入机构
				type: Boolean,
				default: false
			}
		},
		components: {
			ApplyPopup
		},
		data() {
			return {
				
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		methods: {
			...mapMutations(['setSelectedOrg']),
			getStatusText(item) {
				// 过滤状态
				if(item.status === 2) {
					return '已冻结'
				} else if(item.type === 1 && item.deadlineStatus === 2) {
					return '已到期'
				} else {
					return '正常'
				}
			},
			handleChoose(item) {
				// 选择机构
				
				// 申请加入机构不做处理
				if(this.apply) {
					return;
				}
				// 已冻结|已到期
				if(item.status === 2) {
					uni.showToast({
						icon:'error',
					    title: `机构已冻结`
					});
					return;
				} else if(item.type === 1 && item.deadlineStatus === 2) {
					uni.showToast({
						icon:'error',
					    title: `试用已到期`
					});
					return;
				}
				// 存储选择机构信息，跳转首页
				this.setSelectedOrg(item);
				this.$Router.pushTab('/pages/tabbar/home/home');
			},
			handleApply(id) {
				// 申请加入机构
				this.$refs.applyPopup.formData = {
					orgId: id,
					userName: this.userInfo.name,
					remark: ''
				}
				this.$refs.applyPopup.isShow = true;
			},
			confirmApply() {
				// 确认申请
				this.$emit('confirmApply');
			}
		}
	}
</script>

<style scoped lang="scss">
	.org-list-item {
		margin-top: 26rpx;
		padding: 24rpx 24rpx 40rpx 34rpx;
		.left {
			width: 520rpx;
			.second {
				margin-top: 30rpx;
			}
			.admin {
				width: 290rpx;
			}
		}
		.right {
			width: 170rpx;
			.status-tag {
				width: 120rpx;
				height: 48rpx;
				line-height: 48rpx;
				margin-right: 10rpx;
			}
			
			/* 申请加入 */
			.apply-button {
				width: 160rpx;
				line-height: 64rpx;
			}
			.apply-tip {
				color: #FC4C2F;
			}
		}
	}
</style>
