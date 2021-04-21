<template>
  <div>
    <!-- upload -->
    <template>
      <div class="uploadItem">
        <!-- video -->
        <div v-if="state.type === 'video'">
          <el-link
            :href="state.value"
            target="_blank"
            style="padding: 5px"
          >
            <i class="el-icon-document">{{ state.value }}</i>
          </el-link>
        </div>
        <!-- image -->
        <div v-else-if="state.type === 'image'">
          <el-image
            style="height: 50px; width: 50px; margin-right: 10px"
            :src="state.value"
            fit="scale-down"
          />
        </div>
        <!-- XlsxFile -->
        <div v-else-if="state.type === 'xlsx'">
          <el-link
            :href="state.value"
            target="_blank"
          />
        </div>

        <!-- others-->
        <div v-else>
          <el-link
            :href="state.value"
            target="_blank"
            style="padding: 5px"
          >
            <i class="el-icon-document">{{ state.value }}</i>
          </el-link>
        </div>
        <!-- 上传按钮 -->
        <el-upload
          v-if="fileList.length === 0"
          ref="upload"
          :action="''"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="onSuccess"
        >
          <el-button type="primary">
            {{ state.title || btnText }}
          </el-button>
        </el-upload>
      </div>
    </template>
    <!-- display board -->
    <!-- video -->
    <video
      v-if="state.type === 'video'"
      :src="fileUrl"
      style="width: 95%; height: auto"
      controls="controls"
    />
    <!-- image -->
    <div
      v-else-if="state.type === 'image'"
      style="display: flex"
    >
      <div
        v-if="imageUrl"
        :style="{
          width: imgInfo.width + 'px',
          height: imgInfo.height + 'px',
          flex: 'none'
        }"
      >
        <!-- <VueCropper
          ref="cropper"
          :src="fileUrl"
          :can-scale="state.canScale"
          :can-move="state.canMove"
          :auto-crop="state.autoCrop"
          :auto-crop-width="state.width"
          :auto-crop-height="state.height"
          :fixed="state.fixed"
          :fixed-number="state.fixedNumber"
          :fixed-box="state.fixedBox"
          :center-box="state.centerBox"
          :output-type="state.outputType"
          @realTime="realTime"
        /> -->
        <img
          :src="fileUrl"
          alt=""
        >
      </div>
      <div
        v-if="previews"
        :style="{
          width: previews.w + 'px',
          height: previews.h + 'px',
          overflow: 'hidden',
          'margin-left': '20px',
          flex: 'none'
        }"
      >
        <div :style="previews.div">
          <img
            :src="previews.url"
            :style="previews.img"
          >
        </div>
      </div>
    </div>
    <!-- XlsxFile -->
    <div
      v-else-if="state.type === 'xlsx'"
      id="excel-file-box"
    >
      <table
        v-if="tableBody.length || tableHeader.length"
        id="excel-display-table"
      >
        <tr>
          <th
            v-for="(item, index) in tableHeader"
            :key="index"
          >
            {{ item }}
          </th>
        </tr>
        <tr
          v-for="(itemBody, indexBody) in currentPageTableBody"
          :key="indexBody"
        >
          <td
            v-for="(itemBodyItem, indexBodyIndex) in itemBody"
            :key="indexBodyIndex"
          >
            {{ itemBodyItem }}
          </td>
        </tr>
      </table>
      <el-pagination
        v-if="tableBody.length"
        class="excel-display-pager"
        :current-page="currentPage"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableBody.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- others-->
    <div v-else>
      <i class="el-icon-document">{{ fileUrl }}</i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import UploadState from './UploadState'
import { runAction } from '@/arkfbp'
import { VueCropper } from 'vue-cropper'
import XLSX from 'xlsx'
import processTableData from '@/utils/readexcel'
import BaseVue from '@/admin/base/BaseVue'

@Component({
  name: 'Upload',
  components: { VueCropper }
})
export default class extends Mixins(BaseVue) {
  btnText = '上传文件';
  dialogVisible = false;
  fileList = [] as any[];
  fileUrl = '';
  file = '';
  valueBind = '';

  imageUrl = '';
  imgInfo = {};
  previews = null;
  bili = 1;
  crop = '';

  fileName = '';
  pagesize = 5;
  currentPage = 1;
  tableHeader = [] as any[];
  tableBody = [] as any[];

  get state(): UploadState {
    return this.$state as UploadState
  }

  get currentPageTableBody() {
    return this.tableBody.slice(
      (this.currentPage - 1) * this.pagesize,
      this.currentPage * this.pagesize - 1
    )
  }

  onSuccess(file: any, fileList: []) {
    if (fileList.length > 0) {
      this.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的csv文件
    }
    this.fileUrl = URL.createObjectURL(file.raw)
    this.dialogVisible = true
    if (this.state.type === 'xlsx') {
      this.fileName = file.name
      // 读取Excel文件内容并显示
      const f = file.raw
      this.state.file = file
      const reader = new FileReader()
      let jsonobject
      reader.onload = (e: any) => {
        const data = e.target.result
        const workbook = XLSX.read(data, {
          type: 'binary'
        })
        jsonobject = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]]
        )
        const tableData = processTableData(jsonobject)
        this.tableHeader = tableData[0]
        this.tableBody = tableData[1]
      }
      reader.readAsBinaryString(f)
    }
    if (this.state.type === 'image') {
      const imageUrl = URL.createObjectURL(file.raw)
      const img = new Image()
      img.src = imageUrl
      const vm = this
      img.onload = function() {
        const maxL = 800
        let maxlength = img.height
        if (img.width > img.height) {
          maxlength = img.width
        }
        if (maxlength > maxL) {
          vm.bili = maxL / maxlength
        }
        vm.$set(vm.imgInfo, 'width', Math.round(img.width * vm.bili))
        vm.$set(vm.imgInfo, 'height', Math.round(img.height * vm.bili))
        vm.imageUrl = imageUrl
      }
    }
  }

  realTime(data: any) {
    this.previews = data
  }

  handleSizeChange(pageSize: number) {
    this.pagesize = pageSize
  }

  handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage
  }
}
</script>

<style lang="scss" scoped>
.uploadItem {
  display: flex;
  align-items: center;
}
.uploadImage {
  height: 50px;
  width: 50px;
  margin-right: 10px;
}
#excel-display-table {
  width: 100%;
  border: 1px solid #ccc;
}
#excel-display-table > tr {
  display: flex;
}
#excel-display-table > tr:nth-child(odd) {
  background-color: #f2f2f2;
}
#excel-display-table > tr > th {
  border-bottom: 1px solid #ccc;
}
#excel-display-table > tr > td,
#excel-display-table > tr > th {
  flex: 1;
  text-align: center;
  line-height: 30px;
}
.excel-display-pager {
  margin-top: 20px;
}
</style>
