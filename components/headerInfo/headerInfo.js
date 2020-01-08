// components/headInfo/headInfo.js

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 监听父组件传值，对组件data进行设置
        headInfo: {   // 头部信息
            type: Object,
            value: {},
            observer: function (newVal) {
                const {title,updateTime,createdTime,author} = newVal;
                this.setData({
                    title,
                    createdTime,
                    author: author || 'lxx',
                    updateTime
                })
            }
        },
    },
  
    /**
     * 组件的初始数据
     */
    data: {
        title: null,
        createdTime: null,
        author: null,
        updateTime: null
    },
  
    /**
     * 组件的方法列表
     */
    methods: {}
  });
