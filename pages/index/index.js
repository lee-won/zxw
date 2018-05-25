//index.js
const app = getApp()
var URL = require('../../common/url_config.js')
var fetch = require('../../common/fetch.js')
Page({
  data: {
    lists: [],
    page: 1,
    token: '',
    loadFlag:false,
    loadAll: false,
    basic_url:URL.BASIC_URL
  },
  onLoad: function() {
    var that = this
    setTimeout(() => {
      fetch(URL.LIST_URL + that.data.page + '/' + app.globalData.token + '/', 'get', null, (res) => {
        that.setData({
          lists: res.data.articles,
          token: app.globalData.token
        })
      })
    }, 2000) 
  },
  //事件处理函数
  goSearch: function (e) {
    wx.navigateTo({
      url: '../search/search'
    })
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
    var that = this;
    fetch(URL.LIST_URL + '1/' + app.globalData.token + '/', 'get', null, (res) => {
      that.setData({
        lists: res.data.articles,
        page: 1,
        loadAll: false
      });
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      // 停止下拉动作  
      wx.stopPullDownRefresh();
    })
  },  
  onReachBottom: function () {
    if (this.data.loadFlag || this.data.loadAll) {
      return
    }
    var that = this;  
    // 页数+1  
    that.setData({
      page: that.data.page + 1,
      loadFlag: true
    })
    setTimeout(()=>{
      fetch(URL.LIST_URL + that.data.page + '/' + app.globalData.token + '/','get',null,(res)=>{
        if (res.data.articles.length) {
          // 设置数据  
          that.setData({
            lists: that.data.lists.concat(res.data.articles),
            loadFlag: false
          })
        } else {
          that.setData({
            loadFlag: false,
            loadAll: true
          })
        }
      })
    },2000)
  }
})
