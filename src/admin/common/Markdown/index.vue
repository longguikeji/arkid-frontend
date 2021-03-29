<template>
  <div class="editor-container">
    <mavon-editor
      ref="markdownEditor"
      v-model="state.value"
      height="500px"
      style="width: 900px"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import MarkdownState from './MarkdownState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Markdown',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): MarkdownState {
    return this.$state as MarkdownState
  }

  mounted() {
    window.scrollTo(0, 0)
  }
}
</script>
<style lang="scss" scoped>

</style>
