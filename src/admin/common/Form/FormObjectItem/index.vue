<template>
  <el-card class="card">
    <Form :path="getChildPath('')" />
  </el-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Form from '@/admin/common/Form/index.vue'
import BaseVue from '@/admin/base/BaseVue'
import FormObjectItemState from './FormObjectItemState'

@Component({
  name: 'FormObjectItem',
  components: {
    Form
  }
})
export default class extends Mixins(BaseVue) {
  get state(): FormObjectItemState {
    return this.$state as FormObjectItemState
  }
}
</script>

<style lang="scss" scoped>
.card {
  display: inline-block;
  width: 100%;
}
</style>
