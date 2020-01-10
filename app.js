//app.js
const Towxml = require('/towxml/main');     //引入towxml库
App({
  towxml:new Towxml(),
  // 页面用法: getApp().globalData.questionQuality
  globalData: {
    userInfo: null
  },
  // 监听小程序隐藏时页面路由；若不是首页的话跳转到首页
  onHide:function(){
    let pages = getCurrentPages();
    if(pages['0'].route !== 'pages/index/index'){
      wx.redirectTo({
        url:'pages/index/index'
      })
    }

  }
});
