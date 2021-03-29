<template>
  <el-page-header
    :title="state.title"
    :content="state.content"
    @back="goBack"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import PageHeaderState from './PageHeaderState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'PageHeader',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): PageHeaderState {
    return this.$state as PageHeaderState
  }

  goBack() {
    // console.log('go back')
  }
}
</script>

<style lang="scss" scoped>
</style>
