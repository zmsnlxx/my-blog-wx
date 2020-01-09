Page({
    data: {
        currentComment: null,
        placeholder: '少侠请留步...'
    },
    onLoad: function () {
        wx.showLoading({
            title: '加载中...'
        });
        const currentComment = wx.getStorageSync('currentComment');
        this.setData({
            currentComment
        });
        setTimeout(() => {
            wx.hideLoading();
        },500)
    },
    // 子组件点击回复返回事件
    replyComment(e) {
        const { name, id } = e.detail.comment;
        this.setData({
            placeholder: `@${ name }`,
            commentId: id
        });
    },
});
