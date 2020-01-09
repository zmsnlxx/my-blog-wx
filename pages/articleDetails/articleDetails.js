const config = require("../../utils/config.js");
const ajax = require("../../utils/http.js").ajax;
import regeneratorRuntime from '../../utils/runtime.js';
const moment = require('../../utils/moment.js');

const app = getApp();

Page({
    data: {
        id: null,
        article: [],
        articleData: null,
        isFabulous: false,
        fabulousArr: [],
        currentComment: [],
        placeholder: '少侠请留步...',
        commentId: null,
        replyUser: null,
        replyPlaceholder: '回复评论...',
        scrollTop: 0,
        textarea: '',
        showModalStatus: false,
        animationData: null
    },
    onLoad: async function () {
        const that = this;
        wx.showLoading({
            title: "加载中"
        });
        const id = wx.getStorageSync('articleId');
        const fabulousArr = wx.getStorageSync('fabulousArr');
        const index = fabulousArr.indexOf(id);
        this.setData({
            id,
            fabulousArr,
            isFabulous: index !== -1
        });
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
            articleData: data,
            article
        });
        wx.hideLoading();
    },
    // 获取当前文章详情
    getArticleDetails() {
        const params = {id: this.data.id};
        const url = `${config.api_rootspath.api}/api/article/details`;
        return ajax(url, params, 'get')
    },
    // 点击查看回复评论
    getReply(e) {
        const currentComment = e.target.dataset.comment;
        this.setData({
            currentComment
        });
        this.showModal();
    },
    goReply(e) {
        console.log(e.target.dataset.comment);
        const {name, id} = e.target.dataset.comment;
        this.setData({
            placeholder: `回复 ${name}`,
            commentId: id,
        })
    },
    goReplyComment(e) {
        console.log(e.target.dataset.comment);
        const {name, id} = e.target.dataset.comment;
        this.setData({
            replyPlaceholder: `回复 ${name}`,
            commentId: id,
            replyUser: `@${name}`
        })
    },
    //显示对话框
    showModal() {
        // 显示遮罩层
        const animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        console.log(animation);
        this.animation = animation;
        animation.translateY(800).step();
        this.setData({
            animationData: animation.export(),
            showModalStatus: true
        });
        setTimeout(function () {
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export()
            })
        }.bind(this), 200)
    },
    //隐藏对话框
    hideModal() {
        // 隐藏遮罩层
        const animation = wx.createAnimation({
            duration: 200,
            timingFunction: "linear",
            delay: 0
        });
        this.animation = animation;
        animation.translateY(800).step();
        this.setData({
            animationData: animation.export(),
        });
        setTimeout(function () {
            animation.translateY(0).step();
            this.setData({
                animationData: animation.export(),
                showModalStatus: false
            })
        }.bind(this), 200)
    },

    // 发表评论
    goComment(res) {
        wx.showLoading({title: '加载中', icon: 'loading'});
        // 声明一个变量接收用户授权信息
        const userInfo = res.detail.userInfo || undefined;
        const commentId = res.target.dataset.commentid || null;
        if (commentId) {
            this.setData({
                commentId
            })
        }
        // 判断是否授权  true 替换微信用户头像
        if (userInfo !== undefined) {
            if (this.data.textarea === '') {
                wx.hideLoading();
                wx.showToast({
                    title: '请输入评论内容!'
                });
                return;
            }
            let commentParams = {
                comment: this.data.textarea,
                time: moment().format('YYYY-MM-DD HH:mm'),
                getOS: '微信用户',
                getBrowse: '微信小程序',
                reply: [],
                name: userInfo.nickName,
                url: userInfo.avatarUrl
            };
            if (this.data.commentId) {
                commentParams['commentId'] = this.data.commentId;
                if (this.data.replyUser) {
                    commentParams['replyUser'] = this.data.replyUser;
                }
            }
            let url = `${config.api_rootspath.api}/api/article/updateArticle`;
            let params = {
                comment: commentParams,
                id: this.data.id
            };
            const that = this;
            ajax(url,params,'post').then(res => {
                wx.hideLoading();
                wx.showToast({
                    title: '评论成功!'
                });
                const data = res.find(item => item.id === this.data.id);
                const article = app.towxml.toJson(data.content, 'markdown', that
                );
                const currentComment = commentId ? data.commentData.find(item => item.id === commentId) || [] : [];
                this.setData({
                    textarea: '',
                    articleData: data,
                    article,
                    placeholder: '少侠请留步...',
                    replyPlaceholder: '回复评论...',
                    commentId: null,
                    replyUser: null,
                    currentComment
                })
            })
        } else {
            wx.hideLoading();
            wx.showModal({
                title: '提示',
                content: '您必须授权才能使用所有功能',
                showCancel: false,
            })
        }
    },

    // 获取评论框值
    listenerPhoneInput: function(e) {
        this.setData({
            textarea: e.detail.value
        });
    },

    // 点赞
    clickFabulous() {
        if (this.data.isFabulous) {
            wx.showToast({
                icon: 'none',
                title: '您已点赞!'
            });
            return;
        } else {
            let url = `${config.api_rootspath.api}/api/article/updateArticle`;
            let params = {
                fabulousNum: 1,
                id: this.data.id
            };
            ajax(url,params,'post').then(res => {
                wx.showToast({
                    title: '点赞成功!'
                });
                const fabulousArr = [...this.data.fabulousArr];
                fabulousArr.push(this.data.id);
                wx.setStorageSync('fabulousArr', fabulousArr);
                this.setData({
                    isFabulous: true,
                    fabulousArr
                })
            })
        }
    },
    getScroll(e){
        console.log(e.detail.scrollTop);
        const scrollTop = e.detail.scrollTop;
        this.setData({
            scrollTop
        })
    }
});
