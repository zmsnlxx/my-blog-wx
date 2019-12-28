const config = require("../../utils/config.js");
const ajax = require("../../utils/http.js").ajax;
import regeneratorRuntime from '../../utils/runtime.js'
const app = getApp();

Page({
  data: {
    id: null,
    article: [],
    headInfo: []
  },
  onLoad: async function () {
      const that = this;
      wx.showLoading({
        title: "加载中"
      });
      const id = wx.getStorageSync('articleId');
      this.setData({id});
      const data = await this.getArticleDetails();
      //将markdown内容转换为towxml数据
      const article = app.towxml.toJson(
        data.content,                   // `markdown`或`html`文本内容
        'markdown',             // `markdown`或`html`
        that                    // 当前页面的`this`（2.1.0或以上的版本该参数不可省略）
    );
      //设置文档显示主题，默认'light'
      article.theme = 'dark';
      this.setData({
        headInfo: data,
        article
      });
      wx.hideLoading();
  },

  getArticleDetails() {
    const params = {id: this.data.id};
    const url = `${config.api_rootspath.api}/api/article/details`;
    return ajax(url,params,'get')
  }

});
