<template>
  <el-dialog
    :visible="true"
    title="输入Slug开始使用"
    width="500px"
    :show-close="false"
    :fullscreen="fullscreen"
    class="app-login__slug"
  >
    <el-form ref="form">
      <el-form-item>
        <el-input
          v-model="slug"
          placeholder="请输入Slug"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleClick"
        >
          点击提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component({
  name: 'LoginSlug'
})
export default class LoginSlug extends Vue {
  private slug = ''

  get fullscreen(): boolean {
    return document.body.clientWidth < 600
  }

  handleClick() {
    console.log(this.slug)
  }
}
</script>

<style lang="scss" scoped>
.app-login__slug {
  background-image: url('../../assets/bgc.png');
  background-color: #0f62ea;
  display: flex;
  align-items: center;
  justify-content: center;

  ::v-deep .el-dialog {
    margin-top: 0px;
    .el-dialog__header {
      font-weight: 600;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>
