import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IValidateState {
  invalidValues: string[]
}

@Module({ dynamic: true, store, name: 'validate' })
class Validate extends VuexModule implements IValidateState {

  public invalidValues: string[] = []

  @Mutation
  ADD_INVALID_ITEM(name: string) {
    this.invalidValues.push(name)
  }

  @Mutation
  DELETE_INVALID_ITEM(name: string) {
    const index = this.invalidValues.indexOf(name)
    if (index !== -1) {
      this.invalidValues.splice(index, 1)
    }
  }

  @Mutation
  DELETE_ALL_ITEMS() {
    this.invalidValues = []
  }

  @Action
  addInvalidItem(name: string) {
    if (this.invalidValues.indexOf(name) === -1) {
      this.ADD_INVALID_ITEM(name)
    }
  }

  @Action
  deleteInvalidItem(name: string) {
    this.DELETE_INVALID_ITEM(name)
  }

  @Action
  deleteAllItems() {
    this.DELETE_ALL_ITEMS()
  }
}

export const ValidateModule = getModule(Validate)
