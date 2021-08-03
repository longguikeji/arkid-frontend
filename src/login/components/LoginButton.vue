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
  @Prop({ required: true, default: {} }) config?:ButtonConfig
  @Prop({ default: false }) long?:boolean
  @Prop() action?:Function
  @Prop({ required: false, default: false }) isChangeDelay?: boolean

  private delayData = 0

  get label() {
    const _label = (this.config?.label || '') + (this.delayData ? '(' + this.delayData + ')' : '')
    return _label
  }

  get disabled():boolean {
    return Boolean(this.delayData)
  }

  @Watch('isChangeDelay')
  changeDelay(val) {
    if (val) {
      this.delayData = Number(this.config?.delay || 0)
      this.delayHandler()
    } else {
      this.delayData = 0
    }
  }

  @Watch('delayData')
  onDelayDataChange() {
    this.delayHandler()
  }

  async clickHandler() {
    if (this.action) this.action(this.config)
  }

  delayHandler() {
    if (this.delayData > 0) {
      setTimeout(this.delayCountDown, 1000)
    } else {
      this.delayData = 0
    }
  }

  delayCountDown() {
    console.log('')
    this.delayData -= 1
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
