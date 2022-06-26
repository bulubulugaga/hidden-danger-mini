<script>
	import wechat from '@/common/wechat/wechat';
	export default {
		onLaunch: function() {
			wechat.checkMiniProgramUpdate();
		}
	}
</script>

<style lang="scss">
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/static/css/common.scss";
	page {
		background-color: #F8F8F8;
		color: #333;
	}
</style>
