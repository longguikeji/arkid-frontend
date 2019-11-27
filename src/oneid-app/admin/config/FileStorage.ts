import { Minio, StorageConfig } from '@/models/config'
import {Config as ConfigApi} from '@/services/config'
import { FORM_RULES } from '@/utils'
import { Form } from 'iview'
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import './FileStorage.less'

@Component({
  template: html`
  <div class="ui-file-config flex-col flex-auto">
    <div class="main">
      <div>
        <h2 class="subtitle">设置文件存储位置</h2>
      </div>
      <div>
        <RadioGroup v-model="storageMethod">
          <Radio label="local">本地存储</Radio>
          <Radio class="radio" label="minio">Minio</Radio>
        </RadioGroup>
        <Form
          :label-width="200"
          class="ui-minio-form"
          :model="minioForm"
          :rules="minioFormRules"
          ref="minioForm"
          v-if="storageMethod === 'minio'"
        >
          <FormItem prop="endPoint" label="End Point">
            <Input placeholder="请输入End Point" v-model="minioForm.endPoint"></Input>
          </FormItem>
          <FormItem prop="accessKey" label="Access Key">
            <Input placeholder="请输入Access Key" v-model="minioForm.accessKey"></Input>
          </FormItem>
          <FormItem prop="secretKey" label="Secret Key">
            <Input placeholder="请输入Secret Key" v-model="minioForm.secretKey"></Input>
          </FormItem>
          <FormItem prop="secure" label="Secure">
            <Checkbox v-model="minioForm.secure"></Checkbox>
          </FormItem>
          <FormItem prop="location" label="Location">
            <Input placeholder="请输入Location" v-model="minioForm.location"></Input>
          </FormItem>
          <FormItem prop="bucket" label="Bucket">
            <Input placeholder="请输入Bucket" v-model="minioForm.bucket"></Input>
          </FormItem>
        </Form>
      </div>
      <div class="ui-file-config-save">
        <div class="button-area flex-col">
          <Button class="save-button" type="primary" :loading="isSaving" @click="doSave">保存</Button>
        </div>
      </div>
    </div>
  </div>
  `,
})
export default class FileStorage extends Vue {
  $refs!: {
    minioForm: Form,
  }
  minioForm: Minio|null = null
  storageData: StorageConfig|null = null

  storageMethod: string = ''

  get minioFormRules() {
    return {
      endPoint: [FORM_RULES.required],
      accessKey: [FORM_RULES.required],
      secretKey: [FORM_RULES.required],
      location: [FORM_RULES.required],
      bucket: [FORM_RULES.required],
    }
  }

  mounted() {
    this.loadData()
  }

  async loadData() {
    this.storageData = await ConfigApi.getStorageData()

    const {method, minio} = this.storageData

    this.storageMethod = method
    this.minioForm = minio
  }

  async doSave() {
    this.storageData!.method = this.storageMethod
    if (this.storageMethod === 'minio') {
      // tslint:disable-next-line: await-promise
      const valid = await this.$refs.minioForm.validate()
      if (!valid) {
        return
      }
    }
    try {
      await ConfigApi.updateStorage(this.storageData!)
      this.$Message.success('保存成功')
    } catch (e) {
      this.$Message.error('保存失败')
    }
  }
}