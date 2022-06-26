<template>
	<view>
		<view class="item">
			<view class="col-title">{{ statusTxt }}说明</view>
			<view class="content word-break-all">{{ info.description }}</view>
		</view>
		<view class="item">
			<view class="col-title">{{ statusTxt }}图片</view>
			<view class="img">
				<!-- 预览有问题，需要调整 -->
				<u-upload multiple width="140rpx" height="140rpx" :deletable="false" :fileList="imgList">
					<view></view>
				</u-upload>
			</view>
		</view>
		<view class="item">
			<view class="row">
				<view class="title">{{ statusTxt }}人</view>
				<view class="content">{{ info.operator }}</view>
			</view>
			<view class="row mt">
				<view class="title">{{ statusTxt }}时间</view>
				<view class="content">{{ info.operatingTime | date }}</view>
			</view>
		</view>
		<view class="item" v-if="info.operationType === 2">
			<view class="row">
				<view class="title">{{ statusTxt }}结果</view>
				<view class="content">
					<text :class="this.info.regular === 1 ? 'main-green' : 'main-red'">{{ this.info.regular | regularTxt }}</text>
				</view>
			</view>
		</view>
		<u-gap height="30rpx"></u-gap>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				statusTxt: '',
				info: {},
				imgList: []
			}
		},
		onLoad() {
			this.info = JSON.parse(decodeURIComponent(this.$Route.query.info));
			this.statusTxt = this.info.operationType === 1 ? '整改' : '复核';
			this.imgList = this.info.imgFileList.map(item => ({
				id: item.id,
				url: item.filePath
			}))
		},
		filters: {
			regularTxt(regular) {
				// 复核结果文字
				switch(regular) {
					case 1: return '合格';
					case 2: return '不合格';
					default: return '';
				}
			}
		} 
	}
</script>

<style lang="scss">
	.item {
		margin-top: 16rpx;
		padding: 20rpx 30rpx;
		background: white;
		font-size: 34rpx;
		.col-title {
			margin-bottom: 16rpx;
		}
		.content {
			color: #B2B2B2;
		}
		.row {
			display: flex;
			&.mt {
				margin-top: 40rpx;
			}
			.title {
				width: 180rpx;
			}
		}
	}
</style>
