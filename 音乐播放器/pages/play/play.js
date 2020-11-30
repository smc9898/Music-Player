// pages/play/play.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制声音播放还是暂停
    action:{
      method:"play"
    },
    //定义歌曲id变量
    id:"",
    //定义存放所有歌曲id的数组变量
    ids:[],
    //定义变量记录歌曲的暂停或者播放状态
    //默认是播放状态
    state:"play",
    //定义默认的播放模式
    mode:"single",
    //定义变量接收当前播放的歌曲详情
    song:null,
    //定义一个歌词数组
    lyricArray:[],
    //竖向滚动条位置初始值为0
    marginTop:0,
    //记录当前唱到的行号
    currentIndex:0,
    //播放时间
    playTime:"00:00",
    //结束时间
    endTime:"00:00",
    //歌曲进度条最大值
    max:100,
    //进度条读取移动的值
    move:0,
    like: 'like'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取传递的歌曲id值
    var mid = options.mid;
    //获取传递的所有id数组    经过页面传参之后，接收的是字符串类型，可以将字符串转换为数组
    var idStr = options.ids;
    //使用切割的方法    split:返回的结果就是数组
    var ids = idStr.split(",");
    //给data中的属性赋值
    this.setData({
      id:mid,
      ids:ids
    })
    //调用获取歌曲信息的方法
    this.getSongInfoById();
    //通过id获取歌词
    this.getLyricById();
  },
  /**
   * 根据歌曲id获取歌曲详情的方法
   */
  getSongInfoById:function(){
   //获取当前歌曲的id
   var currentId = this.data.id;
   //获取当前对象(经过异步加载回调函数之后当前对象已经发生了改变)
   var that = this;
   wx.request({
     //url：请求的服务器接口路径
     //服务器接口地址后携带多个参数使用 & 做分隔
     url: 'https://music.163.com/api/song/detail/?id='+currentId+'&ids=['+currentId+']',
     success:function(res){
       //层层解析返回的结果，拿到所需的歌曲详情
       var musicInfo = res.data.songs[0];
       //将musicInfo赋值给data中的song
       that.setData({
         song:musicInfo
       })
     }
   })
  },
  /**
   * 通过id获取歌词的方法
   */
  getLyricById:function(){
    var that = this;
    //获取当前歌曲的id
    var currentId = this.data.id;
    //使用歌词接口向网易云服务器发请求
    wx.request({
      url: 'https://music.163.com/api/song/lyric?os=pc&id='+currentId+'&lv=-1&kv=-1&tv=-1',
      //success是请求成功之后回来执行的方法，res是响应结果
      success:function(res){
        //判断nolyric属性
        if(res.data.nolyric!=true){
          //解析歌词所在的字符串
          var lyrics = res.data.lrc.lyric;
          //调用解析歌词的方法
          var result = that.parseLyric(lyrics);
          //调用去掉空歌词的方法
          var finalResult = that.sliceNull(result);
          //给data中的属性赋值
          that.setData({
            lyricArray:finalResult
          })
        }
      }
    })
  },
  /**
   * 解析歌词的方法
   * 正则表达式
   */
  parseLyric:function(lyrics){
    //定义一个数组，存储歌词和时间，而且歌词和时间能够一一对应
    var lyricResult = []; 
    var lyricArray = lyrics.split("\n");
    //判断最后一个元素(歌词和时间)是否为空，如果为空，删掉
    if(lyricArray[lyricArray.length-1]==""){
      //删除元素
      lyricArray.pop();
    }
    var pattern = /\[\d{2}:\d{2}\.\d{2,3}\]/;

    lyricArray.forEach(function(v,i,a){
      //使用正则表达式进行正则替换
      //replace：替换
      var real_lyric = v.replace(pattern,"");
      //对每一句歌词处理，将时间单独提取出来   match返回的是数组
      var time = v.match(pattern);     
      if(time!=null){
        var timeResult = time[0].slice(1,-1);
        var timeArray = timeResult.split(":");
        var finalTime = parseFloat(timeArray[0])*60+parseFloat(timeArray[1]); 
        lyricResult.push([finalTime,real_lyric]);
      }
    })
    //返回歌词数组    谁调用方法就把结果返回给谁
    return lyricResult;
  },
  /**
   * 
   */
  sliceNull:function(lyricArray){
    //定义一个数组
    var result = [];
    //遍历每个元素
    for(var i=0;i<lyricArray.length;i++){
      //判断歌词是否为空
      if(lyricArray[i][1]!=""){
        result.push(lyricArray[i]);
      }
    }
    return result;
  },
  /**
   * 播放进度改变时触发的方,能实现歌词滚动
   */
  changeTime:function(e){
    //获取当前播放进度
    var currentTime = e.detail.currentTime;
    //获取当前歌曲的总时长
    var duration = e.detail.duration;
    var playMinutes = Math.floor(currentTime/60);
    //计算播放时长秒钟数
    var playSeconds = Math.floor(currentTime%60);
    //计算总时长分钟数
    var endMinutes = Math.floor(duration/60);
    //计算总时长秒钟数
    var endSeconds = Math.floor(duration%60);
    //计算data中的max，进度条最大取值
    var max = duration;
    //计算进度条移动的值
    var move = currentTime;
    //判断分秒是否小于10
    if(playMinutes<10){
      playMinutes = "0"+playMinutes;
    }
    if(playSeconds<10){
      playSeconds = "0"+playSeconds;
    }
    if(endMinutes<10){
      endMinutes = "0"+endMinutes;
    }
    if(endSeconds<10){
      endSeconds = "0"+endSeconds;
    }
    this.setData({
      playTime:playMinutes+":"+playSeconds,
      endTime:endMinutes+":"+endSeconds,
      max:max,
      move:move
    })
    //获取歌词数字
    var lyricArray = this.data.lyricArray;
    //计算滚动条的位置
    if(this.data.currentIndex>=8){
      this.setData({
        marginTop:(this.data.currentIndex-8)*30
      })
    }
    //遍历所有歌词
    //最后一句歌词没有下一句,所以不需要跟下一句的时间做比较
    if(this.data.currentIndex==lyricArray.length-2){
      //判断当前的时间是否大于等于最后一句的时间
      if(currentTime>=lyricArray[lyricArray.length-1][0]){
        //正在唱最后一句
        this.setData({
          currentIndex:lyricArray.length-1
        })
      }
    }else{
      for(var i=0;i<lyricArray.length-1;i++){
        //将每个歌曲进度都跟数组中的歌词比较,在当前歌词的时间到下一句歌词的时间范围之内
        if(currentTime>=lyricArray[i][0] && currentTime<lyricArray[i+1][0]){
          //设置正在播放的行号
          this.setData({
            currentIndex:i
          })
        }
      }

    }
  },
  /**
   * 进度条拖动执行的方法
   */
  tuoDong:function(e){
    //当前拖动的value值
    var value = e.detail.value;
    //修改进度条取值和音频进度
    this.setData({
      move:value
    })
    this.setData({
      action: {
        method: "setCurrentTime",
        data:value
      }
    })
  },
  /**
   * 控制音乐的播放与暂停
   */
  playOrPause:function(){
    //获取当前的状态   如果当前是暂停状态，改为播放状态    如果是播放状态，改为暂停状态
    var musicState = this.data.state;
    //判断
    if(musicState=="play"){
      //改为暂停状态
      //停止音频播放
      this.setData({
        action:{
          method:"pause"
        },
        state:"pause"
      })
    }else{
      //改为播放状态
      this.setData({
        action:{
          method:"play"
        },
        state:"play"
      })
     
    }
  },
  likeOrDislike:function(){
    var that = this
    console.log(this.data)
    wx.cloud.callFunction({
      name:'get_music',
      success:function(res){
        //搜索结果
        console.log(res.result.data)
        var resultSongs = res.result.data;
        var songs = []
        var flag = false
        //遍历resultSongs
        for(var i = 0; i < resultSongs.length; i++){
           if (resultSongs[i].music_id == that.data.id) {
            flag = true
            break;
           }
        }
        if (flag) {
          // delete
          wx.cloud.callFunction({
            // 云函数名称
            name: 'del_music',
            // 传给云函数的参数
            data: {
              music_id :that.data.id,
            },
            success: function(res) {
              console.log(res) 
            },
            fail: console.error
          })
          that.setData({
            like: 'like'
          })
        } else {
          // add 
          wx.cloud.callFunction({
            // 云函数名称
            name: 'add_music',
            // 传给云函数的参数
            data: {
              music_id :that.data.id,
              song : that.data.song,
            },
            success: function(res) {
              console.log(res) 
            },
            fail: console.error
          })
          that.setData({
            like: 'dislike'
          })
        }
      }
    })
  },
  /**
   * 上一首歌曲
   */
  prevSong:function(){
    //获取当前的歌曲id
    var currentId = this.data.id;
    //定义一个变量记录当前歌曲的下标
    var index = 0;
    //根据当前id值找出当前歌曲的下标
    for(var i=0;i<this.data.ids.length;i++){
      //判断id是否一致
      if(currentId==this.data.ids[i]){
          index = i;
          break;
      }
    }
    //上一首歌曲下标
    var prevIndex = index == 0 ? this.data.ids.length-1:index-1;
    //上一首歌曲id
    var prevId = this.data.ids[prevIndex];
    //修改当前歌曲id
    this.setData({
      id:prevId
    })
    //歌曲切换之后action要重新赋值
    this.setData({
      action:{
        method:"play"
      }
    })
    //重新初始化marginTop和行号
    this.setData({
      marginTop:0,
      currentIndex:0
    })
    //调用获取歌曲详情方法和获取歌词的方法
    this.getSongInfoById();
    this.getLyricById();
  },
  /**
   * 下一首歌曲
   */
  nextSong:function(){
    //获取当前的歌曲id
    var currentId = this.data.id;
    //定义一个变量记录当前歌曲的下标
    var index = 0;
    //根据当前id值找出当前歌曲的下标
    for (var i = 0; i < this.data.ids.length; i++) {
      //判断id是否一致
      if (currentId == this.data.ids[i]) {
        index = i;
        break;
      }
    }
    //下一首歌曲下标
    var nextIndex = index==this.data.ids.length-1?0:index+1;
    //上一首歌曲id
    var nextId = this.data.ids[nextIndex];
    //修改当前歌曲id
    this.setData({
      id: nextId
    })
    //歌曲切换之后action要重新赋值
    this.setData({
      action: {
        method: "play"
      }
    })
    //重新初始化marginTop和行号
    this.setData({
      marginTop: 0,
      currentIndex: 0
    })
    //调用获取歌曲详情方法和获取歌词的方法
    this.getSongInfoById();
    this.getLyricById();
  },
  /**
   * 点击切换播放模式
   */
  changeMode:function(){
    //获取当前的播放模式
    var mode = this.data.mode;
    if(mode=="single"){
      //切换列表循环模式
      this.setData({
        mode:'loop'
      })
    }else{
      this.setData({
        //切换为单曲循环模式
        mode:"single"
      })
    }
  },
  /**
   * 当音频播放到末尾时触发的方法
   */
  changeMusic:function(){
    //判断时单曲循环还是列表循环
    var mode = this.data.mode;
    if(mode=="single"){
      //将当前id重新设置
      this.setData({
        id:this.data.id
      })
      this.setData({
        action:{
          method:"play"
        }
      })
    }else{
      this.nextSong();
    }
    //歌词重新滚动，行号也重新初始化
    this.setData({
      marginTop:0,
      currentIndex:0
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('判断like')
    console.log(this.data.id)
    var that = this
    wx.cloud.callFunction({
      name:'get_music',
      success:function(res){
        var resultSongs = res.result.data;
        var flag = false
        //遍历resultSongs
        for(var i = 0; i < resultSongs.length; i++){
           if (resultSongs[i].music_id == that.data.id) {
            flag = true
            break;
           }
        }
        console.log(flag)
        if (flag) {
          that.setData({
            like: 'dislike'
          })
        } else {
          that.setData({
            like: 'like'
          })
        }
      }
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