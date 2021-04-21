<template>
  <el-carousel
    id="desktop-page-app-carousel"
    direction="vertical"
    :autoplay="false"
  >
    <el-carousel-item
      v-for="pageIndex in apps.length"
      :key="pageIndex"
    >
      <ul
        v-if="apps.length"
        class="app-list"
      >
        <li
          v-for="(app, index) in apps[pageIndex-1]"
          :key="index"
          class="app-item"
          @click="toExternalLink(app.url)"
        >
          <div class="app-item-logo">
            <img
              v-if="app.logo"
              :src="app.logo"
              class="app-logo"
            >
            <div
              v-else
              class="app-logo-placeholder"
            >
              Logo
            </div>
          </div>
          <div class="app-item-name">
            <div class="app-info">
              <span class="app-name">{{ app.name }}</span>
              <span class="app-description">{{ app.description }}</span>
            </div>
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
import { UserModule } from '@/store/modules/user'
import arrTrans from '@/utils/arr-trans'

@Component({
  name: 'Desktop',
  components: {}
})
export default class extends Vue {
  private appList = [] // 未分页之前的user-app
  private apps = [] as any[] // 分页之后的user-app
  private pageWidth = 0 // 宽度值
  private pageHeight = 0 // 高度值

  @Watch('appList')
  private onAppListChange() {
    this.getApps()
  }

  @Watch('pageWidth')
  private onPageWidthChange() {
    this.getApps()
  }

  @Watch('pageHeight')
  private onPageHeightChange() {
    this.getApps()
  }

  async created() {
    // 执行获取 user app 的流内容
    await this.getDesktopUserApp()
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
      url: '/api/v1/tenant/{parent_lookup_tenant}/user/{parent_lookup_user}/app/',
      method: 'get'
    }).then((data) => {
      // 获取到的data赋值给appList，之后应该再根据页面的宽度值去filter应用列表，以适应当前的页面尺寸
      this.appList = data.results
      UserModule.setUserApps(data.results)
    })
  }

  private listenerDesktopPageSize() {
    const desktopResizeDetector = elementResizeDetectorMaker()
    desktopResizeDetector.listenTo(document.getElementById('desktop-page-app-carousel'), (el) => {
      // 根据不同的宽度去判断当前的 desktop 页面需要多少张轮播图
      this.pageWidth = el.offsetWidth - 40
      this.pageHeight = el.offsetHeight - 40
    })
  }

  // 根据 appList 和 pageWidth 来重新生成一份适应此时页面情形的user-app数据集合
  private getApps() {
    const widthNumber = Math.floor(this.pageWidth / 300)
    const heightNumber = Math.floor(this.pageHeight / 100)
    const pageNumber = widthNumber * heightNumber // 每页可以存放多少app
    const pager = Math.ceil(this.appList.length / pageNumber) // 需要存放多少页
    this.apps = arrTrans(this.appList, pager)
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
    padding: 20px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
    list-style: none;
    box-sizing: border-box;
    .app-item {
      width: 300px;
      height: 100px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      cursor: pointer;
      .app-item-logo {
        display: inline-block;
        width: 60px;
        height: 60px;
        border-radius: 30px;
        background-color: #006064;
        .app-logo {
          width: 100%;
          height: 100%;
        }
        .app-logo-placeholder {
          color: #ffffff;
          text-align: center;
          line-height: 60px;
          font-weight: bold;
        }
      }
      .app-item-name {
        width: 240px;
        height: 60px;
        display: inline-block;
        position: relative;
        text-indent: 10px;
        .app-info {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          .app-name {
            display: block;
            font-weight: 700;
          }
          .app-description {
            display: block;
          }
        }
      }
    }
  }
}
</style>
