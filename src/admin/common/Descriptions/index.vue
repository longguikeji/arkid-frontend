<template>
  <el-descriptions
    :title="state.title"
    :column="2"
    :size="state.size"
    :direction="state.direction"
    border
    content-class-name="descriptions-item-container"
  >
    <template
      v-if="state.buttons"
      slot="extra"
    >
      <ButtonArray :path="getChildPath('buttons')" />
    </template>
    <template v-if="items">
      <el-descriptions-item
        v-for="(key, index) in keys"
        :key="index"
        :label="items[key].label"
      >
        <template v-if="items[key].items">
          <Descriptions :path="getChildPath(`items.${key}`)" />
        </template>
        <span v-else>{{ items[key].value }}</span>
      </el-descriptions-item>
    </template>
  </el-descriptions>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BaseVue from '@/admin/base/BaseVue'
import DescriptionsState, { DescriptionsItemState } from './DescriptionsState'
// import { hideMobile, hideEmail } from '@/utils/rules'

@Component({
  name: 'Descriptions'
})
export default class Descriptions extends Mixins(BaseVue) {
  get state(): DescriptionsState {
    return this.$state as DescriptionsState
  }

  get items() {
    return this.state.items
  }

  get keys() {
    const keys: string[] = []
    let isuuid = false
    Object.keys(this.state.items).forEach((key) => {
      if (key !== 'uuid') {
        keys.push(key)
      } else {
        isuuid = true
      }
    })
    if (isuuid) keys.push('uuid')
    return keys
  }

  // getItemValue(item: DescriptionsItemState, key: string) {
  //   const value = item.value
  //   if (!value) return undefined
  //   if (key.includes('mobile')) {
  //     return hideMobile(value)
  //   } else if (key.includes('email')) {
  //     return hideEmail(value)
  //   }
  //   return value
  // }
}
</script>

<style lang="scss" scoped>
::v-deep .el-descriptions-item__cell {
  height: 42px;
}

::v-deep .el-descriptions--medium.is-bordered .el-descriptions-item__cell {
  max-width: 500px;
  overflow: hidden;
}
</style>
