const config = require("../../utils/config.js");
const ajax = require("../../utils/http.js").ajax;
import regeneratorRuntime from '../../utils/runtime.js'

Page({
  data: {
    article: [],
    allClass: [],
    currentIndex: 0,
    classId: null,
  },
  onLoad: async function () {
    wx.showLoading({
      title: "加载中"
    });
    // 初始化时首先获取所有文章分类，根据currentIndex（当前文章分类索引）获取当前分类下所有文章
    const allClass = await this.getAllClass();
    const classId = allClass[this.data.currentIndex]['id'];
    this.setData({
      allClass,
      classId
    });
    const article = await this.getClassArticle();
    this.setData({
      article
    });
    wx.hideLoading();
  },
  // 切换文章分类
  async changeClass(e){
    wx.showLoading({
      title: "加载中"
    });
    const currentIndex = e.currentTarget.dataset.idx
    this.setData({
      currentIndex,
      classId: this.data.allClass[currentIndex]['id']
    });
    const article = await this.getClassArticle();
    this.setData({
      article
    });
    wx.hideLoading();
  },
  // 获取所有文章分类
  getClassArticle() {
    const url = `${config.api_rootspath.api}/api/article/getArticle`
    const params = {id: this.data.classId}
    return ajax(url,params,'get')
  },
  // 获取当前分类下所有文章
  getAllClass() {
    const url = `${config.api_rootspath.api}/api/class/getArticleClass`
    return ajax(url,'get')
  },
  getArticleDetails(e) {
      const id = e.currentTarget.dataset.articleid;
      wx.setStorageSync('articleId',id);
      wx.navigateTo({
          url: `/pages/articleDetails/articleDetails`
      });
  }
});
