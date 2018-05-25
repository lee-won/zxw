const app = getApp()
const URL = require('../../common/url_config.js')
const fetch = require('../../common/fetch.js')
const handleStorage = require('../../common/basic.js')
const NO_RESULT_TEXT = '未找到相关文章'
Page({
  data: {
    searchValue: '',
    page: 1,
    search_history:[],
    articles: null,
    recommends: [],
    token: '',
    loadFlag: false,
    loadAll: false,
    basic_url:URL.BASIC_URL
  },
  onLoad: function() {
    var that = this
    /*
    handleStorage('get',false,'searchHistory',null, (res)=>{
      if(res) {
        that.setData({
          search_history: res
        })
      } else {
        handleStorage('set', false, 'searchHistory', that.data.search_history,null)
      }
    })
    */
    fetch(URL.TAGS_URL + app.globalData.token + '/', 'get', null, (res) => {
      this.setData({
        recommends: res.data.tags,
        token: app.globalData.token
      })
    })
  },
  bindKeyInput: function (e) {
    this.setData({
      searchValue: e.detail.value,
      articles: null
    })
  },
  clearSearchValue: function() {
    this.setData({
      searchValue: '',
      articles: null,
      page: 1,
      loadAll: false
    })
  },
  search: function() {
    this.setData({
      page: 1,
      loadAll:false
    })
    wx.showLoading({
      title: '请稍后',
    })
    var that = this
    fetch(URL.SEARCH_URL + that.data.page + '/' + that.data.searchValue + '/'+ app.globalData.token + '/', 'get', null, (res) => {
      wx.hideLoading()
      if (res.data.articles.length > 0) {
        that.setData({
          articles: res.data.articles
        })
      } else {
        that.setData({
          articles: NO_RESULT_TEXT
        })
      }
      var oldHistory = that.data.search_history
      if (oldHistory.indexOf(that.data.searchValue) === -1) {
        oldHistory.unshift(that.data.searchValue)
        if (oldHistory.length > 8) {
          oldHistory = oldHistory.slice(0, 8)
        }
        that.setData({
          search_history: oldHistory
        })
        handleStorage('set', false, 'searchHistory', that.data.search_history)
      } 
    })
  },
  
  historySearch: function(e) {
    this.setData({
      searchValue: e.target.dataset.history,
      page: 1,
      loadAll: false
    })
    var that = this
    fetch(URL.SEARCH_URL + that.data.page + '/' + e.target.dataset.history + '/' + app.globalData.token + '/', 'get', null, (res) => {
      if (res.data.articles.length > 0) {
        that.setData({
          articles: res.data.articles
        })
      } else {
        that.setData({
          articles: NO_RESULT_TEXT
        })
      }
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
    setTimeout(() => {
      fetch(URL.LIST_URL + that.data.page + '/' + app.globalData.token + '/', 'get', null, (res) => {
        if (res.data.articles.length) {
          // 设置数据  
          that.setData({
            articles: that.data.articles.concat(res.data.articles),
            loadFlag: false
          })
        } else {
          that.setData({
            loadFlag: false,
            loadAll: true
          })
        }
      })
    }, 2000)
  },
  onPullDownRefresh: function () {
    // 显示顶部刷新图标  
    wx.showNavigationBarLoading();
      // 隐藏导航栏加载框  
      wx.hideNavigationBarLoading();
      // 停止下拉动作  
      wx.stopPullDownRefresh();
  }
})