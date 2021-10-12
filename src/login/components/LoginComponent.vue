<template>
  <el-dialog
    class="login"
    :visible="true"
    :show-close="false"
    center
    width="450px"
    :fullscreen="fullscreen"
  >
    <div class="tenant-info">
      <el-image
        class="login-image"
        :src="icon || defaultIcon"
      />
      <span class="login-title">
        {{ title }}
      </span>
    </div>
    <el-tabs
      v-if="pageConfig"
      v-model="tabIndex"
      stretch
      @tab-click="handleTabClick"
    >
      <el-tab-pane
        v-for="(cform, index) in pageConfig.forms"
        :key="index"
        :ref="`${page}${index}`"
        :label="cform.label"
        :name="index.toString()"
      >
        <el-form
          :model="form"
          :rules="rules"
        >
          <template v-for="(item, itemIndex) in cform.items">
            <el-form-item
              v-if="item.type !== 'hidden'"
              :key="itemIndex"
              :prop="item.name"
            >
              <el-input
                v-model="form[item.name]"
                :type="item.type"
                :name="item.name"
                :placeholder="item.placeholder"
                :show-password="item.type === 'password'"
                @copy.native.capture="onCopy($event, item.name)"
              >
                <login-button
                  v-if="item.append"
                  slot="append"
                  :config="item.append"
                  :action="btnClickHandler"
                  :is-change-delay="isChangeDelay"
                />
              </el-input>
              <img
                v-if="item.name === 'code' && !item.append"
                :src="imageCodeSrc"
                alt=""
                @click="getImageCode"
              >
            </el-form-item>
          </template>
          <login-button
            :long="true"
            :config="cform.submit"
            :action="btnClickHandler"
          />
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <div
      v-if="pageConfig.bottoms"
      class="form-bottom"
    >
      <login-button
        v-for="(bottom, bottomIndex) in pageConfig.bottoms"
        :key="bottomIndex"
        :config="bottom"
        :action="btnClickHandler"
        type="text"
        class="form-bottom-button"
      />
    </div>
    <div
      v-if="pageConfig.extend"
      class="third-login"
    >
      <el-divider>{{ pageConfig.extend.title }}</el-divider>
      <login-button
        v-for="(btn, btnIndex) of pageConfig.extend.buttons"
        :key="btnIndex"
        :config="btn"
        :action="btnClickHandler"
        type="text"
      />
    </div>
    <el-dialog
      v-if="btn.agreement"
      :visible="agreementVisible"
      :title="btn.agreement.title"
      :show-close="false"
      class="agreement"
      center
      :modal="false"
      :fullscreen="fullscreen"
    >
      <div
        class="content"
        v-html="btn.agreement.content"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="agreementVisible = false">
          不同意
        </el-button>
        <el-button
          type="primary"
          @click="agree"
        >
          同意
        </el-button>
      </div>
    </el-dialog>
    <div class="copyright">
      Copyright © 2021 All Rights Reserved. 龙归科技 版权所有
    </div>
  </el-dialog>
</template>

<script lang="ts" src="./LoginComponent.ts" />

<style lang="scss" scoped>
.tenant-info,
.copyright {
  position: fixed;
  left: 0;
  width: 100%;
  height: 60px;
  font-family: 'PingFang SC';
  line-height: 60px;
}

.tenant-info {
  top: 0;
  background-color: #fff;
  padding-left: 20px;
}

.copyright {
  bottom: 0;
  background-color: #F0F2F5;
  font-size: 12px;
  font-family: 'PingFang SC';
  color: #909399;
  text-align: center;
}

.login {
  text-align: center;
  margin: 0 auto;
  background-color: #0f62ea;
  background-image: url('../../assets/bgc.png');
  background-size: contain;

  &-image {
    width: 32px;
    height: 32px;
    vertical-align: middle;
  }

  &-title {
    color: #303133;
    display: inline-block;
    vertical-align: middle;
    margin-left: 15px;
    font-size: 20px;
    font-family: PingFang SC;
    font-weight: 800;
  }

  ::v-deep .el-dialog {
    margin-top: 200px !important;
    width: 500px !important;
    .el-dialog__header {
      border-radius: 8px 8px 0 0;
      padding: 0px;
    }
    .el-dialog__body {
      border-radius: 8px;
      padding: 56px;
    }
  }
}

.form-bottom {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  flex-direction: row-reverse;

  &-button {
    margin-left: 0px;
  }
}

.third-login {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

::v-deep .el-form-item.authcode {
  .el-form-item__content {
    display: flex;
    align-items: center;
    input {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    img {
      width: 120px;
      cursor: pointer;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
}

::v-deep .el-form-item {
  img {
    display: none;
  }
}

::v-deep .agreement {
  .el-dialog__title {
    font-size: 1.5em;
    font-weight: bold;
    color: gray;
  }
}
</style>
