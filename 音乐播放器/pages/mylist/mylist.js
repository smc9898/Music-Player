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
    music_id:[],
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
      //被跳转页面的路径
      // url: '/pages/play/play',
      // 大碗宽面："../play/play?mid=1359595520"
      //giao ："../play/play?mid=556220425&ids="[1,2,3,4,5]
      //多个参数传递使用&拼接
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