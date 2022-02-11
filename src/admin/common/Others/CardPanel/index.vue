<template>
  <div class="card-panel">
    <img
      :src="logo"
      @click="handleClick"
    >
    <div
      class="card-panel-text"
      @click="handleClick"
    >
      <div class="name">
        {{ state.name }}
      </div>
      <div
        v-if="state.description"
        class="description"
      >
        {{ state.description }}
      </div>
      <div
        v-if="state.tags"
        class="tags"
      >
        <span
          v-for="(tag, index) in state.tags"
          :key="index"
        >
          <span>{{ tag.label }}</span> :
          <el-tag size="mini">{{ tag.value }}</el-tag>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CardPanelState from './CardPanelState'
import BaseVue from '@/admin/base/BaseVue'
import { getToken } from '@/utils/auth'

@Component({
  name: 'CardPanel',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get logo() {
    return this.state.logo || require('@/assets/app.png')
  }

  get state(): CardPanelState {
    return this.$state as CardPanelState
  }

  get token() {
    return getToken()
  }

  handleClick() {
    let { action, url, type, uuid } = this.state
    if (action) {
      this.runAction(action)
    } else if (url) {
      if (this.token) url = url.replace(/\{token\}/g, this.token)
      if (type === 'auto_form_fill' && uuid) {
        const prefix = url.includes('?') ? '&' : '?'
        url = `${url}${prefix}app_uuid=${uuid}`
      }
      window.open(url, '_blank')
    } else {
      this.$message({
        message: '该应用未设置相关点击操作',
        type: 'info',
        showClose: true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.card-panel {
  width: 307px;
  height: 100px;
  position: relative;
  border: 1px solid #ebeef5;
  position: relative;
  padding-left: 24px;
  box-sizing: border-box;
  margin-top: 12px;
  margin-left: 12px;

  &:hover {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
  }

  img {
    width: 40px;
    height: 40px;
    border-radius: 20px;
    cursor: pointer;
    vertical-align: middle;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .card-panel-text {
    position: absolute;
    cursor: pointer;
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 22px;
    margin-left: 52px;
    top: 50%;
    transform: translateY(-50%);
    .name {
      font-weight: bold;
      color: #333333;
    }
    .description {
      width: 220px;
      font-weight: 400;
      color: #909399;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
    .tags {
      display: flex;
    }
  }
}
</style>
