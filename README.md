## 大纲

基本页面有四种：
 -- dashborad
 -- formpage
 -- tablepage
 -- treepage

特殊页面
 -- api document 类型的 iframe 等

### 基础结构

#### 组件

每个组件有对应的state，state其中包含了该组件所有的属性和事件等

意味着每个组件只需要改变对应的state内容就能改变当前组件的显示

state中的事件值类型为string，用来指代 flow name

state的具体参考可以阅读 ---

#### 页面

每个页面也有对应的state，为上面组件的state的一些集合集中展示

通过操作对应页面的state，来实现页面的增删改查等功能的实现
