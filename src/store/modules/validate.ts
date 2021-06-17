import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import { deleteValueInArray } from '@/utils/common'

export interface IValidateState {
  invalidValues: string[]
}

@Module({ dynamic: true, store, name: 'validate' })
class Validate extends VuexModule implements IValidateState {

  public invalidValues: string[] = []

  @Mutation
  ADD_INVALID_ITEM(prop: string) {
    this.invalidValues.push(prop)
  }

  @Mutation
  DELETE_INVALID_ITEM(prop: string) {
    this.invalidValues = deleteValueInArray(this.invalidValues, prop)
  }

  @Mutation
  DELETE_ALL_ITEMS() {
    this.invalidValues = []
  }

  @Action
  addInvalidItem(prop: string) {
    this.ADD_INVALID_ITEM(prop)
  }

  @Action
  deleteInvalidItem(prop: string) {
    this.DELETE_INVALID_ITEM(prop)
  }

  @Action
  deleteAllItems() {
    this.DELETE_ALL_ITEMS()
  }
}

export const ValidateModule = getModule(Validate)
