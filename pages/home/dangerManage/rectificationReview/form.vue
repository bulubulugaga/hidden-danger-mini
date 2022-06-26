<template>
	<view>
		<u--form ref="uForm" error-type="toast" :model="formData" :rules="rules">
			<view class="item">
				<u-form-item prop="description">
					<view class="top-title"><text class="required">*</text>{{ statusTxt }}说明</view>
					<u-textarea v-model="formData.description" placeholder="请输入" border="none" maxlength="50" height="142rpx" 
						:placeholder-style="{ fontSize: '34rpx', color: '#B2B2B2' }" :disable-default-padding="true">
					</u-textarea>
				</u-form-item>
			</view>
			<!-- 图片 -->
			<view class="item upload-contanier">
				<u-form-item>
					<view class="top-title mb">{{ statusTxt }}图片</view>
					<u-upload accept="image" multiple width="140rpx" height="140rpx" :maxCount="3"
						:fileList="imgList" @afterRead="afterUpload" @delete="deleteImg">
						<view v-if="!readonly" class="upload u-flex-xy-center">
							<u-icon name="camera" size="70rpx" color="#ddd"></u-icon>
						</view>
					</u-upload>
				</u-form-item>
			</view>
			<view class="item">
				<u-form-item prop="operator">
					<u-input v-model="formData.operator" border="none" placeholder="请输入" font-size="34rpx" maxlength="10">
						<view slot="prefix" class="prefix-input"><text class="required">*</text>{{ statusTxt }}人</view>
					</u-input>
				</u-form-item>
				<u-form-item prop="operatingTime">
					<uni-datetime-picker type="date" v-model="formData.operatingTime">
						<u-input v-model="formData.operatingTime" border="none" placeholder="请输入" font-size="34rpx" readonly>
							<view slot="prefix" class="prefix-input"><text class="required">*</text>{{ statusTxt }}时间</view>
						</u-input>
					</uni-datetime-picker>
				</u-form-item>
			</view>
		</u--form>
		
		<!-- 底部按钮 -->
		<view class="footer">
			<view class="button u-flex u-flex-between">
				<!-- 复核隐患 -->
				<block v-if="status === '2'">
					<button class="quit bg-main-red" hover-class="none" @click="handleReview(2)">不合格</button>
					<button class="u-flex-fill" hover-class="none" @click="handleReview(1)">合格</button>
				</block>
				<!-- 整改隐患 -->
				<button v-else class="u-flex-fill" hover-class="none" @click="handleSubmit">确定</button>
			</view>
		</view>
	</view>
</template>

<script>
    //上传图片api
	import { uploadFile } from '@/common/request/uploadFile.js'
	import { mapGetters } from 'vuex'
	export default { 
		data() {
			return {
				status: this.$Route.query.status,
				statusTxt: '',
				formData: {
					hiddenId: '',
					description: '',
					operator: '',
					pictureIds: '',
					operatingTime: uni.$u.timeFrom(new Date())
				},
				rules: {
					description: [{ required: true, message: '请输入整改说明', trigger: ['blur'] }],
					operator: [{ required: true, message: '请输入整改人', trigger: ['blur'] }],
					operatingTime: [{ required: true, message: '请选择整改时间', trigger: ['blur'] }]
				},
				imgList: [],
				imgIdList: [],
				loading: false
			}
		},
		computed: {
			...mapGetters(['userInfo'])
		},
		onLoad() {
			this.formData.hiddenId = this.$Route.query.id;
			this.status = this.$Route.query.status;
			this.statusTxt = this.status === '1' ? '整改' : '复核'
			uni.setNavigationBarTitle({
				title: `${this.statusTxt}隐患`
			})
			this.formData.operator = this.userInfo.name;
		},
		methods: {
			afterUpload(e) {
				// 上传图片
				uploadFile(e.file).then(res => {
					// 图片预览
					this.imgList = [...this.imgList, ...e.file];
					// 图片id
					this.imgIdList = [...this.imgIdList, ...res];
				})
			},
			deleteImg(e) {
				// 删除图片
				this.imgList.splice(e.index, 1);
				this.imgIdList.splice(e.index, 1);
			},
			handleReview(regular) {
				// 复核
				if(this.loading) return;
				this.$refs.uForm.validate().then(res => {
					this.loading = true;
					this.$http('home.reviewDanger', {
						...this.formData,
						pictureIds: this.imgIdList.length ? this.imgIdList.join(',') : '',
						regular
					}, 0).then(res => {
						if(res.code === 200) {
							this.back();
						} else {
							this.loading = false;
						}
					})
				})
			},
			handleSubmit() {
				// 整改
				if(this.loading) return;
				this.$refs.uForm.validate().then(res => {
					this.loading = true;
					this.$http('home.checkDanger', {
						...this.formData,
						pictureIds: this.imgIdList.length ? this.imgIdList.join(',') : ''
					}, 0).then(res => {
						if(res.code === 200) {
							this.back();
						} else {
							this.loading = false;
						}
					})
				})
			},
			back() {
				uni.showToast({
					icon: 'success',
					title: '已提交'
				})
				const beforePage = getCurrentPages()[getCurrentPages().length- 2];
				const _this = this;
				setTimeout(() => {
					beforePage.onLoad();
					_this.$Router.back();
					_this.loading = false;
				}, 1000)
			}
		}
	}
</script>

<style lang="scss">
	.item {
		padding: 0 30rpx;
		background: white;
		margin-top: 16rpx;
		.required {
			display: inline-block;
			margin-left: -16rpx;
			color: #FC4C2F;
		}
		.prefix-input {
			width: 180rpx;
			font-size: 34rpx;
		}
		.top-title {
			font-size: 34rpx;
		}
		.mb {
			margin-bottom: 28rpx;
		}
		/deep/ textarea {
			font-size: 34rpx;
			padding: 0;
		}
		&.upload-contanier {
			padding-bottom: 10rpx;
		}
		.upload {
			width: 140rpx;
			height: 140rpx;
			border: 2rpx dashed #ddd;
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
