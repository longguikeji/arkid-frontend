<template>
  <div
    class="card-panel"
    :style="{'--color': state.color}"
  >
    <div
      class="card-panel-icon no-drag"
    >
      <img
        v-if="state.img"
        class="icon-img no-drag"
        :src="state.img"
      >
      <span
        v-else
        class="no-drag"
      >Logo</span>
    </div>
    <div
      class="card-panel-text no-drag"
    >
      {{ state.name }}
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
  get state(): CardPanelState {
    return this.$state as CardPanelState
  }
}
</script>

<style lang="scss" scoped>
.card-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 10px 10px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);
  font-size: 12px;
  color: #666;
  position: relative;
  text-align: center;
  padding-top: 15px;
  overflow: hidden;
  &:hover {
    background: var(--color);
  }
  .card-panel-icon {
    cursor: pointer;
    width: 60px;
    height: 60px;
    border-radius: 30px;
    background-color: #006064;
    color: #FFF;
    font-weight: bold;
    line-height: 60px;
    .icon-img {
      width: 100%;
      height: 100%;
    }
  }
  .card-panel-text {
    cursor: pointer;
    font-size: 15px;
    font-weight: 500;
    padding: 15px 5px 0px 5px;
  }
}
</style>
