const BUTTON_ICON = {
  create: 'el-icon-circle-plus-outline',
  update: 'el-icon-edit',
  delete: 'el-icon-delete',
  read: 'el-icon-tickets',
  import: 'el-icon-upload2',
  export: 'el-icon-download',
  password: 'el-icon-lock',
  history: 'el-icon-reading',
  unbind: 'el-icon-connection',
  switch: 'el-icon-open',
  enter: 'el-icon-position',
  setting: 'el-icon-setting',
  sync: 'el-icon-refresh',
  auth: 'el-icon-coordinate',
  custom: 'el-icon-document-add',
  search: 'el-icon-search',
  more: 'el-icon-more-outline',
  mapping: 'el-icon-attract',
  profile: 'el-icon-folder',
  retry: 'el-icon-refresh-right',
  logout: 'el-icon-d-arrow-right',
  token: 'el-icon-refresh',
  logoff: 'el-icon-d-arrow-right'
}

const BUTTON_LABEL = {
  create: '创建',
  update: '编辑',
  delete: '删除',
  retrieve: '查看',
  import: '导入',
  export: '导出',
  password: '修改密码',
  history: '历史记录',
  unbind: '解绑',
  switch: '切换',
  enter: '进入',
  sync: '同步配置',
  setting: '设置',
  auth: '自定义授权页面',
  custom: '自定义字段',
  search: '搜索',
  more: '更多操作',
  mapping: '配置映射',
  profile: '配置概述',
  retry: '重发',
  logout: '退出登录',
  token: '重置Token',
  logoff: '注销账号'
}

export function getButtonIcon(key: string): string {
  return BUTTON_ICON[key]
}



export function getButtonDefaultLabel(key: string): string {
  return BUTTON_LABEL[key]
}
