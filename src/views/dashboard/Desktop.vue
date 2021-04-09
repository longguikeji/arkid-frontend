<template>
  <el-carousel
    id="desktop-page-app-carousel"
    direction="vertical"
    :autoplay="false"
  >
    <el-carousel-item
      v-for="item in 3"
      :key="item"
    >
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
    </el-carousel-item>
  </el-carousel>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { runFlowByFile } from '@/arkfbp/index'
import elementResizeDetectorMaker from 'element-resize-detector'

@Component({
  name: 'Desktop',
  components: {}
})
export default class extends Vue {
  private appList = [] // 未分页之前的user-app
  private apps = [] // 分页之后的user-app
  private pageWidth = 0 // 主页面的内容宽度，不包含侧边栏宽度

  @Watch('appList')
  private onAppListChange() {
    this.getApps()
  }

  @Watch('pageWidth')
  private onPageWidthChange() {
    this.getApps()
  }

  async created() {
    // 执行获取 user app 的流内容
    // await this.getDesktopUserApp()
  }

  mounted() {
    // 监听页面宽度的变化
    this.listenerDesktopPageSize()
  }

  private toExternalLink(link: string) {
    if (link) {
      window.open(link, '_blank')
    }
  }

  private async getDesktopUserApp() {
    await runFlowByFile('flows/desktop', {
      url: '/api/v1/user_app/',
      method: 'get'
    }).then((data) => {
      // 获取到的data赋值给appList，之后应该再根据页面的宽度值去filter应用列表，以适应当前的页面尺寸
      this.appList = data.results
    })
  }

  private listenerDesktopPageSize() {
    const desktopResizeDetector = elementResizeDetectorMaker()
    desktopResizeDetector.listenTo(document.getElementById('desktop-page-app-carousel'), (el) => {
      // 根据不同的宽度去判断当前的 desktop 页面需要多少张轮播图
      this.pageWidth = el.offsetWidth
    })
  }

  // 根据 appList 和 pageWidth 来重新生成一份适应此时页面情形的user-app数据集合
  private getApps() {
    this.apps = []
  }
}
</script>

<style lang="scss" scoped>
#desktop-page-app-carousel {
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
    width: 100%;
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
      padding-left: 20px;
      box-sizing: border-box;
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
        width: 240px;
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
