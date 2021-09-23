<template>
  <div class="table-page">
    <Card
      :path="getChildPath('card')"
      :class="[{'table-list-page': !!state.list}]"
    >
      <Form
        v-if="state.filter"
        :path="getChildPath('filter')"
        class="table-page-filter"
      />
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
    <List
      v-if="state.list"
      :path="getChildPath('list')"
      class="table-page-list"
    />
  </div>
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
}
</script>

<style lang="scss" scoped>
.table-page {
  height: calc(100vh - 130px);
  box-sizing: border-box;
  overflow: hidden;
  .el-card {
    height: calc(100vh - 130px);
  }
  .table-page-filter {
    padding: 10px;
  }
  ::v-deep .el-card__body {
    position: relative;
    .el-pagination {
      margin: 10px;
      bottom: 50px;
      box-sizing: border-box;
    }
    .el-dialog.is-fullscreen {
      min-height: 100% !important;
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

.table-list-page {
  display: inline-block;
  width: 70%;
}
.table-page-list {
  width: 30%;
  display: inline-block;
  vertical-align: top;
  min-height: 300px;
}
</style>
