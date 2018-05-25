const app = getApp()
var URL = require('../../common/url_config.js')
Page({
  data: {
    url: '',
    desc: null,
    modalFlag: false,
    phoneNum: '',
    code: ''
  },
  onLoad: function(options) {
    console.log(options.url)
    this.setData({
      url: options.url
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShow: function() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onShareAppMessage: function (res) {
    var that = this
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '这是详情页标题',
      path: '/pages/detail/detail?id=' + that.data.id,
      success: function (res) {
        if (res.shareTickets) {
          wx.getShareInfo({
            shareTicket: res.shareTickets[0],
            success(res) {
              var data = res
              wx.login({
                success: (res) => {
                  wx.request({
                    url: 'http://192.168.50.106:8000/api/article/miniapp/share/',
                    method: 'post',
                    data:{
                      code: res.code,
                      encryptedData: data.encryptedData,
                      iv: data.iv
                    },
                    success: (res) => {
                      console.log(res)
                    }
                  })
                }
              })
            }
          })
        }
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  buy: function() {
    this.setData({
      modalFlag: !app.globalData.phone
    })
   // if (app.globalData.phone) {
      wx.login({
        success: (res) => {
          wx.request({
            url: 'http://192.168.50.106:8000/api/course/buy/2/' + res.code + '/'+app.globalData.token + '/',
            method: 'post',
            success: function (res) {
              if (res.code === 0) {
                wx.requestPayment({
                  'timeStamp': '1490840662',
                  'nonceStr': '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
                  'package': 'prepay_id=wx2017033010242291fcfe0db70013231072',
                  'signType': 'MD5',
                  'paySign': 'MD5(appId=wxd678efh567hg6787&nonceStr=5K8264ILTKCH16CQ2502SI8ZNMTM67VS&package=prepay_id=wx2017033010242291fcfe0db70013231072&signType=MD5&timeStamp=1490840662&key=qazwsxedcrfvtgbyhnujmikolp111111) = 22D9B4E54AB1950F51E0649E8810ACD6',
                  'success': function (res) {
                    console.log(res)
                  },
                  'fail': function (res) {
                    console.log(res)
                  }
                })
              }
            }
          })
        }
      })
     
   // }else{

  //  }
  },
  closeModal () {
    this.setData({
      modalFlag: false
    })
  },
  bindKeyInput1: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  bindKeyInput2: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  getCode () {
    wx.request({
      url: URL.SEND_MESSAGE_URL + this.data.phoneNum + '/' + app.globalData.token + '/' ,
      method: 'GET',
      success: (res) => {
        if (res.data.code === 0) {
          wx.showToast({
            title: '验证码已发送到您的手机，请注意查收',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
  },
  sendData () {
    wx.request({
      url: URL.SAVE_PHONE_URL + this.data.phoneNum + '/'+ this.data.code + '/' + app.globalData.token + '/',
      method: 'GET',
      success: (res) => {
        console.log(res)
      }
    })
  }
})