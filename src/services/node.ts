import * as model from '@/models/oneid'
import {http} from './base'

export interface MetaNodeData {
  name: string
  node_uid: string
  nodes: Array<{name: string, node_uid: string}>
  slug: string
}


export class UcenterNode {
  static get baseUrl() {
    return '/siteapi/oneid/ucenter/node'
  }
  static resp:any = null
  static async tree(id: string) {
    if(UcenterNode.resp) {
      return this.resp.data
    }

    const url = `${this.baseUrl}/${id}/tree/`
    const data = {params: {user_required: true}}
    UcenterNode.resp = await http.get(url, data)
    return UcenterNode.resp.data
  }
  static async node(id: string) {
    const url = `${this.baseUrl}/${id}/`
    const resp = await http.get(url)
    return resp.data
  }
  static async user(id: string) {
    const url = `${this.baseUrl}/${id}/user/`
    const resp = await http.get(url)
    return resp.data
  }
}

export class Node {
  static get baseUrl() {
    return '/siteapi/oneid/node'
  }

  static async metaNode() {
    const url = '/siteapi/oneid/meta/node/'
    const resp = await http.get(url)
    const [defaultMetaNode, customMetaNode] = resp.data
    return [
      model.Node.fromData({
        info: defaultMetaNode,
        nodes: defaultMetaNode.nodes.map(i => ({info: i})),
      }),
      model.Node.fromData({
        info: customMetaNode,
        nodes: customMetaNode.nodes.map(i => ({info: i})),
      }),
    ]
  }

  static async create(node: model.Node) {
    const url = `${this.baseUrl}/${node.parent!.id}/node/`
    const data = node.toData()
    const resp = await http.post(url, data)
    return resp.data
  }
  static async addChild(parentId: string, childrenIds: string[]) {
    const url = `${this.baseUrl}/${parentId}/node/`
    const data = {node_uids: childrenIds, subject: 'add'}
    const resp = await http.patch(url, data)
    return resp.data
  }
  static async remove(id: string) {
    const url = `${this.baseUrl}/${id}/`
    const resp = await http.delete(url)
    return resp.data
  }
  static async partialUpdate(node: model.Node) {
    const url = `${this.baseUrl}/${node.id}/`
    const resp = await http.patch(url, node.toData())
    if (node.parent) {
      await this.addChild(node.parent.id, [node.id])
    }
    return resp.data
  }
  static async retrieve(id: string) {
    const url = `${this.baseUrl}/${id}/`
    const resp = await http.get(url)
    return model.Node.fromData(resp.data)
  }
  static async list(id: string) {
    const url = `${this.baseUrl}/${id}/list/`
    const resp = await http.get(url)
    return resp.data
  }
  static async listFromIds(ids: string[]) {
    const url = '/siteapi/oneid/slice/'
    const qs = require('qs')
    const data = {
      params: {node_uids: ids},
      paramsSerializer: (params: string[]) => {
        return qs.stringify(params, {arrayFormat: 'repeat'})
      },
    }
    const resp = await http.get(url, data)
    return resp.data.nodes.map(i => model.Node.fromData(i))
  }
  static async tree(id: string) {
    const url = `${this.baseUrl}/${id}/tree/`
    const data = {params: {user_required: false}}
    const resp = await http.get(url, data)
    return resp.data
  }
  static async sortTree(id: string | number, deptIds: Array<string | number>) {
    const url = `${this.baseUrl}/${id}/tree_sort/`
    const data = { dept_ids: deptIds }
    await http.put(url, data)
  }
  static async node(id: string) {
    const url = `${this.baseUrl}/${id}/node/`
    const resp = await http.get(url)
    return resp.data
  }
  static async user(id: string, opt?: {page?: number, pageSize?: number, keyword?: string}) {
    const data = opt ? {params: {
      page: opt.page || 1,
      page_size: opt.pageSize || 1000,
      keyword: opt.keyword || '',
    }} : {page: 1, page_size: 1000}

    const url = `${this.baseUrl}/${id}/user/`
    const resp = await http.get(url, data)
    return resp.data
  }
  static async removeUsers(id: string, users: model.User[]) {
    const url = `${this.baseUrl}/${id}/user/`
    const data = {user_uids: users.map(user => user.username), subject: 'delete'}
    const resp = await http.patch(url, data)
    return resp.data
  }
  static async moveUsers(id: string, users: model.User[], nodes: model.Node[]) {
    const url = `${this.baseUrl}/${id}/user/`
    const data = {
      user_uids: users.map(item => item.username),
      node_uids: nodes.map(item => item.id),
      subject: 'move_out',
    }
    const resp = await http.patch(url, data)
    return resp.data
  }
  static async updateUsers(id: string, {userIds}: {userIds: string[]}) {
    const url = `${this.baseUrl}/${id}/user/`
    const data = {user_uids: userIds, subject: 'override'}
    const resp = await http.patch(url, data)
    return resp.data
  }
  static async importUser(id: string) {
    const url = `${this.baseUrl}/${id}/user/csv/import/`
    // const resp = await http.get(url);
    // return resp.data;
  }
  static async sortUsers(id: string, users: model.User[]) {
    const url = `${this.baseUrl}/${id}/user/`
    const data = { user_uids: users.map(user => user.username), subject: 'sort' }
    const resp = await http.patch(url, data)
    return resp.data
  }
  static get Manager() {
    return Manager
  }
  static async prefixName(id: string) {
    const url = `/siteapi/oneid/dept/${id}/general_terms/`
    const resp = await http.get(url)
    const items = resp.data.items
    return items && items.length > 1 ? items.join('/') : ''
  }
}

export class Manager extends Node {
  static async create(node: model.Node) {
    const url = `/siteapi/oneid/group/manager/group/`
    const resp = await http.post(url, node.toData())
    return model.Node.fromData(resp.data)
  }
  static async list() {
    const url = `/siteapi/oneid/node/g_manager/node/`
    const resp = await http.get(url)

    const nodes = resp.data.nodes.map(n => model.Node.fromData(n))
    return nodes
  }
  static async pagerList(params?: {
    pageSize?: number;
    page?: number;
  }) {
    const data = params ? {params: {
      page: params.page || 1,
      page_size: params.pageSize || 10,
    }} : {}

    const url = '/siteapi/oneid/group/manager/group_page/'
    const resp = await http.get(url, data)
    const { count, results } = resp.data

    return {
      count,
      results: results ? results.map(n => model.Node.fromData(n)) : [],
    }
  }
}
