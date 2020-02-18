import {Vue, Component, Watch, Prop} from 'vue-property-decorator';
import {throttle} from 'lodash';
import {User, Node} from '@/models/oneid';
import * as oneidApi from '@/services/oneid';
import {Node as nodeApi, UcenterNode as ucenterNodeApi} from '@/services/node';
import {findTreePath} from '@/utils';
import './Contacts.less';

@Component({
  template: html`
<div>
  <div class="intro flex-row">
    <div class="intro-left flex-col">
      <span class="name flex-auto">{{ user.name }}</span>
    </div>
    <div class="avatar">
      <UserAva :user="user" size="xl" />
    </div>
  </div>
  <div class="field-list flex-col flex-auto">
    <UserInfoList :user="user" />
  </div>
</div>
  `,
})
class UserInfo extends Vue {
  @Prop() user!: any;
}

@Component({
  components: {
    UserInfo,
  },

  template: html`
<div class="ui-contact-page--group flex-auto flex-col">
    <div class="ui-contact-page--header-wrapper flex-row">
      <div class="ui-contact-page--header flex-row">
        <span class="cat-name">{{ node.name }}<template v-if="!loading"> ({{ nodeData.headcount }}人)</template></span>
        <Input
          search
          :placeholder="searchHint"
          class="search"
          v-model="keyword"
          @on-change="doSearchChange"
          @on-search="doSearch"
        />
      </div>
    </div>

    <span v-if="loading">...</span>
    <div v-else class="ui-contact-page--main-wrapper flex-row">
      <div class="ui-contact-page--main flex-row">

        <div class="org flex-col">
          <div class="org-wrapper" v-show="!searchResult">
            <ul class="path-list flex-row">
              <template v-for="(item, index) in path" :key="item.dept && item.dept.id">
                <li v-if="index < path.length - 1">
                  <span class="path-name" @click="goToDept(item)">{{ item.name }}</span>
                  <span class="divider">/</span>
                </li>
                <li v-else class="active">
                  <span class="path-name">{{ item.name }}</span>
                </li>
              </template>
            </ul>

            <div class="org-main flex-col">
              <ul class="dept-list">
                <li
                  v-for="item in subNodes"
                  :key="item.id"
                  @click="goToDept(item)"
                  class="flex-row"
                >
                  <XIcon name="folder-green" class="folder-icon"/>
                  <span class="name flex-auto">{{ item.name }} ({{ item.headcount }}人)</span>
                  <span class="sub">
                    <XIcon name="thechild" class="child-icon"/>
                    下级
                  </span>
                </li>
              </ul>

              <ul class="user-list">
                <li
                  v-for="item in users"
                  :key="item.username"
                  @click="goToUser(item)"
                  :class="['flex-row', user && item.id === user.id ? 'active' : null]"
                >
                  <div class="avatar">
                    <UserAva :user="item" />
                  </div>
                  <span class="name">{{ item.name }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="org-wrapper" v-if="searchResult">
            <div class="org-main flex-col">
              <div class="search-title flex-row">
                <span>“{{ keyword }}” 的搜索结果：</span>
              </div>

              <div v-if="!searchResult.depts.length && !searchResult.users.length">无数据</div>

              <template v-if="searchResult.depts.length > 0">
                <div class="dept-title">
                  <span>分组：</span>
                </div>
                <ul class="dept-list" style="margin-bottom: 40px;">
                  <li
                    v-for="item in searchResult.depts"
                    :key="item.id"
                    @click="goToDept(item);doClear()"
                    class="flex-row"
                  >
                    <XIcon name="folder-green" class="folder-icon"/>
                    <span class="name flex-auto">{{ item.name }} ({{ item.headcount }}人)</span>
                  </li>
                </ul>
              </template>

              <template v-if="searchResult.users.length > 0">
                <div class="user-title">
                  <span>账号：</span>
                </div>
                <ul class="user-list">
                  <li
                    v-for="item in searchResult.users"
                    :key="item.username"
                    @click="goToUser(item)"
                    :class="['flex-row', user && item.id === user.id ? 'active' : null]"
                  >
                    <div class="avatar">
                      <UserAva :user="item" />
                    </div>
                    <span class="name">{{ item.name }}</span>
                  </li>
                </ul>
              </template>

            </div>
          </div>
        </div>

        <div class="detail flex-col">
          <div class="detail-wrapper">
            <UserInfo v-if="user" :key="user.id" :user="user" />
            <template v-else>
              <div class="placeholder">
                <XIcon name="account-empty" class="placeholder-icon"/>
                <div class="placeholder-intro">
                  <h4>通讯录的功能</h4>
                  <p>
                    通讯录功能是您工作中的好帮手，使用通讯录，您可以对公司的组织架构，职能部门一览无遗；还可以查看同事的联系方式，方便快捷
                  </p>
                </div>
              </div>
            </template>
          </div>
        </div>

      </div>
    </div>
</div>
  `,
})
class Group extends Vue {

  @Prop() node!: Node;

  loading = true;

  nodeData: Node|null = null;
  curDept: Node|null = null;

  users: User[]|null = null;
  user: User|null = null;

  keyword: string|null = null;
  searchResult: {depts: Node[], users: User[]}|null = null;

  doSearchChange = throttle((event) => {
    this.keyword = event.target.value;
  }, 500);

  get searchHint() {
    return `在${this.node.name}里搜索分组、账号`;
  }

  get path(): string[] {
    if (this.curDept) {
      const {id} = this.curDept;
      const results = findTreePath(this.nodeData, (n: Node) => n.id === id);
      return results;
    }

    return [];
  }

  get subNodes(): Node[] {
    if (this.curDept) {
      return this.curDept.children;
    }

    return [];
  }

  @Watch('curDept')
  onCurDeptChange() {
    this.getDeptUsers();
  }

  @Watch('keyword')
  onKeywordChange(keyword: string, prev: string) {
    if (keyword) {
      if (!prev) {
        this.user = null;
      }

      this.doSearch(keyword);
    } else {
      if (prev) {
        this.user = null;
      }

      this.doClear();
    }
  }

  mounted() {
    this.loadData();
  }

  async loadData() {
    const tree = Node.fromData(await ucenterNodeApi.tree(this.node.id));

    this.nodeData = tree;
    this.curDept = tree;

    this.loading = false;
  }

  goToDept(dept: Node) {
    this.users = [];
    this.curDept = dept;
  }
  async goToUser(user: User) {
    this.user = await oneidApi.User.retrieveColleague(user.username);
  }

  async getDeptUsers() {
    this.users = this.curDept ? this.curDept.users : [];
  }

  async doSearch(keyword: string) {
    const kw = keyword.toLocaleLowerCase();
    const userMap: {[uid: string]: boolean} = {};
    const depts: Node[] = [];
    const users: User[] = [];

    // return keyword ? apps.filter(item => item.name.toLocaleLowerCase().includes(kw))

    const m = (name: string) => name.toLocaleLowerCase().includes(kw);
    const p = (node: Node) => {
      if (m(node.name)) {
        depts.push(node);
      }

      node.users.forEach(u => {
        if (!userMap[u.username] && m(u.name || u.username)) {
          users.push(u);
        }
      });

      node.children.forEach(p);
    };
    // const result = {
    //   depts: depts.filter(dept => dept.name.includes(keyword)),
    //   users: users.filter(user => user.name.includes(keyword)),
    // };
    this.nodeData!.children.forEach(p);

    this.searchResult = {
      depts,
      users,
    };
  }

  doClear() {
    this.keyword = null;
    this.searchResult = null;
  }

  formatName(name: string): string {
    const re = /[\u4e00-\u9fa5]/;
    const isCn = re.test(name);
    const result = isCn ? name.slice(name.length - 2) : name.slice(0, 2) ;

    return result;
  }

  formatImgSource(key: string) {
    return oneidApi.File.url(key);
  }
}


@Component({
  components: {
    Group,
  },

  template: html`
  <div class="ui-contact-page flex-row flex-auto">
    <ul class="ui-contact-page--side">
      <template v-for="(cat, idx) in cats">
        <li class="title">
          <XIcon :name="['folder-green', 'custom-classification'][idx]" class="icon"/>
          <span>{{ cat.name }}</span>
        </li>
        <li
          v-for="node in cat.children"
          @click="selNode(node)"
          :class="['node', node === cNode ? 'active' : null]"
        >{{ node.name }}</li>
      </template>
    </ul>

    <Group v-if="cNode" :key="cNode.id" :node="cNode" />
  </div>
  `,
})
export default class Contact extends Vue {
  cats: Node[] = [];
  cNode: Node|null = null;

  selNode(node: Node) {
    this.cNode = node;
  }

  async mounted() {
    const [a, b] = await nodeApi.metaNode(await this.$app.org());
    // console.log(a, b);

    for (let i = 0; i < a.children.length; i++) {
      if (a.children[i].nodeSubject == 'manager') {
        a.children.splice(i, 1)
        break
      }
    }
    this.cats = [a, b];

    this.cNode = a.children[0];
  }

}
