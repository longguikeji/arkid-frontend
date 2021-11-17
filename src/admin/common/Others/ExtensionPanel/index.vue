<template>
  <el-card
    class="extension-panel"
    shadow="hover"
  >
    <div
      slot="header"
      class="main"
    >
      <img
        :src="logo"
        alt=""
      >
      <div class="content">
        <a
          class="name"
          :href="state.homepage"
          target="_blank"
        >{{ state.name }}</a>
        <div class="description">
          {{ state.description }}
        </div>
        <b class="maintainer">
          作者 : <span class="text">{{ state.maintainer }}</span>
        </b>
        <b class="version">
          版本 : <span class="text">{{ state.version }}</span>
        </b>
      </div>
      <el-button
        size="mini"
        plain
      >
        点击安装
      </el-button>
    </div>
    <div class="footer">
      <span class="tag">
        类型:
        <el-tag type="info">{{ state.type }}</el-tag>
      </span>
      <span class="tag">
        标签:
        <el-tag>{{ state.tags }}</el-tag>
      </span>
    </div>
  </el-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ExtensionPanelState from './ExtensionPanel'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'ExtensionPanel'
})
export default class extends Mixins(BaseVue) {
  get logo() {
    return this.state.logo || require('@/assets/extension.png')
  }

  get state(): ExtensionPanelState {
    return this.$state as ExtensionPanelState
  }
}
</script>

<style lang="scss" scoped>
.extension-panel {
  width: 510px !important;
  height: 210px !important;
  display: inline-block;
  margin: 10px 0 0 10px;
  overflow: hidden;

  ::v-deep .el-card__header {
    padding: 0px;
  }

  ::v-deep .el-card__body {
    padding: 0px;
  }

  .main {
    padding: 10px;
    height: 150px;
    overflow: hidden;
    position: relative;
    img {
      width: 125px;
      height: 125px;
      vertical-align: middle;
    }
    .content {
      height: 100%;
      vertical-align: middle;
      margin-left: 10px;
      display: inline-block;
      font-weight: normal;
      .name {
        font-size: 25px;
        font-weight: bold;
        color: #1272d1;
      }
      .description {
        font-size: 15px;
        margin: 10px 0 10px 0px;
        max-height: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .maintainer, .version {
        font-size: 15px;
        display: block;
        font-style: italic;
        .text {
          color: #1272d1;
        }
      }
      .version {
        margin-top: 5px;
      }
    }
    button {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  .footer {
    width: 100%;
    height: 60px;
    padding: 0px;
    background-color: #fbfbfb;
    overflow-y: hidden;
    overflow-x: auto;
    .tag {
      margin-left: 10px;
      line-height: 60px;
      display: inline-block;
    }
  }
}
</style>
