<template>
  <el-dialog
    title="授权窗口模板"
    :visible.sync="visible"
    width="60%"
  >
    <div id="auth">
      <div class="header">
        <img
          class="icon"
          src="http://arkid.vtwo.longguikeji.com/favicon.ico"
          alt=""
        >
        <div class="title">
          ArkID一账通
        </div>
      </div>
      <div class="content">
        <ul>
          <li>获取您的邮件地址/手机号，为了能够找到您的账号或联系到您</li>
          <li>获取您的账号标示或状态信息，为了防止欺诈和安全原因</li>
        </ul>
      </div>
      <form
        class="footer"
        action=""
        method="post"
      >
        <input
          class="btn agree"
          type="submit"
          value="授 权"
        >
        <input
          class="btn"
          type="button"
          value="取 消"
        >
      </form>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'AuthTemplate'
})

export default class extends Vue {
  private visible = false

  show() {
    this.visible = true
  }
}
</script>

<style lang="scss" scoped>
#auth {
  width: 500px;
  height: auto;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  padding: 15px;
  box-shadow: 0 2px 16px rgb(211, 206, 206), 0 0 1px rgb(211, 206, 206), 0 0 1px rgb(211, 206, 206);
}
.header {
  text-align: center;
  .icon {
    width: 60px;
  }
  .title {
    font-size: 20px;
    font-weight: bold;
  }
}
.footer {
  margin-top: 20px;
  .btn {
    width: 360px;
    height: 36px;
    display: block;
    margin-bottom: 10px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    border: 0px;
    cursor: pointer;
  }
  .agree {
    background-color: rgb(177, 31, 31);
    color: white;
  }
}
</style>
