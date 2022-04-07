<template>
  <div>
    <div class="upload-item">
      <el-image
        v-if="state.type === 'image'"
        style="height: 50px; width: 50px; margin-right: 10px"
        :src="state.value"
        fit="scale-down"
      />
      <el-link
        v-else-if="state.value"
        :href="state.value"
        target="_blank"
        style="padding: 5px"
      >
        <i class="el-icon-document">{{ state.value }}</i>
      </el-link>
      <!-- 上传按钮 -->
      <el-upload
        v-if="fileList.length === 0"
        ref="upload"
        action=""
        :show-file-list="false"
        :auto-upload="false"
        :on-change="onSuccess"
      >
        <el-button type="primary">
          {{ state.title || btnText }}
        </el-button>
      </el-upload>
    </div>
    <!-- image -->
    <div
      v-if="state.type === 'image'"
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
        <img
          :src="imageUrl"
          alt=""
        >
      </div>
    </div>
    <!-- xlsx -->
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
        layout="total, sizes, prev, pager, next"
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
import { readExcel } from '@/utils'
import BaseVue from '@/admin/base/BaseVue'
import { xlsxValidator } from '@/utils/rules'
import * as xlsx from 'xlsx'

@Component({
  name: 'Upload'
})
export default class extends Mixins(BaseVue) {
  btnText = '上传文件'
  fileList = [] as any[]
  fileUrl = ''

  imageUrl = ''
  imgInfo = {}
  bili = 1
  crop = ''

  fileName = ''
  pagesize = 5
  currentPage = 1
  tableHeader = [] as any[]
  tableBody = [] as any[]

  get state(): UploadState {
    return this.$state as UploadState
  }

  get currentPageTableBody() {
    return this.tableBody.slice(
      (this.currentPage - 1) * this.pagesize,
      this.currentPage * this.pagesize - 1
    )
  }

  async onSuccess(file: any, fileList: []) {
    if (fileList.length > 0) {
      this.fileList = [fileList[fileList.length - 1]] // 这一步，是 展示最后一次选择的文件
    }
    this.fileUrl = URL.createObjectURL(file.raw)
    this.fileName = file.name
    // 读取Excel文件内容并显示
    if (this.state.type === 'xlsx') {
      await this.readxlsx(file)
    }
    // 展示图片
    if (this.state.type === 'image') {
      this.previewImage(file)
    }
  }

  async readxlsx(file: any) {
    const dataBinary = await this.readFile(file.raw)
    const workBook = xlsx.read(dataBinary, { type: 'binary', cellDates: true })
    const workSheet = workBook.Sheets[workBook.SheetNames[0]]
    const data = xlsx.utils.sheet_to_json(workSheet)
    const { tableHeader, tableBody } = readExcel(data)
    const valid = xlsxValidator(tableHeader, tableBody)
    if (!valid) {
      this.$message({
        message: '该文件包含不规则内容',
        type: 'error',
        showClose: true
      })
    } else {
      this.tableHeader = tableHeader
      this.tableBody = tableBody
      this.state.file = file.raw
    }
  }

  async readFile(file: any) {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsBinaryString(file)
      reader.onload = (e: any) => {
        resolve(e.target.result)
      }
    })
  }

  previewImage(file: any) {
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

  handleSizeChange(pageSize: number) {
    this.pagesize = pageSize
  }

  handleCurrentChange(currentPage: number) {
    this.currentPage = currentPage
  }
}
</script>

<style lang="scss" scoped>
.upload-item {
  display: flex;
  align-items: center;
}
.upload-image {
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
