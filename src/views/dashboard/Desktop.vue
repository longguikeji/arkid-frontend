<template>
  <div>
    <el-input
      v-model="filterText"
      class="app-filter"
      clearable
      placeholder="搜索应用"
      :suffix-icon="filterText ? '' : 'el-icon-search'"
    />
    <ul class="app-list">
      <li
        v-for="(app, index) in apps"
        :key="index"
        class="app-item"
        @click="toExternalLink(app.link)"
      >
        <div class="app-item-logo">
          <img
            :src="app.icon"
            alt="app-icon"
          >
        </div>
        <div class="app-item-name">
          <span class="app-name">{{ app.name }}</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Desktop',
  components: {}
})
export default class extends Vue {
  private currentRole = 'admin-dashboard';
  private filterText = '';
  private appList = [
    {
      icon: require('../../assets/arkid.png'),
      name: '一账通',
      link: 'https://arkid.demo.longguikeji.com/'
    },
    {
      icon: require('../../assets/arkid.png'),
      name: '一账通'
    },
    {
      icon: require('../../assets/arkid.png'),
      name: '百度',
      link: 'https://baidu.com/'
    },
    {
      icon: require('../../assets/arkid.png'),
      name: 'abc'
    },
    {
      icon: require('../../assets/arkid.png'),
      name: '一账通'
    },
    {
      icon: require('../../assets/arkid.png'),
      name: '一账通'
    }
  ];

  get apps() {
    const text = this.filterText.trim()
    if (text) {
      return this.appList.filter((app) => {
        return (
          app.name.indexOf(text) !== -1 ||
          app.name.toLocaleLowerCase().indexOf(text) !== -1 ||
          app.name.toLocaleUpperCase().indexOf(text) !== -1
        )
      })
    }
    return this.appList
  }

  private toExternalLink(link: string) {
    if (link) {
      window.open(link, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.app-filter {
  margin: 20px;
  width: 500px;
  max-width: 70%;
}
.app-list {
  width: 900px;
  max-width: 75%;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  margin: 0px;
  padding: 0px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  list-style: none;
  .app-item {
    width: 300px;
    margin-top: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    .app-item-logo {
      width: 40px;
      height: 40px;
      display: inline-block;
      img {
        width: 40px;
        height: 40px;
      }
    }
    .app-item-name {
      width: 260px;
      height: 40px;
      display: inline-block;
      position: relative;
      text-indent: 10px;
      .app-name {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        font-weight: 700;
      }
    }
  }
}
</style>
