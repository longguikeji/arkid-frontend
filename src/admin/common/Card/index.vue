<template>
  <el-card :shadow="state.shadow || 'never'">
    <div
      v-if="state.title || state.buttons || state.showHeader"
      slot="header"
      class="card-header"
    >
      <span class="title">{{ state.title }}</span>
      <slot name="header" />
      <ButtonArray
        class="buttons"
        :path="getChildPath('buttons')"
      />
    </div>
    <slot />
  </el-card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import ButtonArray from '@/admin/common/Button/ButtonArray/index.vue'
import BaseVue from '@/admin/base/BaseVue'
import CardState from './CardState'

@Component({
  name: 'Card',
  components: {
    ButtonArray
  }
})
export default class extends Mixins(BaseVue) {
  get state(): CardState {
    return this.$state as CardState
  }
}
</script>

<style lang="scss" scoped>
.card-header {
  position: relative;
}
.buttons {
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
}
.title {
  margin-right: 12px;
  font-weight: 700;
}
</style>
