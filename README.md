# AICloudAlbum	

​	**----Welcome to visit [AI CLOUD ALBUM](https://album.labmem.site)**



[toc]



## **Background**

如今，智能手机拍摄的照片越来越大。 但是由于智能手机的内存有限，用户需要一个平台来存储他们拍摄或收集的海量照片。 这就是我们开发 AI 云相册系统的原因。
下面列出了我们的系统与竞争对手相比的一些优势。

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.13.37.png" alt="截屏2021-06-16 下午4.13.37" style="zoom:50%;" />

- 方便：用户可以随时随地上网，轻松使用AI云相册。 注册也很简单。
- 易用：AI云相册的使用也很简单。 清晰的导航和良好的可视化将引导您清楚地找到用户想要的功能。
- 隐私：如果用户将所有图片公开存储在社交网络上。 他们可能不会随意更新他们喜欢的任何图片。 但是在AI云相册中，所有图片都保证隐私。 此外，用户可以确保他们的个人信息不会泄露。
- 智能：AI 图像模块内置于 AI 云相册。 你可以使用图像标签系统让AI自动对您的图像进行分类。 此外，您可以使用人脸检测系统来识别人脸，或者为您喜爱的照片生成精彩时刻。





## **General Goals of the Project**

- AI云相册的全球目标，是为智能手机、PC用户提供一个方便、私密的平台，让他们有一个地方可以安全地存储图片。 如果他们愿意，他们可以尝试使用 AI 功能来帮助他们更有效地管理自己的照片。
- 这是我们项目的甘特图。

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.18.19.png" alt="截屏2021-06-16 下午4.18.19" style="zoom:50%;" />





## **Software Architecture**

- AI Cloud Album 使用 Django 作为其开发框架。
- AI云相册的设计基于Django的MVT（Model-View-Template）框架。
- 下面展示了 MVT 框架的设计。
  - Models：类似于MVC中的M，负责与数据库交互和数据处理。
  - Views：类似于MVC中的C，负责接收请求，处理服务，返回响应。
  - Templates：类似于MVC中的V，负责封装和构造要返回的HTML。

![django-MVT](https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/django-MVT.png)



- 下面展示了AI Cloud Album项目的详细架构，包括服务器架构、模型、视图和数据库设计。

  ![django-Architecture](https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/django-Architecture.png)





## **Major Components**

- 下图展示了AI云相册的主要组成部分，包括前端页面和后端功能。
- 我们的项目主要有4个功能模块：
  - 用户管理：管理用户信息，也用于登录或注册。
  - 图片上传：让用户将他们的图片上传到云存储。
  - 图片管理：让用户管理他们上传的所有图片：如删除、查看或进行更多交互。
  - AI图像模块：通过人工智能处理、分析图像、合成视频。主要是人工智能模块有图像分类和人脸检测模块以及合成精彩时刻视频 。

![ComponentDiagram1](https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/ComponentDiagram1.png)





## **GUI / How to Use**

- 推荐使用Chrome浏览器访问 AI 云相册 ALBUM ，进入**欢迎页**

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.45.47.png" alt="截屏2021-06-16 下午4.45.47" style="zoom:50%;" />



- 如已经注册账号，则进行登录。如未注册，请注册一个账号

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.45.56.png" alt="截屏2021-06-16 下午4.45.56" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午10.33.20.png" alt="截屏2021-06-16 下午10.33.20" style="zoom:50%;" />



- 注册时需要输入符合电话号码标准格式的电话号码进行注册
- 登录时需正确输入验证码

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.46.20.png" alt="截屏2021-06-16 下午4.46.20" style="zoom:50%;" />



- **登录成功后会在页面上方出现导航栏**
  - HOME：欢迎页（本页面）
  - MYPICS：图片主页
  - TAGS：图片分类页
  - FACE：人像分类页
  - VIDEO：精彩时刻视频页
- **Discover 按钮：跳转到MYPICS**

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.46.44.png" alt="截屏2021-06-16 下午4.46.44" style="zoom:50%;" />



- **图片主页，本页面具有如下功能**
  - 查看图片详情
  - 创建并管理相册
  - 上传图片
  - 删除图片
  - 选择图片添加智能标签
  - 选择图片进行人像识别
  - 选择图片创建精彩时刻短视频

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.48.25.png" alt="截屏2021-06-16 下午4.48.25" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.48.31.png" alt="截屏2021-06-16 下午4.48.31" style="zoom:50%;" />



- **点击图片会弹出图片详情窗口，该窗口具有如下功能**
  - 下载
  - 智能标签
  - 人像识别
  - 删除

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.48.50.png" alt="截屏2021-06-16 下午4.48.50" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.49.15.png" alt="截屏2021-06-16 下午4.49.15" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.49.21.png" alt="截屏2021-06-16 下午4.49.21" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.49.34.png" alt="截屏2021-06-16 下午4.49.34" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.49.46.png" alt="截屏2021-06-16 下午4.49.46" style="zoom:50%;" />



- **在图片主页可切换 “所有图片” 子页面到 “相册” 子页面，在该页面可以进行如下操作**
  - 创建相册
  - 删除相册
  - 修改相册信息
  - 进入相册

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.50.32.png" alt="截屏2021-06-16 下午4.50.32" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.51.01.png" alt="截屏2021-06-16 下午4.51.01" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.52.39.png" alt="截屏2021-06-16 下午4.52.39" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.52.56.png" alt="截屏2021-06-16 下午4.52.56" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.54.00.png" alt="截屏2021-06-16 下午4.54.00" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.54.05.png" alt="截屏2021-06-16 下午4.54.05" style="zoom:50%;" />



- **进入相册后，可以在相册中进行如下操作：**
  - 上传图片
  - 删除图片
  - 查看图片详情
  - 智能分类
  - 人像识别
  - 创建精彩时刻短视频

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.54.14.png" alt="截屏2021-06-16 下午4.54.14" style="zoom:50%;" />



- **上传图片功能，在“所有图片”和“相册”中都可以进行图片的上传**

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.54.24.png" alt="截屏2021-06-16 下午4.54.24" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.54.32.png" alt="截屏2021-06-16 下午4.54.32" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.55.06.png" alt="截屏2021-06-16 下午4.55.06" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.55.46.png" alt="截屏2021-06-16 下午4.55.46" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.55.49.png" alt="截屏2021-06-16 下午4.55.49" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.55.56.png" alt="截屏2021-06-16 下午4.55.56" style="zoom:50%;" />



- **智能标签，使用AI（基于MobileNet，使用迁移学习技术生成的神经网络）对用户上传的图片进行单标签分类（共53个类别）。用户可以在“所有图片”、”图片相册“ 内 以及图片详情页主动对上传的图片进行智能标签。如用户忘记对上传的图片进行标签，后台程序会在用户登出后对所有未标签的图片进行智能标签。**

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.56.22.png" alt="截屏2021-06-16 下午4.56.22" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.56.27.png" alt="截屏2021-06-16 下午4.56.27" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.56.32.png" alt="截屏2021-06-16 下午4.56.32" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.56.37.png" alt="截屏2021-06-16 下午4.56.37" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-16 下午4.56.43.png" alt="截屏2021-06-16 下午4.56.43" style="zoom:50%;" />



- **经过智能标签的图片会在 “Tag” 属性显示它们所属的标签，同时可以通过Tag页面访问各个标签的图片**

  

  ![1](https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/1.jpg)



<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午6.21.06.png" alt="截屏2021-06-18 下午6.21.06" style="zoom:50%;" />



- **人像识别功能，使用人像识别库（face_recognition）对用户上传的人像进行识别，查看该图片中是否有人像，并对人像进行提取。用户可以在“所有图片”、”图片相册“ 内 以及图片详情页主动对上传的图片进行人像识别。如用户忘记对上传的图片进行人像识别，后台程序会在用户登出后对所有未进行人像识别的图片进行人像识别。**

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午6.38.35.png" alt="截屏2021-06-18 下午6.38.35" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午6.37.51.png" alt="截屏2021-06-18 下午6.37.51" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午6.37.56.png" alt="截屏2021-06-18 下午6.37.56" style="zoom:50%;" />



- **制作精彩时刻短视频，在 “所有图片” 页 和 “相册图片” 页 中选择图片后点击左侧的 “视频” 按钮，便可制作短视频，支持在线播放，下载MP4。**

  **注：为了正常播放短视频，推荐使用Chrome 浏览器。**

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午6.44.28.png" alt="截屏2021-06-18 下午6.44.28" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午6.51.36.png" alt="截屏2021-06-18 下午6.51.36" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午6.56.15.png" alt="截屏2021-06-18 下午6.56.15" style="zoom:50%;" />



- **搜索你的相册。导航栏左侧的搜索框，可输入标签或图片名称进行搜索，返回符合条件的图片集。**

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午7.02.51.png" alt="截屏2021-06-18 下午7.02.51" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午7.03.18.png" alt="截屏2021-06-18 下午7.03.18" style="zoom:50%;" />

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午7.03.40.png" alt="截屏2021-06-18 下午7.03.40" style="zoom:50%;" />



- **注销，用户点击注销按钮后会退出登录。同时系统会检查没有被标签和人像识别的图片对其进行处理。**

<img src="https://github.com/LabmemNo004/LabmemNo004.github.io/blob/master/Images/AICloudAlbum/截屏2021-06-18 下午7.08.46.png" alt="截屏2021-06-18 下午7.08.46" style="zoom:50%;" />






