<template>
  <el-image
    style="width: 50px; height: 50px"
    :src="state.value"
    :fit="state.fit"
    :alt="state.alt"
    :referrer-policy="state.referrerPolicy"
    :lazy="state.lazy"
    :scroll-container="state.scrollContainer"
    :preview-src-list="state.previewSrcList"
    :z-index="state.zIndex"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ImageState from './ImageState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'ImageBox'
})
export default class extends Mixins(BaseVue) {
  get state(): ImageState {
    return this.$state as ImageState
  }
}
</script>
<style lang="scss" scoped></style>
