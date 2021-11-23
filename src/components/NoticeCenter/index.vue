<template>
  <el-popover
    class="notice-center"
    placement="bottom"
    trigger="click"
    width="360"
  >
    <el-tabs
      v-model="active"
      stretch
    >
      <template v-for="(n, i) in notice">
        <el-tab-pane
          :key="i"
          :label="n.label"
          :name="n.name"
        >
          <div
            v-for="(item, index) in n.items"
            :key="index"
            class="item"
          >
            <div class="content">
              {{ item.content }}
            </div>
            <div class="created">
              {{ item.created }}
            </div>
          </div>
        </el-tab-pane>
      </template>
    </el-tabs>
    <svg-icon
      slot="reference"
      class="notice-icon"
      name="notice"
    />
  </el-popover>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { NoticeModule } from '@/store/modules/notice'

@Component({
  name: 'NoticeCenter'
})
export default class extends Vue {
  get notice() {
    return NoticeModule.notice
  }

  get active() {
    return this.notice.length ? this.notice[0].name : ''
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__item {
  font-size: 15px;
  font-weight: bold;
}
.notice-center {
  height: 100%;
  display: inline-block;
  vertical-align: top;
  padding: 0px 10px 0 10px;
  &:hover {
    background: rgba(0, 0, 0, 0.025);
  }
}
.notice-icon{
  cursor: pointer;
  font-size: 18px;
  vertical-align: middle;
}
.item {
  border-bottom: 1px solid #e5e7eb;
  padding: 5px;
}
.content {
  font-weight: bold;
  font-size: 15px;
  line-height: 30px;
  margin-bottom: 5px;
}
.created {
  color: rgba(0, 0, 0, 0.45);
  text-indent: 16px;
}
</style>
