<template>
  <el-dialog
    :visible="show"
    title="隐私声明"
  >
    <span
      class="content"
      v-html="content"
    />
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="cancel">取消</el-button>
      <el-button
        type="primary"
        @click="argee"
      >同意</el-button>
    </span>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { ButtonConfig } from '../interface'

@Component({
  name: 'Privacy'
})
export default class Privacy extends Vue {
  @Prop({ required: true }) show = false
  @Prop({ required: true }) content = ''

  private cancel() {
    this.show = false
    this.$emit('cancel')
  }

  private argee() {
    this.show = false
    this.$emit('argee')
  }
}
</script>
