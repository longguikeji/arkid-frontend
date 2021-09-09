<template>
  <el-descriptions
    :title="state.title"
    :column="state.column"
    :size="state.size"
    border
  >
    <template
      v-if="state.extra"
      slot="extra"
    >
      <ButtonArray :path="getChildPath('extra.buttons')" />
    </template>
    <template v-if="items">
      <el-descriptions-item
        v-for="(key, index) in keys"
        :key="index"
        :label="items[key].label"
      >
        {{ items[key].value }}
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import DescriptionsState from './DescriptionsState'
import DescriptionsItem from './DescriptionsItem/index.vue'

@Component({
  name: 'Descriptions',
  components: {
    DescriptionsItem
  }
})
export default class Descriptions extends Mixins(BaseVue) {
  get state(): DescriptionsState {
    return this.$state as DescriptionsState
  }

  get items() {
    return this.state.items
  }

  get keys() {
    const keys = []
    let isuuid = false
    Object.keys(this.state.items).forEach(key => {
      if (key !== 'uuid') {
        keys.push(key)
      } else {
        isuuid = true
      }
    })
    if (isuuid) keys.push('uuid')
    return keys
  }
}
</script>
