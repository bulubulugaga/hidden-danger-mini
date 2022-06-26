// 消息相关
export default {
	message: {
		getMsgList: {
			url: "message/messageList",
			// desc: '获取消息列表'
		},
		getMsgNum: {
			url: "message/messageCount",
			// desc: '获取未读消息数量'
		},
		readMsg: {
			url: "message/readMessage",
			method: "POST",
			// desc: '消息已读'
		},
		readMsgList: {
			url: "message/readMessageList",
			method: "POST",
			// desc: '多条消息已读'
		},
		getAprrove: {
			url: "message/checkRight",
			// desc: '是否有无查看详情权限'
		}
	}
}