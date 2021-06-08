<template>
  <Card
    :path="getChildPath('card')"
    class="table-page"
  >
    <div>
      <Form
        :path="filterPath"
        class="table-page-filter"
      />
    </div>
    <template v-if="state.list.data">
      <Card
        :path="getChildPath('list.header')"
        class="tablepage__list"
      >
        <List :path="getChildPath('list.data')" />
      </Card>
    </template>
    <Table :path="getChildPath('table')" />
    <Pagination
      v-if="state.pagination"
      :path="getChildPath('pagination')"
    />
    <template v-if="state.dialogs">
      <Dialog
        v-for="dialogName in Object.keys(state.dialogs)"
        :key="dialogName"
        :path="getChildPath('dialogs.' + dialogName)"
      />
    </template>
  </Card>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import Card from '@/admin/common/Card/index.vue'
import Table from '@/admin/common/data/Table/index.vue'
import Button from '@/admin/common/Button/index.vue'
import Form from '@/admin/common/Form/index.vue'
import Pagination from '@/admin/common/data/Pagination/index.vue'
import Dialog from '@/admin/common/Others/Dialog/index.vue'
import { TablePage } from './TablePageState'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'TablePage',
  components: {
    Form,
    Card,
    Button,
    Table,
    Pagination,
    Dialog
  }
})
export default class extends Mixins(BaseVue) {
  get state(): TablePage {
    return this.$state as TablePage
  }

  get filterPath(): string {
    if (this.state.filter?.items) {
      this.state.filter.inline = true
      return this.getChildPath('filter')
    } else {
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
.table-page {
  height: 100%;
  min-height: calc(100vh - 84px);
  ::v-deep  .el-card__body {
    padding: 10px;
    height: 100% !important;
    .el-table {
      height: 90% !important;
    }
    .el-pagination {
      margin-top: 10px;
    }
    .el-dialog.is-fullscreen {
      min-height: 100% !important;
    }
    .el-table__body-wrapper {
      height: auto !important;
      overflow: auto;
      min-height: 77vh !important;
    }
  }
}
.el-dialog {
  .table-page {
    height: auto !important;
    min-height: 100% !important;
    position: relative;
    ::v-deep .el-card__body {
      .el-table__body-wrapper {
        height: auto !important;
        min-height: auto !important;
      }
      .el-pagination {
        bottom: 10px;
      }
    }
  }
}
</style>
