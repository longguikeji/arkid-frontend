import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {cloneDeep} from 'lodash';
import * as api from '@/services/oneid';
import {Node, User} from '@/models/oneid';
import ChooseNode from '@/oneid-app/comps/choose/Choose';
import './Edit.less';

const required = {required: true, message: 'Required', trigger: 'blur'};

@Component({
  components: {
    ChooseNode,
  },
  template: html`
  <div>
    <Drawer
      placement="right"
      v-model="showDrawer"
      :closable="false"
      :maskClosable="true"
      :width="580"
      @on-visible-change="onVisiableChange"
      className="ui-edit-group"
    >
      <div class="title">{{ metaNode.name }}设置</div>
      <Form
        v-if="form"
        :model="form"
        :rules="rules"
        :labelWidth="100"
        labelPosition="left"
        ref="form"
        class="form"
      >
        <FormItem prop="name" :label="metaNode.name + '名称'">
          <Input type="text" v-model="form.name" :placeholder="'请输入' + metaNode.name + '名称'"></Input>
        </FormItem>
        <FormItem prop="parent" :label="'上级' + metaNode.name">
          <Input type="text" :value="form.parent.name" :placeholder="'请选择上级' + metaNode.name"
            @click.native="doShowModal"></Input>
        </FormItem>
        <FormItem prop="visibility" label="可见范围">
          <Select v-model="form.visibility">
            <Option
              v-for="item in visibilityOptions"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem prop="visibilityScope" label="可见范围" v-if="form.visibility === 4">
          <Input
            type="textarea"
            :value="visibilityScope"
            @click.native="doStartChooseVisibilityScope"
            readonly
            :autosize="{minRows: 2,maxRows: 5}"
          />
        </FormItem>
      </Form>
      <div class="drawer-footer flex-row flex-auto">
        <Button type="default" @click="doCancel">取消</Button>
        <Button type="error" @click="openRemoveModal" v-if="!isNew">删除</Button>
        <div class="flex-row flex-auto"></div>
        <Button type="primary" @click="doSave" :loading="isSaving">{{ isNew ? '添加' : '保存' }}</Button>
      </div>
    </Drawer>

    <ChooseNode
      v-if="chooseNode"
      v-bind="chooseNode"
      ref="chooseNode"
      @on-ok="onChooseNodeOk"
    />

    <ChooseNode
      v-if="chooseVisibilityScope"
      v-bind="chooseVisibilityScope"
      ref="chooseVisibilityScope"
      @on-ok="onChooseVisibilityScopeOk"
    />
  </div>
  `,
})
export default class Edit extends Vue {
  @Prop({type: Node}) node?: Node;
  @Prop({type: Node}) parent?: Node;
  @Prop({type: Node, required: true}) metaNode!: Node;

  visibilityOptions = [
    {value: 1, label: '所有人可见'},
    {value: 2, label: '仅组内成员可见（下属分组不可见）'},
    {value: 3, label: '组内成员及其下属分组可见'},
    {value: 5, label: '所有人不可见'},
    {value: 4, label: '只对部分人可见'},
  ];
  form: Node|null = null;
  nodeScopeObjs: Node[] = [];
  userScopeObjs: User[] = [];
  metaNodeList: Node[] = [];

  rules = {
    name: required,
  };
  showDrawer = false;
  isSaving = false;

  chooseNode: any|null = null;
  chooseVisibilityScope: any|null = null;

  get isNew() {
    return !this.form!.id;
  }

  get visibilityScope() {
    const {metaNodeList, nodeScopeObjs, userScopeObjs} = this;
    if (metaNodeList.length === 0) {
      return '';
    }

    const metaMap = new Map();
    metaNodeList.forEach((node: Node) => metaMap.set(node.nodeSubject, node));
    const getMetaName = (node: Node) => metaMap.get(node.nodeSubject).name;

    return [
      ...nodeScopeObjs.map(i => `${getMetaName(i)}-${i.name}`),
      ...userScopeObjs.map(i => i.name),
    ].join('，');
  }

  async create() {
    try {
      await api.Node.create(this.form!);
      this.$Message.success('创建成功');
    } catch (e) {
      console.log(e);
      this.$Message.error('创建失败');
    }
  }

  async edit() {
    try {
      await api.Node.partialUpdate(this.form!);
      this.$Message.success('编辑成功');
    } catch (e) {
      console.log(e);
      this.$Message.error('编辑失败');
    }
  }

  async remove() {
    try {
      await api.Node.remove(this.form!.id);
      this.$Message.success('删除成功');
      this.showDrawer = false;
      this.$emit('on-save');
    } catch (e) {
      if (e.status === 400 && e.data.node) {
        if (e.data.node.includes('protected_by_child_node')) {
          this.$Message.error('删除失败：存在依赖的节点');
          return;
        }
        if (e.data.node.includes('protected_by_child_user')) {
          this.$Message.error('删除失败：存在依赖的账号');
          return;
        }
      }
      this.$Message.error('删除失败');
    }
  }

  async doSave() {
    const isValid = await this.$refs.form.validate();
    if (!isValid) {
      return;
    }
    if (this.isNew) {
      await this.create();
    } else {
      await this.edit();
    }
    this.$emit('on-save');
    this.showDrawer = false;
  }

  doCancel() {
    this.showDrawer = false;
  }

  doShowModal() {
    this.chooseNode = {
      title: `选择${this.metaNode.name}`,
      metaNode: this.metaNode,
      selectedIds: [this.form!.parent!.id],
    };
    this.$nextTick(() => this.$refs.chooseNode.show());
  }

  onChooseNodeOk(checkedNodes: Node[]) {
    const [parent] = checkedNodes;
    if (parent) {
      this.form!.parent = parent;
      this.$forceUpdate();
    }
  }

  doStartChooseVisibilityScope() {
    this.chooseVisibilityScope = {
      title: `${this.node!.name}的可见范围`,
      showUser: true,
      multiple: true,
      checkedIds: this.form!.nodeScope,
      checkedUserIds: this.form!.userScope,
    };
    this.$nextTick(() => this.$refs.chooseVisibilityScope.show());
  }

  onChooseVisibilityScopeOk(nodes: Node[], users: User[]) {
    this.nodeScopeObjs = nodes;
    this.userScopeObjs = users;
    this.form!.nodeScope = this.nodeScopeObjs.map(n => n.id);
    this.form!.userScope = this.userScopeObjs.map(u => u.id);
  }

  openRemoveModal() {
    this.$Modal.confirm({
      title: '确认要删除此 部门？',
      content: '删除后无法恢复，您将无法继续使用该部门.',
      onOk: () => this.remove(),
    });
  }

  async show() {
    const {nodeScope, userScope} = this.form!;
    const nodeScopeObjs = nodeScope.length > 0
      ? await api.Node.listFromIds(nodeScope)
      : [];
    const userScopeObjs = userScope.length > 0
      ? await api.User.listFromIds(userScope)
      : [];
    this.nodeScopeObjs = nodeScopeObjs;
    this.userScopeObjs = userScopeObjs;

    const [defaultMetaNode, customMetaNode] = await api.Node.metaNode(await this.$app.org());
    this.metaNodeList = [...defaultMetaNode.children, ...customMetaNode.children];

    this.showDrawer = true;
  }

  onVisiableChange(val: boolean) {
    if (!val) {
      this.$nextTick(() => this.$emit('on-hide'));
    }
  }

  created() {
    const {metaNode, node, parent} = this;
    if (node) {
      this.form = cloneDeep(node);
    } else {
      const form = new Node();
      form.parent = parent || metaNode;
      this.form = form;
    }
  }
}
