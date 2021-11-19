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
        <el-tooltip
          effect="dark"
          :content="state.name"
          placement="top"
        >
          <a
            class="name"
            :href="state.homepage"
            target="_blank"
          >{{ state.name }}</a>
        </el-tooltip>
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
      <div
        v-if="state.buttons"
        class="buttons"
      >
        <ButtonArray :path="getChildPath('buttons')" />
      </div>
    </div>
    <div class="footer">
      <span>
        类型 :
        <el-tag>{{ state.scope }}</el-tag>
      </span>
      <span>
        标签  :
        <el-tag
          v-for="(item, index) in tags"
          :key="index"
        >{{ item }}</el-tag>
      </span>
      <span>
        状态 :
        <el-tag>{{ status }}</el-tag>
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

  get status() {
    return this.state.installed === '已安装' ? this.state.enalbed : this.state.installed
  }

  get tags() {
    const tags = this.state.tags
    return typeof tags === 'string' ? [tags] : tags
  }
}
</script>

<style lang="scss" scoped>
.extension-panel {
  width: 500px !important;
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
      width: 260px;
      height: 100%;
      vertical-align: middle;
      margin-left: 10px;
      display: inline-block;
      font-weight: normal;
      overflow: hidden;
      text-overflow: ellipsis;
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
      .maintainer, .version, .status {
        font-size: 15px;
        font-style: italic;
        .text {
          color: #1272d1;
        }
      }
      .maintainer {
        display: block;
      }
      .version {
        margin-top: 5px;
      }
    }
    .buttons {
      position: absolute;
      right: 5px;
      top: 0px;
      ::v-deep .el-button {
        display: block;
        margin: 5px 0 0 0;
      }
    }
  }

  .footer {
    width: 100%;
    height: 60px;
    padding: 0px;
    background-color: #fbfbfb;
    overflow-y: hidden;
    overflow-x: auto;
    line-height: 60px;
    padding-left: 10px;
    font-weight: bold;
  }
}
</style>
