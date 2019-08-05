import {pDefer} from '@/utils';

export type TypeDialog = {
  title: string;
};
export type TypeModal = {
  id: number;
  data: TypeDialog;
  visible: boolean;
  doing: boolean;
  cancel: any;
  doAction: any;
};

let nextId = 0;
export default {
  data() {
    return {
      modals: [] as TypeModal[],
    };
  },

  methods: {
    showDialog(data: TypeDialog) {
      const id = ++nextId;
      const dfd = pDefer();

      const close = () => {
        const idx = this.modals.findIndex(x => x.id === id);
        if (idx >= 0) {
          this.modals.splice(idx, 1);
        }
        dfd.resolve(true);
      };

      this.modals.push({
        id,
        dfd,
        data,
        visible: true,
        doing: false,

        cancel() {
          close();
        },

        async doAction() {
          this.doing = true;

          try {
            await this.data.doAction(this.data.data);
            close();
          } catch(ex) {}

          this.doing = false;
        },

        // :disabled="!createObj.name" 

      });

      return dfd.promise;
    },

    showConfirm(data: {title?: string; content?: string}) {
      const dfd = pDefer();

      this.$Modal.confirm({
        title: data.title,
        content: data.content,
        onOk() {
          dfd.resolve(true);
        },
        onCancel() {
          dfd.reject();
        },
      });

      return dfd.promise;
    },
  },

  template: html`
<div>
  <Modal
    v-for="m in modals"

    :key="m.id"
    :title="m.data.title"
    v-model="m.visible"
    :maskClosable="false"
    :closable="false"
  >
    <Form
      :model="m.data.data"
      style="padding: 100px 70px 140px;"
    >
      <FormItem
        v-for="f in m.data.fields"
        :label="f.title" :prop="f.key">
        <Input type="text" v-model="m.data.data[f.key]"></Input>
      </FormItem>
    </Form>

    <div slot="footer">
      <Button @click="m.cancel()" :disabled="m.doing">取消</Button>
      <Button @click="m.doAction()" :loading="m.doing" type="primary">确定</Button>
    </div>
  </Modal>
</div>
  `,
};
