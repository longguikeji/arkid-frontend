<template>
  <el-carousel
    :height="state.height"
    :initial-index="state.initialIndex"
    :trigger="state.trigger"
    :autoplay="state.autoplay"
    :interval="state.interval"
    :indicator-position="state.indicatorPosition"
    :arrow="state.arrow"
    :type="state.type"
    :loop="state.loop"
    :direction="state.direction"
  >
    <el-carousel-item
      v-for="(item, index) in state.data"
      :key="index"
    >
      <el-image
        :src="item.url"
        :style="{height: state.height, width: state.width}"
        fit="cover"
      />
    </el-carousel-item>
  </el-carousel>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CarouselState from './CarouselState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Carousel'
})
export default class extends Mixins(BaseVue) {
  get state(): CarouselState {
    return this.$state as CarouselState
  }
}
</script>
<style lang="scss" scoped></style>
