<template>
  <el-amap
    :center="state.value"
    :zoom="zoom"
    class="amap"
  >
    <el-amap-marker
      ref="marker"
      :position="state.value"
      :draggable="true"
      :events="events"
    />
  </el-amap>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import AMapState from './AMapState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'AMap',
  components: {
  }
})
export default class extends Mixins(BaseVue) {
  get state(): AMapState {
    return this.$state as AMapState
  }

  zoom = 15
  events: object = {
    dragend: () => {
      const elMap: any = this.$refs.marker
      this.state.value = elMap.$$getPosition()
    }
  }
}
</script>

<style lang="scss" scoped>
.amap {
  height: 300px;
  width: 400px;
}
</style>
