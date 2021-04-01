// 该方法旨在获取执行初始化各种页面之前需要准备的资源
import OpenAPI, { ITagPage } from '@/config/openapi'

export default function getInitContent(page: string): ITagPage | undefined {
  const tags = OpenAPI.instance.getAllTags()
  for (let i = 0; i < tags.length; i++) {
    if (tags[i].name === page) {
      return tags[i].page
    }
  }
}
