import {Vue, Component, Prop} from 'vue-property-decorator';
import {sideMenu} from './menu';

// FIXME: - service/noah
import * as api from '@/services/noah';

@Component({
  template: html`
  <div class="lg-noah-contact-field-page flex-row">
    <div class="lg-noah-contact-field-page--contact">
      <div class="header">
        <span class="title">企业通讯录信息</span>
      </div>
      <ul class="contact-field-list flex-row" v-if="fieldList">
        <li v-for="item in fieldList" :key="item.name"
          :class="item.key ? 'static' : 'custom'"
        >
          <span>{{ item.name }}</span>
          <Icon
            v-if="!item.key"
            type="ios-close-circle"
            color="#F5222D"
            class="close"
            @click="removeField(item)"
          ></Icon>
        </li>
        <li class="add" @click="doStartAddField" v-if="!isAddingField">
          <span>添加新字段</span>
        </li>
        <Input
          v-if="isAddingField"
          placeholder="填写新字段"
          @on-enter="doSaveField"
          class="add-input"
        />
      </ul>
    </div>
    <div class="lg-noah-contact-field-page--userinfo">
      <div class="header">
        <span class="title">个人详情页展示的字段</span>
      </div>
      <ul class="userinfo-field-list flex-row" v-if="fieldList">
        <li v-for="item in fieldList" class="flex-row" :key="item.name">
          <Checkbox
            :label="item.name"
            :disabled="item.is_visible_editable === false"
            :value="item.is_visible"
            @on-change="(val) => onCheckboxChange(item, val)"
          >
          </Checkbox>
          <span>{{ item.name }}</span>
        </li>
      </ul>
    </div>
    <div class="lg-noah-contact-field-page--preview">
      <div class="header">
        <!-- <span class="title">企业语言设置</span> -->
        <span class="subtitle">Pigeon展示效果图：</span>
      </div>
    </div>
  </div>
  `,
})
export default class ContactField extends Vue {
  fieldList: api.FieldData[]|null = null;
  isAddingField = false;
  get viewMeta() {
    return {
      breadcrumb: [
        {label: '设置', path: {name: 'oneid.config'}},
        '通讯录信息',
      ],
      sideMenu: {
        menus: sideMenu.menus,
        activeName: 'oneid.config.contactfield',
      },
    };
  }

  mounted() {
    this.loadData();
  }

  async loadData() {
    const fieldList = await api.Config.UserField.list();
    this.fieldList = fieldList;
  }

  async removeField(field: api.FieldData) {
    try {
      await api.Config.UserField.remove(field.uuid);
      this.fieldList = this.fieldList!.filter(f => f.uuid !== field.uuid);
    } catch (e) {
      this.$Message.error('操作失败');
    }
  }

  doStartAddField() {
    this.isAddingField = true;
  }

  async doSaveField(e: Event) {
    const {value} = e.target!;
    const field: api.FieldData = await api.Config.UserField.create(value);

    this.fieldList!.push(field);
    this.isAddingField = false;
  }

  async onCheckboxChange(field: api.FieldData, show: boolean) {
    try {
      if (show) {
        await api.Config.UserField.show(field);
      } else {
        await api.Config.UserField.hide(field);
      }
    } catch (e) {
      this.$Message.error('操作失败');
      this.loadData();
    }
  }
}

