<template>
  <el-dialog
    class="login"
    :visible="true"
    :show-close="false"
    center
    width="450px"
    :fullscreen="fullscreen"
  >
    <div slot="title">
      <el-image
        class="login-image"
        :src="icon"
      />
      <h2 class="login-title">
        {{ title }}
      </h2>
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
              :class="{'authcode': isNeedImageCode(item)}"
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
  </el-dialog>
</template>

<script lang="ts" src="./LoginComponent.ts" />

<style lang="scss" scoped>
.login {
  text-align: center;
  margin: 0 auto;

  &-image {
    width: 60px;
    height: 60px;
  }

  &-title {
    color: gray;
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
