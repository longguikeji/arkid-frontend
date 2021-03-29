import TreeNodeProps from '@/admin/common/data/Tree/TreeNodeProps'

export default function getTreeData(data: Array<any>) {
  const res: Array<TreeNodeProps> = []
  for (let i = 0; i < data.length; i++) {
    const item = {
      id: data[i].uuid,
      uuid: data[i].uuid, // 给每一个 tree 节点都添加一个uuid的属性值，在接口调用的时候将调取uuid的内容
      label: data[i].name || '',
      children: data[i].children ? getTreeData(data[i].children) : [],
    }
    res.push(item)
  }
  return res
}