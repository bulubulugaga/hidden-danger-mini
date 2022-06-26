<template>
	<view>
		<!-- 申请加入机构时搜索 -->
		<search v-if="!isCreatePage" placeholder="请输入机构名称" @confirm="getList" @clear="handleClear"></search>
		
		<!-- 创建机构时有同名机构时提示 -->
		<view class="create-tip f28" v-else>提示：系统已存在机构名称相同机构</view>
		
		<!-- 列表，未在机构或者申请中展示 -->
		<block v-if="orgList[0].userStatus === 1 || !orgList[0].userStatus">
			<org-list v-if="orgList.length || first" :orgList="orgList" :apply="true" @confirmApply="confirmApply"></org-list>
			<list-empty v-else text="未查询到相关机构~"></list-empty>
		</block>
	</view>
</template>

<script>
	import Search from '@/components/search/Search.vue'
	import OrgList from './components/OrgList.vue'
	import ListEmpty from '@/components/empty/ListEmpty.vue'
	export default {
		components: { 
			Search,
			OrgList,
			ListEmpty
		},
		data() {
			return {
				isCreatePage: false,  // 是否为创建机构
				orgList: [],
				showEmpty: false,  // 空机构列表
				keyword: '',
				first: true
			}
		},
		onLoad() {
			this.isCreatePage = this.$Route.query.create;
			if(this.isCreatePage) {
				uni.setNavigationBarTitle({
				    title: '创建机构'
				});
				this.orgList = [JSON.parse(decodeURIComponent(this.$Route.query.orgInfo))];
				this.keyword = this.orgList[0].name;
			}
		},
		methods: {
			getList(e) {
				this.keyword = e;
				this.$http('personel.getSearchOrg', {
					orgName: e
				}, 0).then(res => {
					if(res.code === 200) {
						if(!res.data.id) {
							// 搜索为空
							this.orgList = [];
						}
						else {
							this.orgList = [res.data];
						}
						this.first = false;
					} 
				})
				this.showEmpty = this.orgList.length;
			},
			handleClear() {
				// 清空搜索
				this.first = true;
				this.orgList = [];
			},
			confirmApply() {
				// 确认申请加入机构
				this.getList(this.keyword);
			}
		}
	}
</script>

<style>
	.create-tip {
		line-height: 80rpx;
		background-color: #FFEDEA;
		padding: 0 24rpx;
		margin-top: 26rpx;
	}
</style>
