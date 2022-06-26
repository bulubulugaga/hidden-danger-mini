<template>
	<view>
		<!-- 不再插件里用text赋值，防止真机字体在右 -->
		<u-empty
			mode="search"
			icon="/static/images/login/none_search_org.png"
			width="324rpx"
			height="250rpx"
			text=" "
			text-size="26rpx"
			text-color="#999"
			margin-top="260rpx">
		</u-empty>
		<view class="list-empty-text f26 c999 txt-center">{{ text }}</view>
	</view>
</template>

<script>
	export default {
		props: {
			text: {
				type: String,
				default: '未查询到相关信息~'
			}
		}
	}
</script>

<style>
	.list-empty-text {
		margin-top: 20rpx;
	}
</style>
