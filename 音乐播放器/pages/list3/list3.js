// pages/paihang/paihang.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    kw:"",
    //定义歌曲数组存储搜索结果
    songs:[],
    //定义存储封面的数组
    albumPicUrls:[],
    mvs:[],
    setu:[],
    //定义存放mv的数组
    limit:6
  },
  
  gotoPlay:function(e){
    // e中包含我们所携带的所有参数
    //接受事件传递的参数
    var id = e.currentTarget.dataset.id;
    //定义空数组，存储所有歌曲id
    var ids = [];
    //遍历歌曲列表，将每首歌曲的id添加到数组中
    for(var i=0;i<this.data.songs.length;i++){
      ids.push(this.data.songs[i].id);
    }
    //跳转到play播放页面
    //保留当前页面，还能跳转到新页面
    wx.navigateTo({
      url:"../play/play?mid="+id+"&ids="+ids,
    })
  },
  do_search:function(){
    
  },

  /**;
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

  },
})