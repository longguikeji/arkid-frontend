import {Vue, Component, Prop, Watch} from 'vue-property-decorator';
import {Node, User, TreeNode} from '@/models/oneid';
import * as api from '@/services/oneid';

@Component({
  template: html`
  <ul class="selection">
    <li v-for="item in nodeSelection"
      :key="item.id"
      @click="doRemoveNode(item)"
      class="flex-row"
    >
      <XIcon name="folder-green"/>
      <span class="flex-auto">{{ item.name }}</span>
      <Icon type="ios-close-circle-outline" size="18" />
    </li>
    <li v-for="item in userSelection"
      :key="item.id"
      @click="doRemoveUser(item)"
      class="flex-row"
    >
      <XIcon name="icon-accout"/>
      <span class="flex-auto">{{ item.name }}</span>
      <Icon type="ios-close-circle-outline" size="18" />
    </li>
  </ul>
  `,
})
export default class Selection extends Vue {
  @Prop({type: Array, default: () => []}) nodeSelection!: Node[];
  @Prop({type: Array, default: () => []}) userSelection!: User[];

  doRemoveNode(node: Node) {
    this.$emit('on-remove-node', node);
  }

  doRemoveUser(user: User) {
    this.$emit('on-remove-user', user);
  }

  mounted() {
    console.log('selection mounted', this.nodeSelection, this.userSelection)
  }
}
