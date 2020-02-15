<template>
  <div> 
    <h3>应用管理</h3>
    <div class="lgui-toolbar">
      <Button type="primary" @click="doAdd">添加应用</Button>
    </div>

    <DdTable2 ref="grid"
      :gridOptions="gridOptions" :columnDefs="columnDefs"
      :pagination="gridPagination"></DdTable2>
    
    <Drawer title="应用" placement="right" :closable="false" :maskClosable="false" v-model="showDrawer" :width="50">
      <Form v-if="showDrawer" :model="form" style="width: 300px;">
        <FormItem prop="name" label="名称">
          <Input type="text" v-model="form.name" placeholder="请输入 名称..."></Input>
        </FormItem>
        <FormItem prop="remark" label="备注">
          <Input type="text" v-model="form.remark" placeholder="请输入 备注..."></Input>
        </FormItem>
        <Divider />
        <h4>OAuth</h4>
        <p v-if="form.clientId">
          <span>client_id: {{ form.clientId}}</span>
          <br />
          <br />
          <span>client_secret: {{ form.clientSecret}}</span>
        </p>
        <FormItem prop="clientType" label="client_type">
          <Select v-model="form.clientType" @on-change="onOAuthClientTypeChange">
            <Option v-for="item in clientTypes" :key="item" :value="item">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="grantType" label="authorization_grant_type">
          <Select v-model="form.grantType" @on-change="onOAuthGrantTypeChange">
            <Option v-for="item in grantTypes" :key="item" :value="item">{{ item }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="redirectUris" label="redirect_uris" style="width: 600px;">
          <Input type="textarea" :autosize="true" v-model="form.redirectUris" placeholder="请输入 redirect_uris..."></Input>
        </FormItem>
        <Button type="error" @click="remove" v-show="!isNew">删除</Button>
        <Button type="primary" @click="doSave" :loading="isSaving">{{ isNew ? '添加' : '保存' }}</Button>
        <Button type="text" @click="doCancel">取消</Button>
      </Form>
    </Drawer>
  </div>
</template>

<script>
  import * as api from '../services/oneid';

  export default {
    data() {
      const vm = this;

      const clientTypes = ['confidential', 'public'];
      const grantTypes = ['authorization-code', 'implicit', 'password', 'client'];

      return {
        gridOptions: {
          getDataFn: opt => api.App.list().then(x => ({
            meta: {count: x.count},
            data: x.results,
          })),
        },
        gridPagination: {
          pageSize: 200,
        },

        columnDefs: [
          {
            headerName: '应用名称',
            field: 'name',
            width: 120,
          },

          {
            headerName: '备注',
            width: 100,
            field: 'remark',
          },

          {
            headerName: '状态',
            field: 'status',
            width: 100,
          },

          {
            headerName: '操作',
            width: 100,
            field: 'app_id',
            cellRendererFramework: 'Action',
            cellRendererParams: {
              actions: [{
                doAction: ({params: {data}}) => {
                  const {uid, name, remark, oauth_app} = data;

                  const {
                    redirect_uris: redirectUris,
                    client_type: clientType,
                    authorization_grant_type: grantType,
                    client_id: clientId,
                    client_secret: clientSecret,
                  } = oauth_app ? oauth_app : {};

                  vm.form = {
                    ...data,
                    redirectUris,
                    clientType,
                    grantType,
                    clientId,
                    clientSecret,
                  };
                },
                label: '编辑',
                type: 'text',
              }],
            },
          },
        ],

        form: null,
        isSaving: false,

        clientTypes,
        grantTypes,
      };
    },

    computed: {
      showDrawer() {
        return !!this.form;
      },

      isNew() {
        return this.form && !this.form.uid;
      },
    },

    created() {
      // this.form = {redirectUris: null, clientType: null, grantType: null};
    },

    methods: {
      async create() {
        const {
          name,
          remark,
          redirectUris,
          clientType,
          grantType,
        } = this.form;
        try {
          await api.App.create(await this.$app.org(),
          {
            name,
            remark,
            oauth_app: {
              redirect_uris: redirectUris,
              client_type: clientType,
              authorization_grant_type: grantType,
            },
          });
          this.$Message.success('创建成功');
        } catch(err) {
          console.log(err);
          this.$Message.error('创建失败');
          return;
        }
        this.$refs.grid.refresh();
      },

      async edit() {
        const {
          uid: id,
          name,
          remark,
          redirectUris,
          clientType,
          grantType,
        } = this.form;
        try {
          await api.App.partialUpdate(await this.$app.org(), id, {
            name,
            remark,
            oauth_app: {
              redirect_uris: redirectUris,
              client_type: clientType,
              authorization_grant_type: grantType,
            },
          });
          this.$Message.success('保存成功');
        } catch(err) {
          console.log(err);
          this.$Message.error('保存失败');
          return;
        }
        this.$refs.grid.refresh();
      },

      async remove() {
        const {uid: id} = this.form;
        try {
          await api.App.remove(await this.$app.org(), id);
          this.$Message.success('删除成功');
        } catch(err) {
          console.log(err);
          this.$Message.error('删除失败');
          return;
        }
        this.form = null;
        this.$refs.grid.refresh();
      },

      doAdd() {
        this.form = {
          redirectUris: null,
          clientType: 'confidential',
          grantType: 'authorization-code',
        };
      },

      doSave() {
        if (this.isNew) {
          this.create();
        } else {
          this.edit();
        }
        this.form = null;
      },

      doCancel() {
        this.form = null;
      },

      onOAuthClientTypeChange(val) {
        this.form = {
          ...this.form,
          clientType: val,
        };
      },

      onOAuthGrantTypeChange(val) {
        this.form = {
          ...this.form,
          grantType: val,
        };
      },
    },
  }
</script>

