const config = require("../../utils/config.js");
const ajax = require("../../utils/http.js").ajax;
const moment = require('../../utils/moment.js');
import regeneratorRuntime from '../../utils/runtime.js';

Page({
    data: {
        currentComment: null,
        placeholder: '少侠请留步...',
        commentId: null,
        isReply: false
    },
    onLoad: function () {
        wx.showLoading({
            title: '加载中...'
        });
        const currentComment = wx.getStorageSync('currentComment');
        const commentId = currentComment['id'];
        this.setData({
            currentComment,
            commentId
        });
        setTimeout(() => {
            wx.hideLoading();
        },500)
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onUnload: function () {
        wx.removeStorageSync('currentComment');
    },
    // 子组件点击回复返回事件
    replyComment(e) {
        const { name } = e.detail.comment;
        this.setData({
            placeholder: `回复${ name }`,
            replyUser: `@${ name }`,
            isReply: true
        });
    },
    // 获取评论框值
    listenerInput: function(e) {
        this.setData({
            textarea: e.detail.value
        });
    },
    cancelReply() {
        this.setData({
            placeholder: '少侠请留步...',
            replyUser: null,
            isReply: false
        });
    },
    goComment(res) {
        wx.showLoading({title: '加载中', icon: 'loading'});
        // 声明一个变量接收用户授权信息
        const userInfo = res.detail.userInfo || undefined;
        // 判断是否授权  true 替换微信用户头像
        if (userInfo !== undefined) {
            if (this.data.textarea === '') {
                wx.hideLoading();
                wx.showToast({
                    title: '请输入评论内容!'
                });
                return;
            }
            const params = {
                reply: {
                    comment: this.data.textarea,
                    time: moment().format('YYYY-MM-DD HH:mm'),
                    getOS: '微信用户',
                    getBrowse: '微信小程序',
                    reply: [],
                    name: userInfo.nickName,
                    url: userInfo.avatarUrl,
                    replyUser: this.data.replyUser || null
                },
                id: this.data.commentId
            };
            let url = `${config.api_rootspath.api}/api/comment/updateComment`;
            ajax(url,params,'post').then(res => {
                const currentComment = res.find(item => item.id === this.data.commentId);
                wx.hideLoading();
                wx.showToast({
                    title: '留言成功!'
                });
                this.setData({
                    textarea: '',
                    currentComment,
                    placeholder: '少侠请留步...',
                })
            })
        } else {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '您必须授权才能使用所有功能',
                showCancel: false,
            })
        }
    },
});
