<template>
  <div
    id="header-search"
    :class="{'show': show}"
    class="header-search"
  >
    <svg-icon
      class="search-icon"
      name="search"
      @click.stop="click"
    />
    <el-select
      ref="headerSearchSelect"
      v-model="search"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      placeholder="Search App"
      class="header-search-select"
      @change="change"
    >
      <el-option
        v-for="(item, index) in options"
        :key="index"
        :value="item.url"
        :label="item.name"
      />
    </el-select>
  </div>
</template>

<script lang="ts">
import Fuse from 'fuse.js' // A lightweight fuzzy-search module
import { Component, Vue, Watch } from 'vue-property-decorator'
import { UserModule, IUserApp } from '@/store/modules/user'

@Component({
  name: 'HeaderSearch'
})
export default class extends Vue {
  private search = ''
  private show = false
  private options: Array<IUserApp> = []
  private fuse?: Fuse<IUserApp>

  get apps() {
    return UserModule.userApps
  }

  @Watch('apps')
  private onAppListChange(value: Array<IUserApp>) {
    this.initFuse(value)
  }

  @Watch('show')
  private onShowChange(value: boolean) {
    if (value) {
      document.body.addEventListener('click', this.close)
    } else {
      document.body.removeEventListener('click', this.close)
    }
  }

  private click() {
    this.show = !this.show
    if (this.show) {
      this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).focus()
    }
  }

  private close() {
    this.$refs.headerSearchSelect && (this.$refs.headerSearchSelect as HTMLElement).blur()
    this.options = []
    this.show = false
  }

  private change(val: string) {
    if (val) {
      window.open(val, '_blank')
    }
  }

  private initFuse(list: Array<IUserApp>) {
    this.fuse = new Fuse(list, {
      shouldSort: true,
      threshold: 0.4,
      location: 0,
      distance: 100,
      minMatchCharLength: 1,
      keys: [{
        name: 'name',
        weight: 0.7
      }, {
        name: 'description',
        weight: 0.3
      }]
    })
  }

  private querySearch(query: string) {
    if (query !== '') {
      if (this.fuse) {
        this.options = this.fuse.search(query).map((result) => result.item)
      }
    } else {
      this.options = []
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 0;
    display: inline-block;
    vertical-align: middle;

    .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 0;
      padding-right: 0;
      box-shadow: none !important;
      border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }

  }

  &.show {
    .header-search-select {
      width: 210px;
      margin-left: 10px;
    }
  }
}
</style>
