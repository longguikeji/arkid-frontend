<template>
  <div class="lg-config-page">
    <div class="lgui-toolbar">
      <Button type="primary" @click="showEdit">修改配置</Button>
      <Button type="primary" @click="doImportDing"
       :loading="isImporting" :disabled="importDingDisabled">同步钉钉账号</Button>
    </div>
    <div class="lg-config-page--content">
      <div
        v-for="[title, obj] in [['公司配置', config.org], ['钉钉配置', config.ding]]"
        :key="title"
        class="config-block"
      >
        <h4 class="title">{{ title }}</h4>
        <div class="config-list" v-for="[key, val] in Object.entries(obj)" :key="key">
          <span class="key">{{ key }}: </span>
          <span class="val">{{ val }}</span>
        </div>
      </div>
    </div>

    <Drawer
      title="修改配置"
      placement="right"
      :closable="false"
      :maskClosable="false"
      :width="50"
      v-model="showEditDrawer"
    >
      <Form
        v-if="form"
        :model="form"
        style="width: 300px"
      >
        <FormItem
          v-for="item in formFields"
          :key="item.key"
          :prop="item.key"
          :label="item.label"
        >
          <Input type="text" v-model="form[item.prefix][item.key]"/>
        </FormItem>

        <Button type="primary" @click="doSave" :loading="isSaving">保存</Button>
        <Button type="text" @click="doCancel">取消</Button>
      </Form>
    </Drawer>
  </div>
</template>

<script>
  import {cloneDeep} from 'lodash';
  import * as api from '@/services/config';

  export default {
    data() {
      return {
        config: {
          ding: {},
          org: {},
        },

        form: null,
        showEditDrawer: false,
        isSaving: false,

        formFields: [
          {prefix: 'org', key: 'address', label: '地址'},
          {prefix: 'org', key: 'domain', label: 'domain'},
          {prefix: 'org', key: 'fullNameCn', label: '中文全名'},
          {prefix: 'org', key: 'fullNameEn', label: '英文全名'},
          {prefix: 'org', key: 'icon', label: '图标'},
          {prefix: 'org', key: 'nameCn', label: '中文名'},
          {prefix: 'org', key: 'nameEn', label: '英文名'},
          {prefix: 'ding', key: 'appKey', label: 'appKey'},
          {prefix: 'ding', key: 'appSecret', label: 'appSecret'},
          {prefix: 'ding', key: 'corpId', label: 'corpId'},
          {prefix: 'ding', key: 'corpSecret', label: 'corpSecret'},
        ],

        isImporting: false,
        taskId: null,
        interval: null,
      };
    },

    computed: {
      viewMeta() {
        return {
          breadcrumb: ['配置管理'],
        };
      },
      importDingDisabled() {
        return !this.config || !this.config.ding.appValid;
      },
    },

    mounted() {
      this.loadData();
    },

    beforeDestroy() {
      window.clearInterval(this.interval);
      this.interval = null;
    },

    methods: {
      async loadData() {
        this.config = await api.Config.retrieve();
      },

      showEdit() {
        this.form = cloneDeep(this.config);
        this.showEditDrawer = true;
      },

      doSave() {
        this.edit();
        this.form = null;
        this.showEditDrawer = false;
      },

      async edit() {
        try {
          this.config = await api.Config.partialUpdate(this.form);
          this.$Message.success('修改成功');
        } catch (e) {
          console.log(e);
          this.$Message.error('修改失败');
        }
      },

      doCancel() {
        this.showEditDrawer = false;
      },

      async importDing() {
        try {
          const {task_id: taskId} = await api.Config.importDing();
          this.taskId = taskId;
          this.pollImportResult();
          this.$Message.success('开始同步');
        } catch (e) {
          console.log(e);
          this.isImporting = true;
          this.$Message.error('同步失败');
        }
      },

      doImportDing() {
        this.isImporting = true;
        this.importDing();
      },

      pollImportResult() {
        this.interval = setInterval(this.importResult, 2000);
      },

      async importResult() {
        try {
          const {status} = await api.Config.importResult(this.taskId);
          this.onImportResult(status);
        } catch (e) {
          console.log('polling');
        }
      },

      onImportResult(status) {
        if (status === 1 || status === 2) return;

        window.clearInterval(this.interval);
        this.interval = null;
        this.isImporting = false;

        if (status === 3) {
          this.$Message.error('同步失败');
        }
        if (status === 4) {
          this.$Message.success('同步成功');
        }
      },
    },
  };
</script>

<style lang="less">
  .lg-config-page {
    &--content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .config-block {
        display: flex;
        flex: 0 1 auto;
        width: 30%;
        flex-direction: column;
        &:last-child {
          margin-top: 24px;
        }

        .title {
          display: flex;
        }

        .config-list {
          display: flex;
          justify-content: space-between;

          .key,
          .val {
            display: flex;
            flex: 0 0 auto;
          }
        }
      }
    }
  }
</style>
