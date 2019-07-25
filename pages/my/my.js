// pages/my/my.js
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: '',
    id: ''
  },
  login: function() {
    wx.navigateTo({
      url: '../../pages/login/login',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        acceptDataFromOpenedPage: function (data) {
          console.log(data)
        },
        someEvent: function (data) {
          console.log(data)
        }
      },
      success: function (res) {
        // 通过eventChannel向被打开页面传送数据
        //res.eventChannel.emit('acceptDataFromOpenerPage', { data: 'test' })
      }
    })
  },
  userHandle: function() {
    wx.cloud.callFunction({
      name: 'login',
    }).then(res => {
      console.log(res)
      this.setData({
        openid: res.result.openid
      })
      this.saveUser()
    }).catch(err => {
      console.log(err)
    })
  },
  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    this.updateUser(e.detail.userInfo)
  },
  saveUser: function(){
    db.collection('users').add({
      data: {
        openid: this.data.openid
      }
    }).then(res => {
      console.log(res)
      this.searchUser()
    }).catch(err => {
      console.log(err)
    })
  },
  searchUser: function(){
    db.collection('users')
      .where({
        openid: this.data.openid
      }).get().then(res => {
        console.log(res, '====searchUser====')
        this.setData({
          id: res.data[0]._id
        })
      }).catch(err => {
        console.log(err)
      })
  },
  updateUser: function(data){
    db.collection('users').doc(this.data.id).update({
      data: {
        name: data.nickName,
        avatarUrl: data.avatarUrl,
        country: data.country
      }
    }).then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
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