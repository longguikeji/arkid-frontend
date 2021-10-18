<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import LoginStore from './store/login'

interface Response {
  token:string
}

@Component({
  name: 'ThirdPartCallback'
})
export default class ThirdPartCallback extends Vue {
  render() {
    // render
  }

  mounted() {
    const response = this.$route.query

    if (response.token && typeof response.token === 'string') { // 已经登录，直接跳界面
      LoginStore.token = response.token
      if (response.next && typeof response.next === 'string') {
        window.location.href = response.next
      } else {
        window.location.replace('/')
      }
    } else { // 没有登录，需要绑定到某用户
      LoginStore.ThirdUserID = String(response.user_id)
      LoginStore.BindUrl = String(response.bind)
      if (response.next && typeof response.next === 'string') {
        LoginStore.NextUrl = response.next
      }
      const uuid = response.tenant_uuid
      if (uuid) {
        if (typeof uuid === 'string') {
          LoginStore.TenantUUID = uuid
        } else {
          LoginStore.TenantUUID = uuid[0]
        }
      }
      this.$router.push({
        path: '/login',
        query: {
          tenant: LoginStore.TenantUUID
        }
      })
    }
  }
}
</script>
