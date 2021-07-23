import {File} from '@/services/oneid'
import {Component, Prop, Vue} from 'vue-property-decorator'


@Component({})
export default class UserAva extends Vue {
  @Prop() user!: {avatar?: string; name: string, username: string}
  @Prop() size!: any

  // <img :src="formatImgSource(item.avatar)" v-if="item.avatar"/>
  // <span v-else>{{ formatName(item.name) }}</span>
  render(h: any) {
    const {avatar, username, name} = this.user

    const props = {size: this.size}
    if (avatar) {
      props.src = this.formatImgSource(avatar)
      return h('Avatar', {
        props,
      })
    } else {
      return h('Avatar', {props}, [this.formatName(name || username)])
    }
  }

  formatName(name: string): string {
    const re = /[\u4e00-\u9fa5]/
    const isCn = re.test(name)
    const result = isCn ? name.slice(name.length - 2) : name.slice(0, 2)

    return result
  }

  formatImgSource(key: string) {
    return File.url(key)
  }

}