<template>
  <div class="card-panel">
    <img :src="logo">
    <div class="card-panel-text">
      <div class="name">
        {{ state.name }}
      </div>
      <div class="description">
        {{ state.description }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CardPanelState from './CardPanelState'
import BaseVue from '@/admin/base/BaseVue'

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
    cursor: move;
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
      font-weight: 400;
      color: #909399;
    }
  }
}
</style>
