<!-- 裁剪为正方形图片 -->
<template>
	<kps-image-cutter :url="url" :fixed="false" :maxWidth="500" @ok="handleConfirm" @cancel="handleCancle"></kps-image-cutter>
</template>

<script>
    import kpsImageCutter from "@/components/ksp-image-cutter/ksp-image-cutter.vue";
    //上传图片api
	import { uploadFile } from '@/common/request/uploadFile.js'
	export default {
        components: { 
			kpsImageCutter
		},
        data() {
            return {
                url: ""
            }
        },
        onLoad() {
			this.url = this.$Route.query.url;
        },
        methods: {
            handleConfirm(e) {
				//上传图片
				let file = [{ thumb: e.path }];
				uploadFile(file).then(res => {
					// 图片预览
					let beforePage = getCurrentPages()[getCurrentPages().length - 2]; // 前一个页面
					beforePage.$vm.formData.avatar = res[0];
					beforePage.$vm.avatarUrl = e.path;
					this.$Router.back();
				})
            },
            handleCancle() {
                // url设置为空，隐藏控件
                this.url = "";
				this.$Router.back();
            }
        }
    }

</script>
<style>
</style>