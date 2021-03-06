// pages/paihang/paihang.js
Page({

  /**
   * 
   */
  data: {
    kw:"",
    songs:[],
    albumPicUrls:[],
    mvs:[],
    setu:[],
    limit:10
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
    this.sb(this)
    console.log(this.data.albumPicUrls)
    this.setSeTu()
    console.log(this.data.setu)
  },

  setSeTu: function() {
    var setu = []
    setu.push('https://s3.ax1x.com/2020/11/15/DFhdEj.jpg')
    setu.push('https://s3.ax1x.com/2020/11/12/Bzpn4H.jpg')
    setu.push('https://s3.ax1x.com/2020/11/15/DF0om6.jpg')
    setu.push('https://s3.ax1x.com/2020/11/15/DF05Ox.jpg')
    setu.push('https://s3.ax1x.com/2020/11/20/DlmJhQ.png')
    this.setData({
      setu:setu
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

  },

   //随机数组排列
   /* getMusicImage:function(searchIds,i,length){
    //console.log('cnxm')
    //递归：自己调用自己
    //获取存储所有封面结果的数组
    var albumPicUrls = this.data.albumPicUrls;
    var that = this;
    var setu_num = Math.floor(Math.random() * that.data.setu.length)
    albumPicUrls.push(that.data.setu[setu_num]);
    that.setData({
         albumPicUrls:albumPicUrls
    })
    if(++i<length){
      that.getMusicImage(searchIds,i,length);
    }
  }, */
 
 /**
   * 
   *  
   */
  getMusicImage:function(searchIds,i,length){
    //获取存储所有封面结果的数组
    var albumPicUrls = this.data.albumPicUrls;
    var that = this;
    //发请求
    wx.request({
      url: 'https://music.163.com/api/song/detail/?id=' + searchIds[i] + '&ids=[' + searchIds[i] +']',
      success:function(res){
        //获取封面
        var albumPic = res.data.songs[0].album.picUrl;
        //获取专辑名称
        var name = res.data.songs[0].album.name;
        //添加封面
        albumPicUrls.push(albumPic);
        that.setData({
          albumPicUrls:albumPicUrls
        })
        //判断递归结束的条件
        // ++i:先计算后赋值   i++：先赋值后计算
        if(++i<length){
          that.getMusicImage(searchIds,i,length);
        }
      }
    })
  },
  
  /**
   * 根据歌曲名称查询mv
   * for循环中写异步加载不是按照你for循环执行的顺序执行的，顺序会有错乱，使用递归解决
   *  需要存放所有歌名的数组、需要每次递归的下标、需要存储mv结果的数组,截至下标  、歌手id
   */
  getMvBySongName:function(names,i,length,artists){
    //获取存储mv结果的全局变量
    var mvs = this.data.mvs;
    var that = this;
    //发请求
    wx.request({
      url: 'https://api.mlwei.com/music/api/mv/?key=523077333&mv=163&type=so&word='+names[i]+'&page=1',
      success:function(res){
        //获取查询到的mv信息
        var result = res.data.result.mvs;
        var flag = false;
        if(result!=undefined){
          //定义变量
          //对result结果通过歌手id做进一步删选
          for(var j=0;j<result.length;j++){
            //根据当前歌手的id查询对应的mv
            if (artists[i] == result[j].artistId){
              mvs.push(result[j].id);
              flag = true;
              break;
            }
          }

        }
          //判断flag
        if(!flag){
            mvs.push(-1);
        }
        that.setData({
          mvs:mvs
        })
        if (++i < length) {
           that.getMvBySongName(names, i, length, artists);
        }
      }
    })
  },
  /**
   * 监听mv图标点击事件
   */
  playMv:function(e){
    //跳转到mv页面
    var mvId = e.currentTarget.dataset.mvid;
    //携带mvid跳转到mv页面
    wx.navigateTo({
      url: '/pages/mv/mv?mvId='+mvId,
    })
  },
  
  sb: function(that){
    console.log(that.data.albumPicUrls)
    //定义空数组存储搜索出来的所有id
    var searchIds = [];
    //定义存放歌曲名称的数组
    var names = [];
    //定义存储歌手id的数组
    var artists = [];
    wx.request({
      url: 'https://music.163.com/api/playlist/detail?id=3778678',
      success:function(res){
        console.log(that.data.albumPicUrls)
        console.log(res.data.result);
        //搜索结果
        var resultSongs = res.data.result.tracks;
        //遍历resultSongs
        for(var i=0;i<resultSongs.length;i++){
          //将搜索出的id添加到searchIds
          searchIds.push(resultSongs[i].id);
          //将搜索出的歌曲名称添加到names中
          names.push(resultSongs[i].name);
          //将搜索出的歌手id添加到artists中
          artists.push(resultSongs[i].artists[0].id);
        }
        console.log(that.data.albumPicUrls)
        // 清空封面数组
        that.setData({
          albumPicUrls:[],
          mvs:[]
        })
        // this.albumPicUrls = []
        //调用查询封面的方法
        that.getMusicImage(searchIds,0,searchIds.length);
        //调用查询mv信息的方法(根据歌曲名和歌手id查询mv)
        that.getMvBySongName(names,0,names.length,artists);
        that.setData({
          songs:resultSongs
        })
      }
    })
  }
    
})