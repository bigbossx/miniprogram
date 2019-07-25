
# 云开发模式的小程序demo 
看到有人fork的，所以还是完善一下。稍微搞一搞readmd。

### 首先是一些完成的效果
![image](https://github.com/VisonM/miniprogram/blob/master/gif/ezgif-1-84c837c7a346.gif)

![image](https://github.com/VisonM/miniprogram/blob/master/gif/ezgif-1-654c164131ae.gif)

![image](https://github.com/VisonM/miniprogram/blob/master/gif/ezgif-1-d601cf33f5e7.gif)

> 跑这个项目的话。本地没有数据库的话，所以可能卡在某个地方。因为这是很早的项目了，云开发刚出来就做了。所以踩坑了，有些地方有点乱，也不打算整理。


### 一些踩坑建议

- 不知道现在云开发的更新近况。但是云开发其实提供了客户端直接操作数据库的能力。但是权限很低。所以，尽量不要去用客户端直接写入数据库。不然数据更新或者获取有问题他没报错，就裂开了。你不能改别人添加的数据。尽管这是你的数据库。
- 把云函数当作后端接口去用。
- 这小程序的实时聊天是用leancloud的即时通讯服务
  

