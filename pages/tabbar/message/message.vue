<template>
	<view>
		<!-- 自定义头部navbar -->
		<navbar :isBack="false">
			<view class="right round u-flex u-flex-between" slot="content">
				<e-select :initSelect="selectedType" :options="MsgType" :customStyle="selectStyle" @handleSelect="selectMsg"></e-select>
				<button class="button round f28 FB" hover-class="none" @click="handleRead">标记为已读</button>
			</view>
		</navbar>
		
		<!-- 消息列表 -->
		<view class="msg-list bg-white" v-for="item in msgList" :key="item.messageId" @click="toDetail(item)">
			<view class="u-flex">
				<view class="img">
					<u--image src="/static/images/message/msg_notice.png" width="60rpx" height="60rpx"></u--image>
					<!-- 未读展示圆点 -->
					<u-badge v-if="item.status === 1" bg-color="#FC4C2F" :isDot="true" :absolute="true" :offset="[0, 2]"></u-badge>
				</view>
				<view class="u-flex-fill">
					<view class="f34 FB">{{ item.messageType | msgTitle }}</view>
					<view class="intro f26 c666">
						<!-- 这里具体看后端返值情况再做调整 -->
						<!-- 检查组人员变动 -->
						<block v-if="item.messageType === 1">
							<text class="strong">{{ item.orgName }}</text>的<text class="strong">{{ item.groupName }}</text>检查组有人员变动。
						</block>
						<!-- 机构加入申请 -->
						<block v-else-if="item.messageType === 2">
							您所管理的<text class="strong">{{ item.orgName }}</text>有新的人员加入申请。
							申请人姓名：<text class="strong">{{ item.userName }}</text>，电话：<text class="strong">{{ item.phone }}</text>。
						</block>
						<!-- 机构加入通知 -->
						<block v-else-if="item.messageType === 3">
							<text class="strong">{{ item.orgName }}</text>已将您拉入该机构。
							管理员姓名：<text class="strong">{{ item.userName }}</text>，电话：<text class="strong">{{ item.phone }}</text>。
						</block>
					</view>
				</view>
			</view>
			<!-- 分割线 -->
			<u-line color="#ddd" margin="32rpx 0 0"></u-line>
			<u-cell-group :border="false">
				<u-cell
					isLink 
					:border="false" 
					:title="'时间：' + item.messageTime.split(' ')[0]"
					:title-style="{ fontSize: '26rpx', marginLeft: '46rpx', color: '#666' }"
					:right-icon-style="{ fontSize: '30rpx' }"
				>
					<text slot="value" class="f26 c666">查看详情</text>
				</u-cell>
			</u-cell-group>
		</view>
	</view>
</template>

<script>
	import Navbar from '@/components/navbar/Navbar.vue'
	import ESelect from '@/components/select/easy-select.vue'
	export default {
		components: {
			Navbar,
			ESelect
		},
		data() {
			return {
				selectStyle: { width: '240rpx', height: '68rpx', border: 'none' },  // 下拉选择框样式
				MsgType: [  // 消息类别
					{ value: '', label: '全部消息' },
					{ value: '1', label: '检查组人员变动' },
					{ value: '2', label: '机构加入申请' },
					{ value: '3', label: '机构加入通知' },
				],
				selectedType: { value: '', label: '全部消息' },   // 选中的消息类别
				msgList: [],
				loading: false   // 是否需要加载中
			}
		},
		onShow() {
			this.init();
		},
		onLoad() {
			
		},
		methods: {
			init() {
				this.getNoneNum();
				this.getList();
			},
			getList() {
				// 消息列表
				this.$http('message.getMsgList', {
					messageType: this.selectedType.value
				}, 0).then(res => {
					if(res.code === 200) {
						this.msgList = res.data;
					}
				})
			},
			getNoneNum() {
				// 未读消息数量
				this.$http('message.getMsgNum').then(res => {
					if(res.code === 200) {
						if(res.data) {
							// 消息数不为0展示
							uni.setTabBarBadge({
							  index: 1,
							  text: res.data.toString()
							})
						}
					}
				})
			},
			selectMsg(option) {
				// 切换消息类别
				this.selectedType = option;
				this.getList();
			},
			handleRead() {
				// 标记已读
				const userMessageIdList = this.msgList.map(o => o.userMessageId);
				if(!userMessageIdList.length) {
					uni.$u.toast('当前状态无消息！');
					return;
				}
				if(this.loading) {
					return;
				}
				this.loading = true;
				this.$http('message.readMsgList', {
					userMessageIdList
				}, 0).then(res => {
					if(res.code === 200) {
						uni.showToast({
							icon: 'success',
							title: '已全部标记为已读'
						})
						setTimeout(() => {
							this.init();
							this.loading = false;
						}, 1000)
					} else {
						this.loading = false;
					}
				})
			},
			toDetail(item) {
				// 查看详情
				// 调用已读
				if(item.status === 2) {
					// 已读不调接口，直接跳转
					this.toOther(item);
					return;
				}
				this.$http('message.readMsg', {
					userMessageId: item.userMessageId
				}, 0).then(res => {
					if(res.code === 200) {
						this.toOther(item);
						this.init();
					}
				})
			},
			toOther(item) {
				// 是否有进入详情的权限
				this.$http('message.getAprrove', {
					messageId: item.messageId
				}, 0).then(res => {
					if(res.code === 200) {
						if(res.data === '你已不具备访问该机构的权限!') {
							uni.$u.toast(res.data);
							return;
						}
						// 有权限
						switch(item.messageType) {
							case 1: // 检查组详情
								this.$Router.push({ 
									path: '/pages/personal/teams/detail', 
									query: { page: 'detail', title: '检查组详情', id: item.groupOrg }
								});
								break;
							case 2:
							case 3:  // 我的机构
								this.$Router.push({ 
									path: '/pages/personal/organization/organization', 
									query: { select: { value: item.groupOrg, label: item.orgName } }
								});
						}
					}
				})
				
			}
		},
		filters: {
			msgTitle(messageType) {
				switch(messageType) {
					case 1: return '检查组人员变动';
					case 2: return '机构加入申请';
					case 3: return '机构加入通知';
					default: return '未知类型';
				}
			}
		}
	}
</script>

<style lang="scss">
	.right {
		width: 496rpx;
		height: 68rpx;
		margin-left: 24rpx;
		padding-left: 20rpx;
		background-color: #F4F4F4;
		.button {
			width: 216rpx;
			height: 68rpx;
			line-height: 68rpx;
			background-color: transparent;
			color: #333;
			border: 1rpx solid #999;
		}
	}
	.msg-list {
		padding: 28rpx 24rpx 0;
		margin-top: 26rpx;
		.img {
			position: relative;
			width: 60rpx;
			height: 60rpx;
			margin-right: 16rpx;
		}
		.intro {
			margin-top: 20rpx;
			line-height: 42rpx;
			.strong {
				color: #1FB3F7;
				font-weight: bold;
			}
		}
	}
</style>
