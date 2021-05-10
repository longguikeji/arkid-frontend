import { StateNode } from './stateNode'
import FormItemState from '@/admin/common/Form/FormItem/FormItemState'
import FormObjectItemState from '@/admin/common/Form/FormObjectItem/FormObjectItemState'
import FormState from '@/admin/common/Form/FormState'
import OptionType from '@/admin/common/Form/Select/OptionType'
import SelectState from '@/admin/common/Form/Select/SelectState'
import { FormPage } from '@/admin/FormPage/FormPageState'
import OpenAPI, { ISchema } from '@/config/openapi'


export class InitPageNode extends StateNode {

  private static state: any = null
  private static paramsters: { [key: string]: any }
  private static requestMapping: { [key: string]: any }
  private static responseMapping: { [key: string]: any }

  public get actionConfig() {
    return {
      params: InitPageNode.paramsters,
      request: InitPageNode.requestMapping,
      response: InitPageNode.responseMapping
    }
  }

  public initPage() {

  }

  public initBtn() {

  }

  public initTableColumns() {

  }

  public initTableAction() {

  }

  public initFormElement() {

  }

  public initFormAction() {

  }

  public initTreeNode() {

  }

  public initTreeAction() {

  }

}