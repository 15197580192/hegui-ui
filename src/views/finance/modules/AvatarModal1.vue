<template>
  <a-modal
    title="识别结果"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    :width="800"
    :footer="null"
    @cancel="cancelHandel">
    <a-row>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <!-- <a-spin :spinning="false"> -->
        <vue-cropper
          ref="cropper"
          :img="options.img"
          :info="true"
          :autoCrop="options.autoCrop"
          :autoCropWidth="options.autoCropWidth"
          :autoCropHeight="options.autoCropHeight"
          :fixedBox="options.fixedBox"
          @realTime="realTime"
        >
        </vue-cropper>
        <!-- </a-spin> -->
      </a-col>
      <a-col :xs="24" :md="12" :style="{height: '350px'}">
        <a-card style='height: 350px;overflow: auto'>
          <div>
            <a-tabs v-model:activeKey="activeKey">
              <a-tab-pane key="1" tab="识别结果">{{ recognize }}</a-tab-pane>
              <a-tab-pane key="2" tab="风险" force-render>{{ risks }}</a-tab-pane>
            </a-tabs>
          </div>
        </a-card>
        <!--        <div class="avatar-upload-preview">-->
        <!--          <img :src="previews.url" :style="previews.img"/>-->
        <!--        </div>-->
      </a-col>
    </a-row>
    <br>
    <a-row>
      <a-col :lg="2" :md="2">
        <a-upload name="file" :beforeUpload="beforeUpload" :showUploadList="false">
          <a-button icon="upload">选择图片</a-button>
        </a-upload>
      </a-col>
      <a-col :lg="{span: 1, offset: 2}" :md="2">
        <a-button icon="plus" @click="changeScale(1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="minus" @click="changeScale(-1)"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="undo" @click="rotateLeft"/>
      </a-col>
      <a-col :lg="{span: 1, offset: 1}" :md="2">
        <a-button icon="redo" @click="rotateRight"/>
      </a-col>
      <a-col :lg="{span: 2, offset: 6}" :md="2">
        <a-button type="primary" @click="finish('blob')">保存</a-button>
      </a-col>
    </a-row>
  </a-modal>
</template>
<script>
import { ref } from 'vue'
// import {ocrRecognize} from '@/api/invoice'
export default {
  data () {
    return {
      visible: false,
      id: null,
      confirmLoading: false,
      fileList: [],
      uploading: false,
      options: {
        // img: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        img: '',
        autoCrop: false,
        autoCropWidth: 200,
        autoCropHeight: 200,
        fixedBox: true
      },
      recognize: '暂无识别结果，请先上传发票图片',
      risks: '暂无风险，请先上传发票图片',
      previews: {},
      activeKey: ref('1'),
      imgSize: 4
    }
  },
  methods: {
    edit (id) {
      this.visible = true
      this.id = id
      /* 获取原始头像 */
    },
    close () {
      this.id = null
      this.visible = false
    },
    cancelHandel () {
      this.close()
    },
    changeScale (num) {
      num = num || 1
      this.$refs.cropper.changeScale(num)
    },
    rotateLeft () {
      this.$refs.cropper.rotateLeft()
    },
    rotateRight () {
      this.$refs.cropper.rotateRight()
    },
    beforeUpload (file) {
      console.log(file)
      var isStopRun = false
      var fileType = file.type
      if (fileType.indexOf('image') < 0) {
        this.$message.warning('请上传图片')
        isStopRun = true
        return false
      }
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg'
      if (!isJpgOrPng) {
        this.$message.error('你上传图片格式不正确!')
        isStopRun = true
      }
      const isLtSize = file.size < this.imgSize * 1024 * 1024
      if (!isLtSize) {
        this.$message.error('图片大小不能超过' + this.imgSize + 'MB!')
        isStopRun = true
      }
      if (isStopRun) {
        return false
      }
      // 上传图片
      this.upload(file)
      // 转化为blob
      // reader.readAsArrayBuffer(file)
      return false
    },
    // 上传图片
    upload (file) {
      const formData = new FormData()
      formData.append('file', file, this.fileName)
      // this.$http.post('https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      this.$http.post('http://localhost:8081/hegui/api/invoice/recognize', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .then((response) => {
          console.log('upload response:', response)
          // var res = response.data
          // if (response.status === 'done') {
          //   _this.imgFile = ''
          //   _this.headImg = res.realPathList[0] // 完整路径
          //   _this.uploadImgRelaPath = res.relaPathList[0] // 非完整路径
          //   _this.$message.success('上传成功')
          //   this.visible = false
          // }
          if (response.code === 200) {
            // 预览图片
            const reader = new FileReader()
            console.log(file)
            // 把Array Buffer转化为blob 如果是base64不需要
            // 转化为base64
            reader.readAsDataURL(file)
            reader.onload = () => {
              this.options.img = reader.result
              this.recognize = response.data.recognize
              this.risks = response.data.risk
            }
            this.$message.success('上传成功')
            this.$emit('ok', response.url)
          } else {
            this.$message.error('上传失败')
          }
          // _this.visible = false
        })
    },

    // 上传图片（点击上传按钮）
    finish (type) {
      console.log('finish')
      const _this = this
      const formData = new FormData()
      // 输出
      if (type === 'blob') {
        this.$refs.cropper.getCropBlob((data) => {
          const img = window.URL.createObjectURL(data)
          this.model = true
          this.modelSrc = img
          console.log(data)
          formData.append('file', data, this.fileName)
          // this.$http.post('https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
          this.$http.post('http://localhost:8081/hegui/api/invoice/uploadImg', formData, { contentType: false, processData: false, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then((response) => {
              console.log('upload response:', response)
              // var res = response.data
              // if (response.status === 'done') {
              //   _this.imgFile = ''
              //   _this.headImg = res.realPathList[0] // 完整路径
              //   _this.uploadImgRelaPath = res.relaPathList[0] // 非完整路径
              //   _this.$message.success('上传成功')
              //   this.visible = false
              // }
              _this.$message.success('上传成功')
              _this.$emit('ok', response.url)
              // _this.visible = false
            })
        })
      } else {
        this.$refs.cropper.getCropData((data) => {
          this.model = true
          this.modelSrc = data
        })
      }
    },
    okHandel () {
      const vm = this

      vm.confirmLoading = true
      setTimeout(() => {
        vm.confirmLoading = false
        vm.close()
        vm.$message.success('上传头像成功')
      }, 2000)
    },

    realTime (data) {
      this.previews = data
    }
  }
}
</script>

<style lang="less" scoped>

  .avatar-upload-preview {
    position: absolute;
    top: 50%;
    transform: translate(50%, -50%);
    width: 180px;
    height: 180px;
    border-radius: 50%;
    box-shadow: 0 0 4px #ccc;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
