import * as api from '@/services/oneid'
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'
import './AddNewField.less'

@Component({
  template: html`
    <Card title="字段编辑" class="unset-background margin_top_20">
      <div slot="extra" >
        <Input v-model="fieldName" style="width:150px" placeholder="输入字段名"/>
        <Button @click="addField">添加字段</Button>
      </div>
      <Tag
        class="unset-background"
        v-if="fields && fields.length > 0"
        :key="fields.indexOf(field)"
        v-for="field of fields"
        closable
        @on-close="handleClose"
        :name="field.uuid"
      >{{field.name}}</Tag>
    </Card>
  `,
})
export default class AddNewField extends Vue {
  @Prop(Boolean) readonly modal?: boolean
  @Prop(String) readonly type!: string

  fields:any[] = []

  fieldName:string = ''

  async created(){
    this.fields = await api.CustomFieldConfig.getList(this.type)
  }

  async addField(){
    if(this.fieldName.length === 0) {
      return
    }

    await api.CustomFieldConfig.createField(this.type,{
      name:this.fieldName,
      subject:this.type,
    })
    this.fieldName = ''
    this.fields = await api.CustomFieldConfig.getList(this.type)
  }

  async handleClose (event:Event, name:string) {
    await api.CustomFieldConfig.deleteField(this.type, name)
    this.fields = await api.CustomFieldConfig.getList(this.type)
  }

}