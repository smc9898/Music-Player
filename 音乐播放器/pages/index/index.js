// pages/demo1/demo1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kw:"",
    songs:[],
    albumPicUrls:[],
    video:[],
    recommend:[],
    limit:6
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     //云数据库初始化  
     const db = wx.cloud.database({});
     const my_ablum = db.collection('ablum_collection');
  },
  //云函数
  main:function(){

  },
  gotoPlay:function(e){
    var id = e.currentTarget.dataset.id;
    var ids = [];
    wx.navigateTo({
      url:"../play/play?mid="+id+"&ids="+ids,
      
    }) 
  },
  gotorecommend:function() {
    var list_num = Math.floor(Math.random() * this.data.recommend.length)
    var id = this.data.recommend[list_num]
    var ids = [];
    wx.navigateTo({
      url:"../play/play?mid="+id+"&ids="+ids,
    }) 
  },

  gotoVideo:function(video,i,length){
    var list_num = Math.floor(Math.random() * this.data.video.length)
    var url = this.data.video[list_num]
   
    wx.navigateTo({
      url: url,
    })
  },
  gotoBang:function(e){
    wx.reLaunch({
      url: '/pages/paihang/paihang',
    })
  },
   gotoList:function(e){
     var id = e.currentTarget.dataset.id;
     var ids = []
     wx.navigateTo({
       url: '../list'+id+'/list'+id,
     })
   },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setVideo()
    this.setRecommend()
    //console.log(this.data.video)
  },
  setVideo:function(){
    var video = []
    video.push('/pages/list1/list1')
    video.push('/pages/list2/list2')
    video.push('/pages/list3/list3')
    this.setData({
      video:video
    })
  },

  setRecommend: function() {
    var recommend = []
    recommend.push('1455699833')
    recommend.push('1396561141')
    recommend.push('506196018')
    recommend.push('1485858993')
    recommend.push('1313107065')
    recommend.push('506196018')
    this.setData({
      recommend: recommend
    })
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