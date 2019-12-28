// pages/login/login.js
const ajax = require('../../utils/http.js').ajax
Page({
    /**
     * 页面的初始数据
     */
    data: {
        isRead: false,  // 是否阅读条例
        isCheck: false, // 是否进行账号密码校验
        userName: '', // 账号
        passWord: '', // 密码
    },

    checkboxChange(e){
        this.setData({
            isRead: e.detail.value.length !== 0
        })
    },
    
    login(){
        console.log(this.data.userName)
        console.log(this.data.passWord)
        let url = `http://47.99.244.227:3000/api`;
        let params = {
            loginName: this.data.userName,
            password: this.data.passWord
        }
        console.log(params)
        ajax(url,params,'post').then(res => {
            console.log(res)
        })
    },

    userNameInput(e){
        this.setData({
            isCheck: e.detail.value.length !== 0 && this.data.passWord.length !== 0,
            userName: e.detail.value
        })
        if(this.data.userName.length === 0){
            wx.showToast({
                title: "请输入你的账号",
                icon: "none"
            })
        }
    },

    passWordInput(e) {
        this.setData({
            isCheck: e.detail.value.length !== 0 && this.data.passWord.length !== 0,
            passWord: e.detail.value
        })
        if(this.data.passWord.length === 0){
            wx.showToast({
                title: "请输入你的密码",
                icon: "none"
            })
        }
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

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
