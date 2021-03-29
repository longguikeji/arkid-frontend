import { BaseState } from '@/admin/base/BaseVue'

export default interface MarkdownState extends BaseState {
  value: string; //内容]
  language: string; //     'en_US',  'zh_CN','es_ES', 'ja_JP', 'ko_KR'
  options: string;
}
