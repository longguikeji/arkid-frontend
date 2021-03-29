## 大纲

基本页面有四种：
 -- dashborad
 -- formpage
 -- tablepage
 -- iframepage

### 组件结构

每个组件有对应的state，state其中包含了该组件所有的props，event等等

意味着每个组件只需要改变对应的state内容就能改变当前组件的显示

state中的事件都应用action开头，值类型为string，用来指代 flow name
