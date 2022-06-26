<template>
	<view>
		<!-- 图片 -->
		<view class="header bg-white txt-center">
			<view class="img"><u--image :src="img" width="380rpx" mode="aspectFit" @click="previewImage"></u--image></view>
			隐患数量<text class="number main-red">{{ checkedList.length }}</text>条
		</view>
		
		<!-- 表单 -->
		<view class="form bg-white">
			<u--form :model="formData" :rules="rules" ref="uForm" errorType="toast">
				<u-form-item borderBottom prop="title" >
					<u-input v-model="formData.title" border="none" placeholder="请输入" font-size="34rpx" maxlength="50">
						<u--text text="表格抬头" slot="prefix" margin="0 36rpx 0 0" size="34rpx" color="#333"></u--text>
					</u-input>
				</u-form-item>
				<u-form-item prop="exportDate">
					<uni-datetime-picker type="date" v-model="formData.exportDate">
						<u-input v-model="formData.exportDate" border="none" placeholder="请输入" font-size="34rpx" readonly>
							<u--text 
								slot="prefix" 
								margin="0 36rpx 0 0" 
								size="34rpx" 
								color="#333"
								:text="typeTxt + '日期'" 
							></u--text>
						</u-input>
					</uni-datetime-picker>
				</u-form-item>
			</u--form>
		</view>
		
		<!-- 悬浮按钮新增 -->
		<view class="fix-button">
			<view class="box bg-white round u-flex-xy-center" @click="toSign">
				<text v-if="!isDraw" class="f34">签名</text>
				<u-icon 
					v-else
					name="checkmark" 
					label="已签" 
					color="#36D68D" 
					label-color="#36D68D" 
					label-pos="bottom"
					size="54rpx"
					label-size="28rpx"
					bold
					space="0rpx"
				></u-icon>
			</view>
		</view>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<button class="button" hover-class="none" @click="toCodePreview">导出</button>
		</view>
	</view>
</template>

<script>
	import { mapGetters } from 'vuex'
	import { previewImage } from '@/common/utils/tools.js'
	export default {
		data() {
			return {
				typeTxt: '',   // 检查/复查
				checkedList: [],   // 选择隐患列表
				img: 'http://notes.seeyou.ink/toc/images/test/user_header.jpg',
				formData: {
					hiddenIds: '',
					type: 1,
					title: '',
					exportDate: uni.$u.timeFrom(new Date()),
					inspectorSign: '',
					testerSign: ''
				},
				rules: {
					title: [{ required: true, message: '请输入机构名称', trigger: ['blur'] }],
					exportDate: [{ required: true, message: '请输入统一社会信用代码', trigger: ['blur'] }]
				},
				isDraw: false,   // 是否签名
				loading: false
			}
		},
		computed: {
			...mapGetters(['selectedTeam'])
		},
		onLoad() {
			const query = this.$Route.query;
			this.checkedList = query.checkedList;
			this.typeTxt = query.type === 1 ? '检查' : '复查';
			
			this.formData.hiddenIds = this.checkedList.join(',');
			this.formData.type = query.type;
			this.formData.title = `${this.typeTxt}表`;
			
			uni.setNavigationBarTitle({
			    title: `导出${this.typeTxt}表`
			});
			this.getDetail();
		},
		methods: {
			getDetail() {
				// 获取检查组详情(模板信息)
				this.$http('personel.teamDetail', {
					id: this.selectedTeam.value
				}, 0).then(res => {
					if(res.code === 200) {
						this.img = this.formData.type === 1 ? res.data.checkUrl : res.data.reviewUrl;
					}
				})
			},
			previewImage() {
				// 预览图片
				previewImage([this.img]);
			},
			toSign() {
				// 签名
				this.$Router.push({ path: '/pages/home/exportChecklist/sign/sign', query: { title: '检查人签名' } });
			},
			toCodePreview() {
				// 二维码预览
				if(this.loading) {
					return;
				}
				this.loading = true;
				this.$http('home.export', this.formData, 0).then(res => {
					if(res.code === 200) {
						uni.showToast({
							title: '已导出',
							icon: 'success'
						})
						const _this = this;
						setTimeout(() => {
							_this.$Router.push({
								path: '/pages/home/exportChecklist/codePreview/codePreview',
								query: { fileData: encodeURIComponent(JSON.stringify(res.data)) },
							});
							_this.loading = false;
						}, 1000)
					} else {
						this.loading = false;
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.header {
		padding-bottom: 36rpx;
		.img {
			width: 380rpx;
			padding: 24rpx 0;
			margin: 0 auto;
		}
		.number {
			margin-left: 24rpx;
		}
	}
	.form {
		margin-top: 26rpx;
		padding: 0 24rpx;
	}
	.fix-button {
		height: 220rpx;
		.box {
			position: fixed;
			bottom: 188rpx;
			right: 30rpx;
			width: 120rpx;
			height: 120rpx;
			line-height: 120rpx;
			box-shadow: 0 4rpx 10rpx 0 rgba(0, 0, 0, .1);
		}
	}
	.footer {
		height: 94rpx;
		.button {
			position: fixed;
			bottom: 0;
			left: 0;
			width: 100%;
			line-height: 94rpx;
			border-radius: 0;
		}
	}
</style>
