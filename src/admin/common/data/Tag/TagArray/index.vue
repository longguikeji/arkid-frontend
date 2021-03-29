<template>
  <span>
    <span
      v-for="(tag, index) in dynamicTags"
      :key="index"
      class="tag-box"
    >
      <el-tag
        :type="tag.type"
        :closable="tag.closable"
        :disable-transitions="tag.disableTransitions"
        :hit="tag.hit"
        :color="tag.color"
        :size="tag.size"
        :effect="tag.effect"
        class="tag-item"
        @close="handleClose(tag)"
      >
        {{ tag.value }}
      </el-tag>
      <span v-if="tag.newTagType">
        <el-input
          v-if="visibleFlags[index]"
          :id="'saveTagInput' + index"
          :ref="'saveTagInput' + index"
          v-model="inputValue"
          :size="dynamicTags[index].size"
          class="new-tag-input"
          @keyup.enter.native="handleInputConfirm(tag, index)"
        />
        <el-button
          v-else
          :id="'saveTagButton' + index"
          :ref="'saveTagButton' + index"
          :size="dynamicTags[index].size"
          class="new-tag-button"
          @click="showInput(index)"
        >+ New Tag</el-button>
      </span>
    </span>
  </span>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import TagState from './../TagState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'TagArray',
  components: {}
})
export default class extends Mixins(BaseVue) {
  get state(): Array<TagState> {
    return this.$state as Array<TagState>
  }

  private inputValue = '';
  private dynamicTags: Array<TagState> = this.state;
  private visibleFlags: any = {};

  handleClose(tag: any) {
    if (this.dynamicTags.length > 0) {
      const deleteIndex = this.dynamicTags.indexOf(tag)
      if (deleteIndex !== 0) {
        if (this.dynamicTags[deleteIndex].newTagType) {
          this.dynamicTags[deleteIndex - 1].newTagType = this.dynamicTags[
            deleteIndex
          ].newTagType
        }
      }
      this.dynamicTags.splice(deleteIndex, 1)
    }
  }

  showInput(index: number) {
    this.visibleFlags[index] = true
    this.$forceUpdate()
    this.$nextTick((): void => {
      const refItem = 'saveTagInput' + index
      const inputNewTag: any = this.$refs[refItem]
      inputNewTag[0].focus()
    })
  }

  handleInputConfirm(tag: any, inpIndex: number) {
    const refItem = 'saveTagInput' + inpIndex
    const inputElement: any = document.getElementById(refItem)
    const inputContent = inputElement.value
    if (inputContent.trim() !== '') {
      const addIndex = this.dynamicTags.indexOf(tag)
      const dynamicTagItem = JSON.parse(
        JSON.stringify(this.dynamicTags[addIndex])
      )
      dynamicTagItem.value = inputContent
      dynamicTagItem.type = this.dynamicTags[addIndex].newTagType
      delete this.dynamicTags[addIndex].newTagType
      this.dynamicTags.splice(addIndex + 1, 0, dynamicTagItem)
    }
    this.visibleFlags[inpIndex] = false
    this.inputValue = ''
  }
}
</script>

<style lang="scss" scoped>
.tag-item {
  margin-left: 5px;
}
.new-tag-input {
  display: inline-block;
  width: 90px;
  margin-left: 5px;
  height: 28px;
  vertical-align: bottom;
  ::v-deep .el-input__inner {
    height: 100% !important;
  }
}
.new-tag-button {
  display: inline-block;
  margin-left: 5px;
  padding: 5px;
  vertical-align: bottom;
}
</style>
