// pages/class/class.js
const config = require("../../utils/config.js");
const ajax = require("../../utils/http.js").ajax;
import regeneratorRuntime from '../../utils/runtime.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        allClass: [
            { name: '最新', id: 'news'},
            { name: '热评', id: 'host'},
            { name: '标签', id: 'tags'}
        ],
        currentTagIndex: 0, //当前标签索引
        currentIndex: 0, // 当前索引
        articleData: [], // 处理后的文章数据
        allArticle: [], // 所有文章
        allTags: [], //所有文章标签
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function () {
        wx.showLoading({
            title: '加载中..'
        });
        // 初始化时拿到所有的文章
        const allArticle = await this.getAllArticle();
        this.setData({
            allArticle
        });
        this.checkArticle();
        // 默认显示最新文章，根据时间先后对所有文章进行排序
        wx.hideLoading();
    },

    // 文章处理
    async checkArticle() {
        let sortArticle = [];
          switch (this.data.currentIndex) {
              case 0:
                  sortArticle = this.sortKey(this.data.allArticle, 'createdTime');
                  this.setData({
                      articleData: sortArticle.slice(0, 5)
                  });
                  return;
              case 1:
                  sortArticle = this.sortKey(this.data.allArticle, 'commentData');
                  this.setData({
                      articleData: sortArticle.slice(0, 5)
                  });
                  return;
              case 2:
                  wx.showLoading({
                     title: '加载中...'
                  });
                  const allTags = await this.getAllTags();
                  this.setData({
                      allTags,
                      articleData: []
                  });
                  sortArticle = await this.getTagArticle();
                  this.setData({
                      articleData: sortArticle
                  });
                  wx.hideLoading();
                  return;
          }
    },

    // 获取所有文章
    getAllArticle() {
        const url = `${config.api_rootspath.api}/api/article/getAllArticle`;
        return ajax(url,'get')
    },

    // 获取所有文章标签
    getAllTags() {
        const url = `${config.api_rootspath.api}/api/tags/getArticleTags`;
        return ajax(url,'get')
    },

    // 获取指定标签下的文章
    getTagArticle() {
        const url = `${config.api_rootspath.api}/api/article/getTagArticle`;
        const id = this.data.allTags[this.data.currentTagIndex]['id'];
        const params = { id };
        return ajax(url,params,'get')
    },

    // 根据时间排序
    sortKey(array, key) {
        return array.sort(function(a, b) {
            const x = typeof a[key] === 'object' ? a[key].length : a[key];
            const y = typeof b[key] === 'object' ? b[key].length : b[key];
            return x > y ? -1 : x < y ? 1 : 0;
        });
    },

    // 切换文章分类
    async changeClass(e){
        wx.showLoading({
            title: "加载中"
        });
        const currentIndex = e.currentTarget.dataset.idx;
        console.log(currentIndex);
        this.setData({
            currentIndex,
            currentTagIndex: 0
        });
        this.checkArticle();
        wx.hideLoading();
    },

    // 切换文章标签
    async changeTags(e){
        wx.showLoading({
            title: "加载中"
        });
        const currentTagIndex = e.currentTarget.dataset.idx;
        this.setData({
            currentTagIndex,
        });
        const articleData = await this.getTagArticle();
        this.setData({
            articleData
        });
        wx.hideLoading();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
