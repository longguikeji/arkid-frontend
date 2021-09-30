<template>
  <div
    class="card-panel"
    :style="{'--color': state.color}"
  >
    <img
      class="icon-img no-drag"
      :src="logo"
    >
    <div class="card-panel-text no-drag">
      <div class="main-text">
        {{ state.name }}
      </div>
      <div class="sub-text">
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
  display: flex;
  flex-direction: row;
  align-items: center;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 10px 10px 40px rgba(0, 0, 0, 0.05);
  border-color: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  color: #666;
  position: relative;
  overflow: hidden;
  padding-left: 24px;
  &:hover {
    background: var(--color);
  }
  .icon-img {
    cursor: pointer;
    width: 40px;
    vertical-align: middle;
    height: 40px;
    border-radius: 20px;
  }
  .card-panel-text {
    cursor: pointer;
    vertical-align: middle;
    font-size: 12px;
    font-family: PingFang SC;
    line-height: 22px;
    margin-left: 12px;
    .main-text {
      font-weight: bold;
      color: #333333;
    }
    .sub-text {
      font-weight: 400;
      color: #909399;
    }
  }
}
</style>
