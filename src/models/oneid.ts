// tslint:disable:max-classes-per-file
// tslint:disable:no-any
// tslint:disable:variable-name
interface DingUserData {
  account: string
  uid: string
  data: string
}

export class DingUser {
  static fromData(data: DingUserData) {
    return new this(data)
  }

  account: string
  id: string
  data: string

  constructor(data: DingUserData) {
    this.account = data.account
    this.id = data.uid
    this.data = data.data
  }

  toData() {
    return {
      account: this.account,
      uid: this.id,
      data: this.data,
    }
  }
}

export interface CustomUserFieldData {
  data: any
  pretty: Array<{
    uuid: string;
    name: string;
    value: any;
  }>
}

export interface UserData {
  avatar: string
  email: string
  employee_number: string
  gender: number
  mobile: string
  name: string
  position: string
  posix_user: any
  private_email: string
  user_id: string
  username: string
  ding_user: DingUserData|null
  depts: DeptData[]|null
  roles: RoleData[]|null
  nodes: NodeHierarchyData[]|null
  perms: string[]|null
  custom_user: CustomUserFieldData|null
  is_settled: boolean
  is_manager: boolean
  is_admin: boolean
  is_extern_user: boolean
  password: string
  require_reset_password: boolean
  has_password: boolean
}

export interface OrgUserData {
  user: UserData,
  remark: string,
  position: string
  hiredate: string,
  employee_number: string,
}

export class OrgUser {
  static fromData(data?: OrgUserData) {
    const obj = new this()
    if (!data) {
      return obj
    }
    obj.user = User.fromData(data.user)
    obj.remark = data.remark
    obj.position = data.position
    obj.hiredate = data.hiredate
    obj.employeeNumber = data.employee_number
    return obj
  }

  user: User = {}
  remark: string = ''
  position: string = ''
  hiredate: string = ''
  employeeNumber: string = ''

  toData() {
    const data = {
      user: this.user ? this.user.toData() : null,
      remark: this.remark,
      position: this.position,
      hiredate: this.hiredate,
      employee_number: this.employeeNumber,
    }
    return data
  }
}

export class User {
  static exchangeCurrentUserData(rawData: UserData) {
    const {is_admin, is_manager} = rawData
    const hasAccessToAdmin = is_admin || is_manager

    return {
      ...rawData,
      id: rawData.user_id,
      hasAccessToAdmin,
    }
  }

  static fromData(data?: UserData) {
    const obj = new this()
    if (!data) {
      return obj
    }
    obj.avatar = data.avatar
    obj.email = data.email
    obj.employeeNumber = data.employee_number
    obj.gender = data.gender
    obj.mobile = data.mobile
    obj.name = data.name
    obj.position = data.position
    obj.posixUser = data.posix_user
    obj.privateEmail = data.private_email
    // obj.id = data.user_id;
    obj.id = data.username
    obj.username = data.username
    obj.dingUser = data.ding_user ? DingUser.fromData(data.ding_user) : null
    obj.depts = data.depts && data.depts.map(d => Dept.fromData(d))
    obj.roles = data.roles && data.roles.map(r => Role.fromData(r))
    obj.nodes = data.nodes && data.nodes.map(n => Node.fromData(n))
    obj.custom_user = data.custom_user
    obj.is_settled = data.is_settled
    obj.isManager = data.is_manager
    obj.isAdmin = data.is_admin
    obj.hasAccessToAdmin = data.is_admin || data.is_manager
    obj.isExternUser = data.is_extern_user
    obj.password = data.password
    obj.requireResetPassword = data.require_reset_password
    obj.hasPassword = data.has_password
    return obj
  }

  avatar: string = ''
  email: string = ''
  employeeNumber: string = ''
  gender: number = 0
  mobile: string = ''
  name: string = ''
  position: string = ''
  posixUser: any
  privateEmail: string = ''
  id: string = ''
  username: string = ''
  dingUser: DingUser|null = null
  depts: Dept[]|null = null
  roles: Role[]|null = null
  nodes: Node[]|null = null
  custom_user: CustomUserFieldData|null = null
  is_settled: boolean = false
  isManager: boolean = false
  isAdmin: boolean = false
  hasAccessToAdmin: boolean = false
  isExternUser: boolean = false
  password: string = ''
  requireResetPassword: boolean = false
  hasPassword: boolean = false

  toData() {
    const data = {
      avatar: this.avatar,
      email: this.email,
      employee_number: this.employeeNumber,
      gender: this.gender,
      mobile: this.mobile,
      name: this.name,
      position: this.position,
      posix_user: this.posixUser,
      private_email: this.privateEmail,
      // user_id: this.id,
      username: this.username,
      ding_user: this.dingUser && this.dingUser.toData(),
      depts: this.depts ? this.depts.map((dept: Dept) => dept.toData()) : null,
      roles: this.roles ? this.roles.map((role: Role) => role.toData()) : null,
      nodes: this.nodes ? this.nodes.map((node: Node) => node.toData()) : null,
      is_settled: this.is_settled,
      password: this.password,
      require_reset_password: this.requireResetPassword,
      has_password: this.hasPassword,
    }
    if (!data.posix_user) {
      delete data.posix_user
    }
    if (!data.ding_user) {
      delete data.ding_user
    }
    return data
  }
}

export interface TreeOption {
  type?: 'node'|'user'
  checkedIds?: string[]
  selectedIds?: string[]
  expandIds?: string[]
  disabledIds?: string[]
  disableCheckboxIds?: string[]
  showUser?: boolean
  parent?: TreeNode
}

export class TreeNode {
  static fromNode(node: Node|User, option: TreeOption) {
    const obj = new this()
    obj.type = option.type || 'node'
    obj.raw = node
    obj.title = node.name
    obj.parent = option.parent || null
    obj.checked = !!option.checkedIds && option.checkedIds.includes(node.id!)
    obj.selected = !!option.selectedIds && option.selectedIds.includes(node.id!)
    obj.expand = !!option.expandIds && option.expandIds.includes(node.id!)
    obj.disabled = !!option.disabledIds && option.disabledIds.includes(node.id!)
    obj.disableCheckbox = !!option.disableCheckboxIds && option.disableCheckboxIds.includes(node.id!)

    if (option.type === 'user') {
      return obj
    }

    const children = node.children
      ? node.children.map(n => this.fromNode(n, {...option, parent: obj}))
      : []
    const userOption: TreeOption = {...option, type: 'user', parent: obj}
    const users = option.showUser ? (node as Node).users.map(u => this.fromNode(u, userOption)) : []
    obj.children = [...children, ...users]

    return obj
  }

  raw!: Dept|Role|User|Node
  type: 'node'|'user'|null = null
  title: string = ''
  parent: TreeNode|null = null
  children: TreeNode[] = []
  expand: boolean = true
  selected: boolean = false
  checked: boolean = false
  disabled: boolean = false
  disableCheckbox: boolean = false

  flattenNodes() {
    const getAllNodes = (node: TreeNode): TreeNode[] => {
      const subs: TreeNode[] = [].concat(...node.children.map(n => getAllNodes(n)))
      return [node, ...subs]
    }
    return getAllNodes(this)
  }

  get nodeMap() {
    const map = new Map()
    this.flattenNodes().forEach(i => map.set(i.raw.id, i))
    return map
  }
}

interface ManagerGroupData {
  nodes: NodeHierarchyData[]
  users: UserData[]
  apps: AppData[]
  perms: Array<{uid: string, name: string}>
  scope_subject: number
}

interface NodeHierarchyData {
  info?: {
    name: string;
    node_subject: string;
    node_uid: string;
    remark: string;
    uid: string;
  }
  name?: string
  node_subject?: string
  node_uid?: string
  remark?: string
  uid: string

  parent_node_uid?: string
  visibility?: number
  node_scope?: string[]
  user_scope?: string[]

  manager_group?: ManagerGroupData

  nodes: NodeHierarchyData[]
  headcount?: number
  users?: UserData[]
}

export class Node {
  static fromData(data?: NodeHierarchyData) {
    const obj = new this()
    if (!data) {
      return obj
    }

    obj.nodeSubject = data.info ? data.info.node_subject : data.node_subject!
    obj.headcount = data.headcount!
    obj.name = data.info ? data.info.name : data.name!
    obj.id = data.info ? data.info.node_uid : data.node_uid!

    obj.visibility = data.visibility
    obj.nodeScope = data.node_scope || []
    obj.userScope = data.user_scope || []

    obj.managerGroup = data.manager_group ? {
      nodes: data.manager_group.nodes.map(n => Node.fromData(n)),
      users: data.manager_group.users.map(n => User.fromData(n)),
      apps: data.manager_group.apps.map(n => App.fromData(n)),
      perms: data.manager_group.perms.map(n => ({id: n.uid, name: n.name})),
      scopeSubject: data.manager_group.scope_subject,
    } : undefined

    obj.children = data.nodes ? data.nodes.map(i => this.fromData(i)) : []
    obj.children.forEach(i => i.parent = obj)
    obj.users = data.users ? data.users.map(i => User.fromData(i)) : []
    return obj
  }

  name = ''
  id = ''
  parent: Node|null = null
  children: Node[] = []
  users: User[] = []
  nodeSubject = ''
  headcount = -1

  visibility?: number
  nodeScope: string[] = []
  userScope: string[] = []

  managerGroup: {
    nodes: Node[];
    users: User[];
    apps: App[];
    perms: Array<{id: string, name: string}>;
    scopeSubject: number;
  } = {
    nodes: [],
    users: [],
    apps: [],
    perms: [],
    scopeSubject: 1,
  }

  toData() {
    return {
      node_uid: this.id,
      name: this.name,
      visibility: this.visibility,
      node_scope: this.nodeScope,
      user_scope: this.userScope,
      manager_group: this.managerGroup ? {
        nodes: this.managerGroup.nodes.map(i => i.id),
        users: this.managerGroup.users.map(i => i.id),
        perms: this.managerGroup.perms.map(i => i.id),
        apps: this.managerGroup.apps.map(i => i.uid),
        scope_subject: this.managerGroup.scopeSubject,
      } : undefined,
      users: this.users.map(i => i.id),
    }
  }
}

interface DeptData {
  dept_id: string
  ding_dept: any
  uid: number|null
  name: string
  remark: string
  parent: DeptData|null
  userHeadCount?: number
  users?: UserData[]
  children?: DeptData[]
}

interface DeptTreeData {
  info: DeptData
  depts: DeptTreeData[]
  users?: UserData[]
}

export class Dept {
  static fromData(data?: DeptData) {
    const obj = new this()
    if (!data) {
      return obj
    }
    obj.deptId = data.dept_id
    obj.dingDept = data.ding_dept
    obj.id = data.uid
    obj.name = data.name
    obj.remark = data.remark
    obj.parent = data.parent ? Dept.fromData(data.parent) : null
    obj.userHeadCount = data.userHeadCount
    obj.users = data.users ? data.users.map(u => User.fromData(u)) : []
    return obj
  }

  static fromHierarchyData(data: DeptTreeData, parent: Dept|null = null): Dept {
    const {info, users, depts} = data

    const obj = this.fromData({...info, users})
    obj.parent = parent
    obj.children = depts.map(d => this.fromHierarchyData(d, obj))

    return obj
  }

  deptId: string = ''
  dingDept: any    // TODO (kaishun): remove any
  id: number|null = null
  name: string = ''
  remark: string = ''
  parent?: Dept|null = null
  userHeadCount?: number
  users: User[] = []
  children: Dept[] = []

  toData(): DeptData {
    const data: DeptData = {
      dept_id: this.deptId,
      ding_dept: this.dingDept,
      uid: this.id,
      name: this.name,
      remark: this.remark,
      parent: this.parent ? this.parent.toData() : null,
      users: this.users.map(u => u.toData()),
    }
    if (!data.ding_dept) {
      delete data.ding_dept
    }

    return data
  }
}

export interface ManagerRoleData {
  depts: string[]
  dept_subject: 'tree'|'node'|'self_node'|'self_tree'
  apps: string[]
  all_apps: boolean
}

interface DingRoleData {
    uid: number
    data: string
    subject: 'role'|'label'
    is_group: boolean
}

export interface RoleData {
  accept_user: boolean
  ding_group: DingRoleData    // TODO (kaishun): remove any
  group_id: string
  uid: number
  name: string
  remark: string
  parent: RoleData|null
  manager_group: ManagerRoleData
  userHeadCount?: number
  users?: UserData[]
}

interface RoleTreeData {
  groups: RoleTreeData[]
  info: RoleData
  users?: UserData[]
}

export class Role {
  static fromData(data?: RoleData) {
    const obj = new this()
    if (!data) {
      return obj
    }
    obj.acceptUser = data.accept_user
    obj.dingGroup = data.ding_group
    obj.groupId = data.group_id
    obj.id = data.uid
    obj.name = data.name
    obj.remark = data.remark
    obj.parent = data.parent ? Role.fromData(data.parent) : null
    obj.managerGroup = data.manager_group
    obj.userHeadCount = data.userHeadCount
    obj.users = data.users ? data.users.map(u => User.fromData(u)) : []

    return obj
  }

  static fromHierarchyData(data: RoleTreeData, parent: Role|null = null): Role {
    const {info, groups, users} = data

    const obj = this.fromData({...info, users})
    obj.parent = parent
    obj.children = groups.map(g => this.fromHierarchyData(g, obj))

    return obj
  }

  acceptUser = true
  dingGroup: any = null    // TODO (kaishun): remove any
  groupId: string = ''
  id: number|null = null
  name: string = ''
  remark: string = ''
  parent?: Role|null = null
  children: Role[] = []
  managerGroup: ManagerRoleData|null = null
  userHeadCount?: number
  users: User[] = []

  toData(): RoleData {
    const data = {
      accept_user: this.acceptUser,
      ding_group: this.dingGroup,
      group_id: this.groupId,
      uid: this.id,
      name: this.name,
      remark: this.remark,
      parent: this.parent ? this.parent.toData() : null,
      manager_group: this.managerGroup,
    }

    if (!data.ding_group) {
      delete data.ding_group
    }
    if (!data.manager_group) {
      delete data.manager_group
    }

    return data
  }
}

export interface PermOwnerData {
  uid: string
  name: string
  subject: string
}

export class Permission {
  static fromData(data?) {
    const obj = new this()
    if (!data) {
      return obj
    }
    obj.perm_id = data.perm_id
    obj.uid = data.uid
    obj.name = data.name
    obj.remark = data.remark
    obj.scope = data.scope
    obj.action = data.action
    obj.subject = data.subject
    obj.ownersList = data.permit_owners.results ? data.permit_owners.results: []
    obj.permit_owners = data.permit_owners.results
    obj.reject_owners = data.reject_owners.results
    obj.sub_account = data.sub_account
    if (data.permit_owners.results.length !== 0) {
      obj.ownersString = data.permit_owners.results.map(o => o.name).join(',')
    }
    return obj
  }
  perm_id: number|null = null
  uid: string = ''
  name: string = ''
  remark: string = ''
  scope: string = ''
  action: string = ''
  subject: string = ''
  ownersList: PermOwnerData[] = []
  ownersString: string = '小杨，小马，小刘，小林，小杨，小马，小刘，小林，小杨，小马，小刘，小林，小杨，小马，小刘，小林，小杨，小马，小刘，小林，小杨，小马，小刘，小林，小杨，小马，小刘，小林，小杨，小马，小刘，小林，'
  permit_owners: PermOwnerData[] = []// 白名单
  reject_owners: PermOwnerData[] = []// 黑名单
  sub_account: {
    domain: string,
    username: string,
    password: string,
  } = {domain: '', username: '', password: ''}
}

export class OAuthData {
  client_id = ''
  client_secret = ''
  redirect_uris = ''
  client_type = 'confidential'
  authorization_grant_type = 'authorization-code'
}

export class SamlData {
  entity_id = ''
  acs = ''
  sls = ''
  cert = ''
  xmldata = ''
}

export interface AccessPermData {
  permit_owners: {
    results: PermOwnerData[];
  }
  reject_owners: {
    results: PermOwnerData[];
  }
}

export interface AppData {
  uid: string
  name: string
  remark: string
  logo: string
  index: string
  oauth_app: OAuthData|null
  ldap_app?: object|null
  http_app?: object|null
  saml_app?: SamlData|null
  auth_protocols: string[]
  access_perm: AccessPermData
}

export interface OrgData {
  oid: string,
  name: string,
  owner: string,
  dept_uid: string,
  group_uid: string,
  direct_uid: string,
  manager_uid: string,
  label_uid: string,
  role_uid: string
}

export class Org {
  static fromData(data?: OrgData) {
    const obj = new this()
    if (!data) {
      return obj
    }
    obj.oid = data.oid
    obj.name = data.name
    obj.owner = data.owner
    obj.dept_uid = data.dept_uid
    obj.group_uid = data.group_uid
    obj.direct_uid = data.direct_uid
    obj.manager_uid = data.manager_uid
    obj.label_uid = data.label_uid
    obj.role_uid = data.role_uid

    return obj
  }
  oid: string = ''
  name: string = ''
  owner: string = ''
  dept_uid: string = ''
  group_uid: string = ''
  direct_uid: string = ''
  manager_uid: string = ''
  label_uid: string = ''
  role_uid: string = ''
}

export class App {
  static fromData(data?: AppData) {
    const obj = new this()
    if (!data) {
      return obj
    }
    obj.uid = data.uid
    obj.name = data.name
    obj.remark = data.remark
    obj.logo = data.logo
    obj.oauth_app = data.oauth_app
    obj.index = data.index
    obj.ldap_app = data.ldap_app
    obj.http_app = data.http_app
    obj.saml_app = data.saml_app
    obj.auth_protocols = data.auth_protocols
    if (data.access_perm) {
      obj.permit_owners = data.access_perm.permit_owners.results
      obj.reject_owners = data.access_perm.reject_owners.results
    }

    return obj
  }
  uid: string = ''
  name: string = ''
  remark: string = ''
  logo: string = ''
  index: string = ''
  oauth_app?: OAuthData|null = null
  ldap_app?: object|null = null
  http_app?: object|null = null
  saml_app?: SamlData|null = null
  auth_protocols: string[] = []
  permit_owners: PermOwnerData[] = []// 白名单
  reject_owners: PermOwnerData[] = []// 黑名单
}

export const SUBJECT_CHOICES = {
  'ucenter_login': '登录',
  'ucenter_reset_pwd': '重置密码',
  'ucenter_register': '注册',
  'ucenter_activate': '激活',

  'config': '系统配置',
  'org_config': '组织配置',

  'user_create': '创建用户',
  'user_update': '修改用户信息',
  'user_delete': '删除用户',

  'dept_create': '创建部门',
  'dept_update': '修改部门信息',
  'dept_delete': '删除部门',
  'dept_move': '移动部门',
  'dept_member': '部门成员调整',

  'group_create': '创建组',
  'group_update': '修改组信息',
  'group_delete': '删除组',
  'group_move': '移动组',
  'group_member': '组成员调整',

  'app_create': '创建应用',
  'app_update': '修改应用信息',
  'app_delete': '删除应用',

  'perm_create': '创建权限',
  'perm_delete': '删除权限',
  'perm_assign': '配置权限',
}

export interface SimpleUserData {
  name: string
  username: string
}

export class SimpleUser {

  static fromData(data?: SimpleUserData) {
    const obj = new this()
    if (!data) {
      return obj
    }
    obj.name = data.name
    obj.username = data.username
    return obj
  }
  name: string = ''
  username: string = ''
}

export interface OperationRecordData {
  uuid: string
  user: SimpleUser
  subject: string  // 事件类型
  summary: string  // 事件信息
  created: string  // 发生时间
  detail: string   // 详细信息
}

export class OperationRecord {

  static fromData(data?: OperationRecordData) {
    const obj = new this()
    if (!data) {
      return obj
    }
    obj.uuid = data.uuid
    obj.user = SimpleUser.fromData({name: data.user.name, username: data.user.username})
    obj.subject = SUBJECT_CHOICES[data.subject] || data.subject
    obj.summary = data.summary
    obj.created = data.created
    obj.detail = data.detail
    return obj
  }
  uuid: string = ''
  user: SimpleUser | null = null
  subject: string = ''  // 事件类型
  summary: string = ''  // 事件信息
  created: string = ''  // 发生时间
  detail: string = ''   // 详细信息
}
