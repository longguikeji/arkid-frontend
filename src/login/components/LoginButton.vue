<template>
  <div class="font-gray">
    <template
      v-if="config.prepend"
    >
      {{ config.prepend }}
    </template>
    <el-tooltip
      :disabled="!config.tooltip"
      :content="config.tooltip"
      placement="top"
    >
      <el-button
        :type="type"
        :disabled="disabled"
        :class="btnClass"
        @click="clickHandler"
      >
        <img
          v-if="config.img"
          class="btn-img"
          :src="config.img"
        >
        {{ label }}
      </el-button>
    </el-tooltip>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { ButtonConfig } from '../interface'

@Component({
  name: 'LoginButton'
})
export default class LoginButton extends Vue {
  @Prop({ required: false, default: 'primary' }) type?:string
  @Prop({ required: true }) config?:ButtonConfig
  @Prop({ default: false }) long?:boolean
  @Prop() action?:Function

  get label() {
    const _label = (this.config?.label || '') + (this.delayData ? '(' + this.delayData + ')' : '')
    return _label
  }

  delayData = 0

  get disabled():boolean {
    return Boolean(this.delayData)
  }

  async clickHandler() {
    const btn = this.config || {}
    this.delayData = Number(btn.delay)
    if (this.action) this.action(btn)
  }

  @Watch('delayData')
  delayHandler() {
    if (this.delayData > 0) {
      setTimeout(this.delayCountDown, 1000)
    } else {
      this.delayData = 0
    }
  }

  delayCountDown() {
    if (this.delayData > 0) {
      this.delayData -= 1
    }
  }

  get btnClass() {
    if (this.long) return 'button-long'
  }
}
</script>
<style lang="scss" scoped>
.btn-img {
  width: 32px;
  height: 32px;
  margin: 0px 3px;
}
.font-gray {
  color: gray;
}
.button-long {
  width: 100%;
}
</style>
