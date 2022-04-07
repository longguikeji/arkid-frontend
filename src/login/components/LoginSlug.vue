<template>
  <el-dialog
    :visible="true"
    title="输入Slug开始使用"
    width="500px"
    :show-close="false"
    :fullscreen="fullscreen"
    class="app-login__slug"
  >
    <el-form
      ref="slugForm"
      :model="model"
      :rules="rules"
    >
      <el-form-item prop="slug">
        <el-input
          v-model="model.slug"
          placeholder="请输入Slug"
        />
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="handleClick('slugForm')"
        >
          点击提交
        </el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'
import { QUERY_KEYS } from '../constant'

@Component({
  name: 'LoginSlug'
})
export default class LoginSlug extends Vue {
  private model = { slug: '' }
  private rules = {
    slug: [{ required: true, message: '请输入Slug', trigger: 'blur' }]
  }

  get fullscreen(): boolean {
    return document.body.clientWidth < 600
  }

  handleClick(name: string) {
    (this.$refs[name] as any).validate(async(valid: boolean) => {
      if (valid) {
        this.toTarget()
      }
    })
  }

  toTarget() {
    const query = this.$route.query
    const { protocol, origin, pathname } = window.location
    let url =
      origin.replace(`${protocol}//`, `${protocol}//${this.model.slug}.`) +
      pathname
    const keys = Object.keys(query)
    for (const key of keys) {
      if (key === QUERY_KEYS.slug) continue
      if (key === QUERY_KEYS.tenant) continue
      if (url.includes(`&${key}=`)) continue
      if (url.includes(`?${key}=`)) continue
      url = url + `&${key}=${query[key]}`
    }
    if (url.indexOf('?') === -1) url = url.replace('&', '?')
    window.location.replace(url)
  }
}
</script>

<style lang="scss" scoped>
.app-login__slug {
  background-image: url('../../assets/bgc.png');
  background-color: #0f62ea;
  display: flex;
  align-items: center;
  justify-content: center;

  ::v-deep .el-dialog {
    margin: 0px !important;
    .el-dialog__header {
      font-weight: 600;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>
