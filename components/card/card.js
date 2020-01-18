// components/headInfo/headInfo.js
const moment = require('../../utils/moment.js');


Component({
    properties: {
        article: {   // 头部信息
            type: Array,
            value: [],
            observer: function (newVal) {
                newVal.forEach(item => {
                    item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:mm')
                });
                this.setData({
                    articleData: newVal
                })
            }
        },
    },

    /**
     * 组件的初始数据
     */
    data: {
        articleData: []
    },

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
