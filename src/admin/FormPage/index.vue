<template>
  <div>
    <Descriptions
      v-if="state.descriptions"
      :path="getChildPath('descriptions')"
    />
    <Card
      v-else
      class="form-page"
      :path="getChildPath('card')"
    >
      <template v-if="state.select">
        <b>{{ state.select.valueKey }}</b>
        <Select
          class="form-page-select"
          :path="getChildPath('select')"
        />
      </template>
      <Form :path="formPath" />
      <template v-if="state.buttons">
        <ButtonArray
          :path="getChildPath('buttons')"
          class="form-page-buttons"
        />
      </template>
    </Card>
    <template v-if="state.dialogs">
      <Dialog
        v-for="dialogName in Object.keys(state.dialogs)"
        :key="dialogName"
        :path="getChildPath('dialogs.' + dialogName)"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import { FormPage } from './FormPageState'
import Card from '@/admin/common/Card/index.vue'
import Form from '@/admin/common/Form/index.vue'
import BaseVue from '@/admin/base/BaseVue'
import Dialog from '@/admin/common/Others/Dialog/index.vue'
import ButtonArray from '@/admin/common/Button/ButtonArray/index.vue'

@Component({
  name: 'FormPage',
  components: {
    Form,
    Card,
    Dialog,
    ButtonArray
  }
})
export default class extends Mixins(BaseVue) {
  get state(): FormPage {
    return this.$state as FormPage
  }

  get formPath():string {
    if (this.state.select) {
      return this.getChildPath('forms.' + this.state.select.value)
    } else {
      const items = this.state.form?.items
      if (items) {
        const keys = Object.keys(items)
        if (keys.length === 1 && items[keys[0]].type === 'FormObjectItem') {
          return this.getChildPath(`form.items.${keys[0]}.state`)
        }
      }
      return this.getChildPath('form')
    }
  }
}
</script>
<style lang="scss" scoped>
.form-page {
  height: auto;
  .el-card {
    height: 100% !important;
  }
}
.el-dialog__body {
  .form-page {
    height: auto;
  }
}
::v-deep .tox .tox-menubar {
  width: 1000px;
}
::v-deep .tui-editor-defaultUI { width: 1000px;}
.form-page-buttons {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 20px;
}
.el-dialog {
  .form-page-buttons {
    justify-content: center;
  }
}
.form-page-select {
  display: inline-block;
  margin-left: 20px;
}
</style>
