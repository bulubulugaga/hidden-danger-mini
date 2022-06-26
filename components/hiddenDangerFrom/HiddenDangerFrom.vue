<template>
	<view>
		<u--form ref="uForm" error-type="toast" :model="formData" :rules="rules">
			<view class="item">
				<u-form-item prop="location">
					<u-input v-model="formData.location" border="none" placeholder="请输入" font-size="34rpx" color="#b2b2b2" maxlength="20" :readonly="readonly">
						<view slot="prefix" class="prefix-input"><text class="required" v-if="!readonly">*</text>隐患位置</view>
					</u-input>
				</u-form-item>
			</view>
			<view class="item">
				<u-form-item prop="mainProblem">
					<view class="top-title"><text class="required" v-if="!readonly">*</text>主要问题</view>
					<u-textarea v-if="!readonly" v-model="formData.mainProblem" placeholder="请输入" border="none" maxlength="500" height="142rpx" 
						:placeholder-style="{ fontSize: '34rpx', color: '#B2B2B2' }" :disable-default-padding="true">
					</u-textarea>
					<!-- 详情展示 -->
					<view v-else class="textarea-content">{{ formData.mainProblem }}</view>
				</u-form-item>
			</view>

			<!-- 图片 -->
			<view class="item upload-contanier">
				<u-form-item prop="teamName">
					<view class="top-title mb">隐患图片</view>
					<u-upload accept="image" multiple width="140rpx" height="140rpx" :maxCount="3" :deletable="!readonly"
						:fileList="imgList" @afterRead="afterUpload" @delete="deleteImg">
						<view v-if="!readonly" class="upload u-flex-xy-center">
							<u-icon name="camera" size="70rpx" color="#ddd"></u-icon>
						</view>
					</u-upload>
				</u-form-item>
			</view>
			<!-- 级别 -->
			<view class="item">
				<!-- 详情展示隐患状态 -->
				<u-form-item v-if="readonly">
					<u-input :value="dangerStatus[formData.status]" border="none" font-size="34rpx" :color="dangerStatusColor[formData.status]" :readonly="readonly">
						<view slot="prefix" class="prefix-input">隐患状态</view>
					</u-input>
				</u-form-item>
				<u-form-item prop="hiddenLevel">
					<view class="u-flex-y-center">
						<view class="prefix-input f34"><text class="required" v-if="!readonly">*</text>隐患级别</view>
						<e-select 
							:initSelect="initLevel"
							:options="dangerLevelList" 
							:customStyle="selectLevelStyle" 
							:readonly="readonly"
							:show-icon="!readonly"
							@handleSelect="handleSelectLevel" 
						></e-select>
					</view>
				</u-form-item>
			</view>
			<view class="item">
				<u-form-item prop="rectificationSuggestion">
					<view class="top-title"><text class="required" v-if="!readonly">*</text>整改建议</view>
					<u-textarea v-if="!readonly" v-model="formData.rectificationSuggestion" placeholder="请输入" border="none" maxlength="500"
						height="142rpx" :placeholder-style="{ fontSize: '34rpx', color: '#B2B2B2' }" :disable-default-padding="true">
					</u-textarea>
					<!-- 详情展示 -->
					<view v-else class="textarea-content">{{ formData.rectificationSuggestion }}</view>
				</u-form-item>
			</view>
			<!-- 整改期限 -->
			<view class="item">
				<u-form-item prop="rectificationLimite">
					<view class="u-flex-y-center">
						<view class="prefix-input f34"><text class="required" v-if="!readonly">*</text>整改期限</view>
						<e-select 
							:initSelect="initLimite"
							:options="dangerLimiteList" 
							:customStyle="selectStyle" 
							:readonly="readonly"
							:show-icon="!readonly"
							@handleSelect="handleSelectLimite" 
						></e-select>
					</view>
				</u-form-item>
				<u-form-item prop="limitTime" v-if="formData.rectificationLimite === 2">
					<uni-datetime-picker type="date" v-model="formData.limitTime" :disabled="readonly">
						<u-input v-model="formData.limitTime" border="none" placeholder="请选择" font-size="34rpx" color="#b2b2b2" readonly>
							<view slot="prefix" class="prefix-input"><text class="required" v-if="!readonly">*</text>限期整改时间</view>
						</u-input>
					</uni-datetime-picker>
				</u-form-item>
			</view>
			<view class="item">
				<u-form-item prop="troubleshootingTime">
					<uni-datetime-picker type="date" v-model="formData.troubleshootingTime" :disabled="readonly" :start="today">
						<u-input v-model="formData.troubleshootingTime" border="none" placeholder="请选择" font-size="34rpx" color="#b2b2b2" readonly>
							<view slot="prefix" class="prefix-input"><text class="required" v-if="!readonly">*</text>排查时间</view>
						</u-input>
					</uni-datetime-picker>
				</u-form-item>
			</view>

			<!-- 法律法规 -->
			<view class="item">
				<u-form-item prop="law">
					<view class="top-title">法律法规</view>
					<u-textarea v-if="!readonly" v-model="formData.law" placeholder="请输入" border="none" maxlength="500"
						height="142rpx" :placeholder-style="{ fontSize: '34rpx', color: '#B2B2B2' }" :disable-default-padding="true">
					</u-textarea>
					<!-- 详情展示 -->
					<view v-else class="textarea-content">{{ formData.law || '无' }}</view>
				</u-form-item>
			</view>
			<view class="item">
				<u-form-item prop="remark">
					<view class="top-title">备注</view>
					<u-textarea v-if="!readonly" v-model="formData.remark" placeholder="请输入" border="none" maxlength="500"
						height="142rpx" :placeholder-style="{ fontSize: '34rpx', color: '#B2B2B2' }" :disable-default-padding="true">
					</u-textarea>
					<!-- 详情展示 -->
					<view v-else class="textarea-content">{{ formData.remark || '无' }}</view>
				</u-form-item>
			</view>
		</u--form>
	</view>
</template>

<script>
	import ESelect from '@/components/select/easy-select.vue'
    //上传图片api
	import { uploadFile } from '@/common/request/uploadFile.js'
	import { 
		dangerStatus, 
		dangerStatusColor,
		dangerLevelList,
		dangerLevel,
		dangerLevelColor,
		dangerLimiteList,
		dangerLimite
	} from '@/static/js/dictionary.js'
	export default {
		props: {
			readonly: {
				type: Boolean,
				default: false
			},
			info: {  // 详情信息
				type: Object,
				default() {
					return {
						location: '',
						mainProblem: '',
						picUrls: [],
						hiddenLevel: '',
						rectificationSuggestion: '',	
						rectificationLimite: '',
						limitTime: '',
						troubleshootingTime: uni.$u.timeFrom(new Date()),
						law: '',
						remark: ''
					}
				}
			},
			imgFileList: {
				type: Array,
				default() {
					return []
				}
			}
		},
		components: {
			ESelect
		},
		data() {
			return {
				// 引入相关对应关系
				dangerStatus,  // 隐患状态颜色
				dangerStatusColor,  // 隐患状态名
				dangerLevelList,  // 隐患级别
				dangerLevel,   // 隐患级别名称
				dangerLevelColor,  // 隐患颜色
				dangerLimiteList,  // 隐患期限
				dangerLimite,  // 期限名字
				
				
				selectStyle: { border: 'none', fontSize: '34rpx', width: '514rpx', color: '#B2B2B2' },  // 默认下拉选择样式
				initLevel: {},   // 初始化隐患类别
				initLimite: {},   // 初始化隐患类别
				
				
				formData: this.info,
				imgList: this.imgFileList,
				rules: {
					location: [{ required: true, message: '请输入隐患位置', trigger: ['blur'] }], 
					mainProblem: [{ required: true, message: '请输入主要问题', trigger: ['blur'] }], 
					hiddenLevel: [{ required: true, type: 'number', message: '请选择隐患级别', trigger: ['blur'] }], 
					rectificationSuggestion: [{ required: true, message: '请输入整改建议', trigger: ['blur'] }], 
					rectificationLimite: [{ required: true, type: 'number', message: '请选择整改期限', trigger: ['blur'] }], 
					limitTime: [{ required: true, message: '请选择期限整改时间', trigger: ['blur'] }],
					troubleshootingTime: [{ required: true, message: '请选择排查时间', trigger: ['blur'] }]
				},
				today: uni.$u.timeFrom(new Date())
			}
		},
		computed: {
			selectLevelStyle() {
				if(this.readonly) {
					// 详情下展示特殊颜色
					return {
						...this.selectStyle, 
						color: this.dangerLevelColor[this.formData.hiddenLevel]
					}
				}
				else {
					return this.selectStyle
				}	
			}
		},
		methods: {
			afterUpload(e) {
				// 上传图片
				uploadFile(e.file).then(res => {
					// 图片预览
					this.imgList = [...this.imgList, ...e.file];
					// 图片id
					this.formData.picUrls = [...this.formData.picUrls, ...res];
				})
			},
			deleteImg(e) {
				// 删除图片
				this.imgList.splice(e.index, 1);
				this.formData.picUrls.splice(e.index, 1);
			},
			handleSelectLevel(e) {
				// 选择隐患级别
				this.formData.hiddenLevel = e.value;
			},
			handleSelectLimite(e) {
				// 选择隐患级别
				this.formData.rectificationLimite = e.value;
				if(e.value === 1) {
					// 选择立即整改，清空期限
					this.formData.limitTime = '';
				}
			}
		},
		watch: {
			info: {
				handler(newVal, oldVal) {
					this.formData = newVal;
					this.initLevel = {
						value: this.formData.hiddenLevel,
						label: this.dangerLevel[this.formData.hiddenLevel]
					}
					this.initLimite = {
						value: this.formData.rectificationLimite,
						label: this.dangerLimite[this.formData.rectificationLimite]
					}
				},
				deep: true
			},
			imgFileList: {
				handler(newVal) {
					this.imgList = newVal;
				},
				deep: true
			}
		}
	}
</script>

<style lang="scss" scoped>
	.item {
		padding: 0 30rpx;
		background: white;
		margin-bottom: 16rpx;
		.required {
			display: inline-block;
			margin-left: -16rpx;
			color: #FC4C2F;
		}
		.prefix-input {
			margin-right: 40rpx;
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
			color: #b2b2b2;
		}
		.textarea-content {
			font-size: 34rpx;
			color: #b2b2b2;
			padding: 16rpx 0 10rpx;
			line-height: 48rpx;
			word-break: break-all;
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
</style>
