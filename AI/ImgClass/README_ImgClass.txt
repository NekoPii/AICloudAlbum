# Image Rough Classes

一共分为以下14大类。
需要加载image_class.json文件获得具体类和大致类的映射。
确保它和MyImgClass文件在同一路径下。

animal 动物
human 人
plant 植物
vehicle 所有交通工具
clothes 所有衣物穿着
instrument 所有机械器物
music 音乐
building 建筑
grocery 日常用品
furniture 家具
sport 运动
food 食物
scenery 自然风光
entertainment 娱乐

# API说明

调用函数 result=ImageClassification(filename)
filename 是图片的路径。
result为result = [class ,detailed_class, possibility]，分别为
大致类（14种），具体类（1000种）和概率。
