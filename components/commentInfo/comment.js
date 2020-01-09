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
            this.setData({
                commentId
            });
            const data = await this.updateComment();
            this.triggerEvent('changeCommentData', {commentData: [...data].reverse()});
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
