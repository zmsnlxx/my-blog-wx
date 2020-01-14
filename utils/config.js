/**
 * 小程序配置文件
 * 配置环境及接口地址
 * 使用方法：
 * 1.页面引入:  var config = require('../../utils/config.js')
 * 2.调用:  config.api_rootspath.api
 */
// 开发环境: 0 模拟数据mockapi, 1 开发, 2正式, 3 测试服务器
var mode = 2;

// 程序数据接口，用于当前小程序数据获取
var api_roots = [
  '', // 模拟地址
  '', // 开发地址
  'https://www.zmsnlxx.cn', // 正式地址
];

// 配置信息
var api_rootspath =
  {
    api: api_roots[mode],// 程序数据接口地址
  };


// 对外暴露方法和内容
module.exports = {
  api_rootspath: api_rootspath
}
