const config = require("../../utils/config.js");
const ajax = require("../../utils/http.js").ajax;
import regeneratorRuntime from '../../utils/runtime.js';
const moment = require('../../utils/moment.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholder: '少侠请留步...',
        commentId: null,
        textarea: '',
        commentData: [],
        currentComment: [],
        hostCommentData: [],
        commentFabulous: [],
        isReply: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function () {
        const commentFabulous = wx.getStorageSync('commentFabulous') || [];
        this.setData({
            commentFabulous
        })
    },

    sortKey(property){
        return function(a,b){
            const value1 = a[property] || 0;
            const value2 = b[property] || 0;
            return value2 - value1;
        }
    },

    // 发表留言
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
            const params = this.data.commentId ? {
                reply: {
                    comment: this.data.textarea,
                    time: moment().format('YYYY-MM-DD HH:mm'),
                    getOS: '微信用户',
                    getBrowse: '微信小程序',
                    reply: [],
                    name: userInfo.nickName,
                    url: userInfo.avatarUrl
                },
                id: this.data.commentId
            } : {
                comment: this.data.textarea,
                time: moment().format('YYYY-MM-DD HH:mm'),
                getOS: '微信用户',
                getBrowse: '微信小程序',
                reply: [],
                name: userInfo.nickName,
                url: userInfo.avatarUrl
            };
            let url = `${config.api_rootspath.api}/api/comment/${ this.data.commentId ? 'updateComment' : 'addComment'}`;
            ajax(url,params,'post').then(res => {
                wx.hideLoading();
                wx.showToast({
                    title: '留言成功!'
                });
                const hostCommentData = [...res].sort(this.sortKey('fabulousNum')).slice(0, 5);
                this.setData({
                    textarea: '',
                    placeholder: '少侠请留步...',
                    commentId: null,
                    commentData: [...res].reverse(),
                    hostCommentData
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

    // 字组件点赞返回事件
    changeCommentData(e) {
        const { commentData, commentFabulous } = e.detail;
        const hostCommentData = [...commentData].sort(this.sortKey('fabulousNum')).slice(0, 5);
        this.setData({
            commentData,
            hostCommentData,
            commentFabulous
        });
        wx.setStorageSync('commentFabulous', commentFabulous);
        wx.hideLoading();
    },

    // 子组件点击回复返回事件
    replyComment(e) {
        const { name, id } = e.detail.comment;
        this.setData({
            placeholder: `@${ name }`,
            commentId: id,
            isReply: true
        });
    },

    cancelReply() {
        this.setData({
            placeholder: '少侠请留步...',
            commentId: null,
            isReply: false
        });
    },

    // 获取评论框值
    listenerInput: function(e) {
        this.setData({
            textarea: e.detail.value
        });
    },

    // 获取留言
    getComment() {
        const url = `${config.api_rootspath.api}/api/comment/getComment`;
        return ajax(url,'get')
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: async function () {
        wx.showLoading({
            title: '加载中'
        });
        const commentData = await this.getComment() || [];
        const hostCommentData = [...commentData].sort(this.sortKey('fabulousNum')).slice(0, 5);
        this.setData({
            commentData: [...commentData].reverse(),
            hostCommentData
        });
        wx.hideLoading();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {}
});
