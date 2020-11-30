// pages/paihang/paihang.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    songs:[],
    albumPicUrls:[],
    mvs:[],
    setu:[],
    music_id:[],
    limit:6
  },
  
  gotoPlay:function(e){
    var id = e.currentTarget.dataset.id;
    var ids = [];
    for(var i=0;i<this.data.songs.length;i++){
      ids.push(this.data.songs[i].id);
    }
    wx.navigateTo({
      url:"../play/play?mid="+id+"&ids="+ids,
    })
    console.log('sss')
    console.log(id)
  },

  /**;
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.sb(this)
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
  sb: function(that){
    wx.cloud.callFunction({
      name:'get_music',
      success:function(res){
        //搜索结果
        console.log(res.result.data)
        var resultSongs = res.result.data;
        var songs = []
        //遍历resultSongs
        for(var i = 0; i < resultSongs.length; i++){
            songs.push(resultSongs[i].song)
        }
        that.setData({
          songs:songs
        })
      }
    })
  }

})