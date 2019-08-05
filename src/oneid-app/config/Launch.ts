import {Vue, Component, Prop} from 'vue-property-decorator';
import dayjs from 'dayjs';
import {sideMenu} from './menu';
import * as api from '@/services/noah';
import * as oneidApi from '@/services/oneid';

@Component({
  template: html`
  <div class="lg-noah-config-launch-page flex-col flex-auto" style="height: 0">
    <div class="lg-noah-config-launch-page--default-photo flex-col">
      <div class="header">
        <span class="title">默认展示</span>
      </div>
      <div class="main flex-row">
        <div class="photo" v-if="defaultPhoto">
          <img :src="formatImgSource(defaultPhoto.img_key)"/>
          <div class="photo-footer" @click="doEdit(defaultPhoto)">
            <span class="replace">替换</span>
          </div>
        </div>
        <div class="photo" @click="doAddDefault" v-else>
          <Icon type="ios-add" size="100" color="#F0F0F0" class="icon-add"></Icon>
          <div class="add">
            <span>点击添加</span>
          </div>
        </div>
        <p class="tips">
          在没有特殊日期时展示的默认启动图。<br/>上传的图片尺寸建议为750*1334，大小不超过3M
        </p>
      </div>
    </div>
    <div class="lg-noah-config-launch-page--special-photo flex-col">
      <div class="header">
        <span class="title">自定义日期展示</span>
        <span class="subtitle">设定在企业纪念日、重大通知时展示的启动画面，上传的图片尺寸建议为750*1334，大小不超过3M</span>
      </div>
      <div class="main">
        <ul class="flex-row flex-auto" v-if="photoList">
          <li v-for="(item, index) in normalPhotoList" :key="item.photo">
            <div class="photo">
              <img :src="formatImgSource(item.img_key)"/>
              <div class="photo-footer">
                <span class="edit" @click="doEdit(item)">编辑</span>
                <span class="del" @click="doDelete(item)">删除</span>
              </div>
            </div>
            <div class="date">{{ formatDate(item.start_date) }} - {{ formatDate(item.end_date) }}</div>
          </li>
          <li @click="doAdd">
            <div class="photo">
              <Icon type="ios-add" size="100" color="#F0F0F0" class="icon-add"></Icon>
              <div class="add">
                <span>点击添加</span>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <Drawer
      placement="right"
      v-model="showDrawer"
      :closable="false"
      :maskClosable="true"
      :width="580"
      className="lg-noah-config-launch-drawer"
    >
      <div class="lg-noah-config-launch-drawer-header">
        <span class="title">编辑启动图</span>
      </div>
      <Form
        v-if="showDrawer"
        labelPosition="left"
        ref="form"
        class="lg-noah-config-launch-drawer-form"
        :labelWidth="120"
      >
        <div class="formitem-photo flex-row">
          <div class="label flex-col">
            <span class="title">添加图片：</span>
            <span class="subtitle">点击图片以上传图片<br/>上传的图片尺寸建议为750*1334，大小不超过3M</span>
          </div>
          <Upload
            v-bind="upload"
            :beforeUpload="onUploadStart"
            :onSuccess="onUploadSuccess"
            :onError="onUploadError"
          >
            <div class="photo" v-if="form.img_key">
              <img :src="formatImgSource(form.img_key)"/>
              <div class="photo-footer">
                <span class="replace">替换</span>
              </div>
            </div>
            <div class="photo" v-else>
              <Icon type="ios-add" size="100" color="#F0F0F0" class="icon-add"></Icon>
              <div class="add">
                <span>点击添加</span>
              </div>
            </div>
          </Upload>
        </div>
        <FormItem prop="start_date" label="开始时间" v-if="!form.is_default">
          <DatePicker
            v-model="form.start_date"
            type="datetime"
            format="yyyy-MM-dd"
            placeholder="请选择开始时间"
            class="datepicker"
         ></DatePicker>
        </FormItem>
        <FormItem prop="end_date" label="结束时间" v-if="!form.is_default">
          <DatePicker
            v-model="form.end_date"
            type="datetime"
            format="yyyy-MM-dd"
            placeholder="请选择结束时间"
            class="datepicker"
          ></DatePicker>
        </FormItem>
      </Form>
      <div class="lg-noah-config-launch-drawer-footer flex-row flex-auto">
        <div class="flex-row flex-auto">
          <Button type="default" @click="doCancel">取消</Button>
        </div>
        <Button type="primary" @click="doSave" :loading="isSaving">{{ isNew ? '添加' : '保存' }}</Button>
      </div>
    </Drawer>
  </div>
  `,
})
export default class Launch extends Vue {
  photoList: api.LaunchPhotoData[]|null = null;
  showDrawer = false;
  form: api.LaunchPhotoData|null = null;

  get defaultPhoto() {
    if (this.photoList) {
      return this.photoList.find(p => p.is_default);
    }
    return null;
  }
  get normalPhotoList() {
    if (this.photoList) {
      return this.photoList.filter(p => !p.is_default);
    }
    return [];
  }

  get upload() {
    return {
      headers: oneidApi.File.headers(),
      action: oneidApi.File.baseUrl(),
      showUploadList: false,
    };
  }

  get viewMeta() {
    return {
      breadcrumb: [
        {label: '设置', path: {name: 'oneid.config'}},
        '启动图片设置',
      ],
      sideMenu: {
        menus: sideMenu.menus,
      },
    };
  }

  mounted() {
    this.loadData();
  }

  async loadData() {
    const {results: photoList} = await api.Config.launchPhotoList();
    this.photoList = photoList;
  }

  onUploadStart() {
    this.$Loading.start();
  }

  onUploadSuccess(resp: {file_name: string}) {
    this.form!.img_key = resp.file_name;
    this.$Loading.finish();
  }

  onUploadError() {
    this.$Loading.error();
  }

  doAddDefault() {
    this.form = {img_key: '', is_default: true};
    this.showDrawer = true;
  }
  doAdd() {
    this.form = {img_key: '', is_default: false};
    this.showDrawer = true;
  }
  doEdit(photo: api.LaunchPhotoData) {
    this.form = photo;
    this.showDrawer = true;
  }
  async doSave() {
    const isNew = !this.form!.uuid;
    this.$Loading.start();
    try {
      if (isNew) {
        await api.Config.addLaunchPhoto({
          ...this.form!,
          start_date: dayjs(this.form!.start_date).format('YYYY-MM-DD'),
          end_date: dayjs(this.form!.start_date).format('YYYY-MM-DD'),
        });
      } else {
        await api.Config.updateLaunchPhoto({
          ...this.form!,
          start_date: dayjs(this.form!.start_date).format('YYYY-MM-DD'),
          end_date: dayjs(this.form!.start_date).format('YYYY-MM-DD'),
        });
      }
      this.$Loading.finish();
      this.showDrawer = false;
      this.form = null;
      await this.loadData();
    } catch (e) {
      this.$Loading.error();
    }
  }

  doCancel() {
    this.form = null;
    this.showDrawer = false;
  }

  doDelete(photo: api.LaunchPhotoData) {
    this.$Modal.confirm({
      render: () => '确认删除该启动图？',
      onOk: () => this.delete(photo),
    });
  }

  async delete(photo: api.LaunchPhotoData) {
    this.$Loading.start();
    try {
      await api.Config.removeLaunchPhoto(photo!);
      this.$Loading.finish();
      await this.loadData();
    } catch (e) {
      this.$Loading.error();
    }
  }

  formatDate(date: Date): string {
    return dayjs(date).format('YYYY/MM/DD');
  }

  formatImgSource(key: string): string {
    return key ? oneidApi.File.url(key) : '';
  }
}
