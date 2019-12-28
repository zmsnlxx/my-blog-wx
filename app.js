//app.js
const Towxml = require('/towxml/main');     //引入towxml库
App({
  towxml:new Towxml(),
  // 页面用法: getApp().globalData.questionQuality
  globalData: {
    userInfo: null
  }
})