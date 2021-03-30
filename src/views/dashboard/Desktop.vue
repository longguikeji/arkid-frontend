<template>
  <el-carousel
    direction="vertical"
    :autoplay="false"
    class="desktop-page-carousel"
  >
    <el-carousel-item
      v-for="item in 3"
      :key="item"
    >
      <ul class="app-list">
        <li
          v-for="(app, index) in appList"
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
    </el-carousel-item>
  </el-carousel>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  name: 'Desktop',
  components: {}
})
export default class extends Vue {
  private currentRole = 'admin-dashboard';
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

  private toExternalLink(link: string) {
    if (link) {
      window.open(link, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.desktop-page-carousel {
  width: 100% !important;
  height: calc(100vh - 84px);
  box-sizing: border-box;
  ::v-deep .el-carousel__container {
    height: 100% !important;
  }
  ::v-deep .el-carousel__indicators--vertical {
    .el-carousel__indicator {
      .el-carousel__button {
        background-color: #D3DCE6;
      }
      &.is-active {
        .el-carousel__button {
          background-color: #409EFF;
        }
      }
    }
  }
  .app-list {
    width: 900px;
    max-width: 75%;
    max-height: 100%;
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
      height: 100px;
      margin-top: 20px;
      margin-bottom: 20px;
      cursor: pointer;
      .app-item-logo {
        width: 40px;
        height: 40px;
        display: inline-block;
        img {
          width: 60px;
          height: 60px;
        }
      }
      .app-item-name {
        width: 260px;
        height: 60px;
        display: inline-block;
        position: relative;
        text-indent: 30px;
        .app-name {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          font-weight: 700;
        }
      }
    }
  }
}
</style>
