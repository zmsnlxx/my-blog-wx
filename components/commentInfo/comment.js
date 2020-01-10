const config = require("../../utils/config.js");
const ajax = require("../../utils/http.js").ajax;
import regeneratorRuntime from '../../utils/runtime.js';

Component({
    properties: {
        commentData: {
            type: Array,
            value: []
        },
        title: {
            type: String,
            value: ''
        },
        isShowFabulous: {
            type: Boolean,
            value: true
        },
        commentFabulous: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        commentId: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        async clickFabulous(e) {
            wx.showLoading({
               title: '加载中..'
            });
            const commentId = e.currentTarget.dataset.comment.id;
            const index = this.data.commentFabulous.indexOf(commentId);
            const commentFabulous = [...this.data.commentFabulous];
            console.log(commentFabulous);
            if ( index !== -1 ) {
                wx.showToast({
                    icon: 'none',
                    title: '您已点赞!'
                });
                return;
            }
            this.setData({
                commentId,
            });
            const data = await this.updateComment();
            // 点赞成功之后把当前评论id存起来
            commentFabulous.push(commentId);
            this.triggerEvent('changeCommentData', {commentData: [...data].reverse(), commentFabulous});
        },
        // 更新留言点赞
        updateComment() {
            const params = {
                id: this.data.commentId,
                fabulousNum: 1,
            };
            let url = `${config.api_rootspath.api}/api/comment/updateComment`;
            return ajax(url,params,'post');
        },
        getReply(e) {
            const comment = e.currentTarget.dataset.comment;
            wx.setStorageSync('currentComment', comment);
            wx.navigateTo({
                url: `/pages/commentDetails/commentDetails`
            });
        },
        goReply(e) {
            const comment = e.currentTarget.dataset.comment;
            this.triggerEvent('replyComment', {comment});
        }
    }
});
