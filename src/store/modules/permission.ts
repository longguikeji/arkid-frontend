import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'

export interface IPermissionState {
  // 是否为超级管理员
  is_globaladmin?: boolean
  // 是否为租户管理员
  is_tenantadmin?: boolean
  // 超级管理员特有权限页面
  global_en_names: string[]
  // 普通用户(非超级管理员和租户管理员)
  // 普通用户可以管理的页面
  en_names: string[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public is_globaladmin = false
  public is_tenantadmin = false
  public global_en_names: string[] = []
  public en_names: string[] = []

  @Mutation SET_PERMISSION(info: IPermissionState) {
    const { is_globaladmin, is_tenantadmin, global_en_names, en_names } = info
    this.is_globaladmin = is_globaladmin || false
    this.is_tenantadmin = is_tenantadmin || false
    this.global_en_names = global_en_names
    this.en_names = en_names
  }

  @Action setPermission(info: IPermissionState) {
    this.SET_PERMISSION(info)
  }
}

export const PermissionModule = getModule(Permission)
