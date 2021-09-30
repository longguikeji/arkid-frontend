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
      <template v-if="state.dialogs">
        <Dialog
          v-for="dialogName in Object.keys(state.dialogs)"
          :key="dialogName"
          :path="getChildPath('dialogs.' + dialogName)"
        />
      </template>
    </Card>
    <Pagination
      v-if="state.pagination"
      :path="getChildPath('pagination')"
      :class="[{'table-list-pagination': !!state.list}]"
    />
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
  .table-list-page,
  .table-list-pagination {
    display: inline-block;
    width: 70%;
  }
  .table-page-list {
    width: 30%;
    display: inline-block;
    vertical-align: top;
    min-height: 300px;
    position: absolute;
    top: 0px;
  }
}
.table-page {
  .el-card {
    border-bottom: 0px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }
  .el-pagination {
    background: white;
    border: 1px solid #e6ebf5;
    border-top: 0px;
    padding: 5px 5px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    box-sizing: border-box;
  }
}
</style>
