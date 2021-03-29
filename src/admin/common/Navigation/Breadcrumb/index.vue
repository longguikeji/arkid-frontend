<template>
  <el-breadcrumb
    :separator-class="state.separatorClass"
    :separator="state.separator"
  >
    <el-breadcrumb-item
      v-for="(item, index) in state.items"
      :key="index"
      :to="item.to"
      :replace="item.replace"
    >
      {{ item.text }}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BreadcrumbState from './BreadcrumbState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Breadcrumb',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): BreadcrumbState {
    return this.$state as BreadcrumbState
  }
}
</script>

<style lang="scss" scoped>
</style>
