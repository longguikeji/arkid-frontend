<template>
  <el-calendar
    v-model="state.value"
    :range="state.range"
    :first-day-of-week="state.firstDayOfWeek"
  />
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import CalendarState from './CalendarState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Calendar'
})
export default class extends Mixins(BaseVue) {
  get state(): CalendarState {
    return this.$state as CalendarState
  }
}
</script>
<style lang="scss" scoped></style>
