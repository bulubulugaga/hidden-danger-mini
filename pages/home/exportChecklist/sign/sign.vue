<template>
	<view>
		<view class="title txt-center">{{ title }}</view>
		<canvas class="mycanvas" canvas-id="mycanvas" @touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
		
		<view class="footer u-flex">
			<button class="left bg-white c333" hover-class="none" @click="clear">重置</button>
			<button class="right" hover-class="none" @click="next">{{ title === '检查人签名' ? '下一步' : '确定'}}</button>
		</view>
	</view>
</template>

<script>
	var x = 20;
	var y =20;
    //上传图片api
	import { uploadFile } from '@/common/request/uploadFile.js'
	export default{
		data(){
			return {
				title: '',
				ctx:'',         //绘图图像
				points:[],       //路径点集合 
			}
		},
		onLoad() {
			this.title = this.$Route.query.title;
			
			this.ctx = uni.createCanvasContext("mycanvas",this);   //创建绘图对象
			
			//设置画笔样式
			this.ctx.lineWidth = 4;
			this.ctx.lineCap = "round"
			this.ctx.lineJoin = "round"
		},
		methods:{
			//触摸开始，获取到起点
			touchstart(e) {
				let startX = e.changedTouches[0].x;
				let startY = e.changedTouches[0].y;
				let startPoint = {X:startX,Y:startY};
				this.points.push(startPoint);
				//每次触摸开始，开启新的路径
				this.ctx.beginPath();
			},
			//触摸移动，获取到路径点
			touchmove(e) {
				let moveX = e.changedTouches[0].x;
				let moveY = e.changedTouches[0].y;
				let movePoint = {X:moveX,Y:moveY};
				this.points.push(movePoint);       //存点
				let len = this.points.length;
				if(len>=2){
					this.draw();                   //绘制路径
				}
			},
			// 触摸结束，将未绘制的点清空防止对后续路径产生干扰
			touchend() {                   
				this.points=[];
			},
			
			/* ***********************************************
			#   绘制笔迹
			#	1.为保证笔迹实时显示，必须在移动的同时绘制笔迹
			#	2.为保证笔迹连续，每次从路径集合中区两个点作为起点（moveTo）和终点(lineTo)
			#	3.将上一次的终点作为下一次绘制的起点（即清除第一个点）
			************************************************ */
			draw() {
				let point1 = this.points[0]
				let point2 = this.points[1]
				this.points.shift()
				this.ctx.moveTo(point1.X, point1.Y)
				this.ctx.lineTo(point2.X, point2.Y)
				this.ctx.stroke()
				this.ctx.draw(true)
			},
			//清空画布
			clear() {
				let that = this;
				uni.getSystemInfo({
					success: function(res) {
						let canvasw = res.windowWidth;
						let canvash = res.windowHeight;
						that.ctx.clearRect(0, 0, canvasw, canvash);
						that.ctx.draw(true);
					},
				})
			},
			next() {
				// 下一步
				const _this = this;
				uni.canvasToTempFilePath({
				    canvasId: 'mycanvas',
				    success: function(res) {
						if(_this.title === '检查人签名') {
							// 再次签名
							_this.$Router.push({ path: '/pages/home/exportChecklist/sign/sign', query: { title: '受检方签名', checkUrl: res.tempFilePath } });
						}
						else {
							// 上传图片
							const fileList = [
								{ thumb: _this.$Route.query.checkUrl },
								{ thumb: res.tempFilePath }
							];
							uploadFile(fileList).then(uploadRes => {
								let beforePage = getCurrentPages()[getCurrentPages().length - 3];  // 导出页
								beforePage.$vm.formData.inspectorSign = uploadRes[0];
								beforePage.$vm.formData.testerSign = uploadRes[1];
								beforePage.$vm.isDraw = true;
								_this.$Router.back(2);
							})
						}
				    } 
				})
				
			}
		},
	}
</script>

<style lang="scss">
	page {
		background-color: #FFFFFF;
	}
	.title{
		line-height: 46rpx;
		font-size: vmin(34);
		background: #FFEDEA;
	}
	.mycanvas{
		width: 100%;
		height: calc(100vh - 100rpx);
	}
	.footer{
		height: 54rpx;
		.left,.right{
			line-height: 54rpx;
			border-radius: 0;
			font-size: vmin(34);
		}
		.left{
			width: 34%;
		}
		.right{
			width: 66%;
		}
	}
	
</style>

