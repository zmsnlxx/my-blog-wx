// components/headInfo/headInfo.js

Component({
    properties: {
        article: {   // 头部信息
            type: Array,
            value: []
        },
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        getArticleDetails(e) {
            const id = e.currentTarget.dataset.articleid;
            wx.setStorageSync('articleId', id);
            wx.navigateTo({
                url: `/pages/articleDetails/articleDetails`
            });
        },
    }
});
