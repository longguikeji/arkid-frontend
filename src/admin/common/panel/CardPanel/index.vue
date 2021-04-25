<template>
  <div
    class="card-panel"
    :style="{'--color': state.color}"
  >
    <div
      class="card-panel-icon"
      @click="clickHandler"
    >
      <img
        v-if="state.img"
        class="icon-img"
        :src="state.img"
      >
      <span v-else>Logo</span>
    </div>
    <div
      class="card-panel-text"
      @click="clickHandler"
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

  private clickHandler() {
    if (this.state.url) {
      window.open(this.state.url, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.card-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: #fff;
  box-shadow: 10px 10px 40px rgba(0, 0, 0, .05);
  border-color: rgba(0, 0, 0, .05);
  font-size: 12px;
  color: #666;
  position: relative;
  text-align: center;
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
    font-size: 16px;
    margin-top: 10px;
  }
}
</style>
