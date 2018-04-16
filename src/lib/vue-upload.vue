<template>
  <div class="upload">
    <div class="button">
      <form :id="`form${n}`" method="post" :action="url" enctype="multipart/form-data">
        <input 
            :disabled="disable" 
            type="file" 
            name="file" 
            :id="`upload${n}`" 
            :filename="value" 
            @change="upload($event)"/>
        <label :for="`upload${n}`">{{value}}</label>
      </form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      xhr: new XMLHttpRequest(),
      fileListTotal: [],
      file: {},
      n: new Date().getTime()
    }
  },
  methods: {
    upload(ev) {
      if (window.FormData) {
        let e = ev || window.event
        let fd = new FormData()
        fd.append("file", e.target.files[0])
        if (!e.target.files[0]) {
          return
        }
        // 监听事件
        // this.xhr.upload.addEventListener("progress", this.uploadProgress, false)
        this.xhr.addEventListener("load", this.uploadComplete, false)
        this.xhr.addEventListener("error", this.uploadFailed, false)

        // 发送文件和自定义参数
        this.xhr.open("POST", this.url, {})
        this.xhr.send(fd)
      } else { // ie 9
        let form = document.getElementById(`form${this.n}`)
        let iframe = document.createElement('iframe')
        iframe.width = 0
        iframe.height = 0
        iframe.border = 0
        iframe.name = `form-iframe${this.n}`
        iframe.id = `form-iframe${this.n}`
        iframe.setAttribute("style", "width:0;height:0;border:none")
        document.body.appendChild(iframe)
        form.target = `form-iframe${this.n}`
        form.submit()
        let that = this
        iframe.onload = function() {
          let res = JSON.parse(iframe.contentDocument.body.textContent || iframe.contentWindow.document.body.textContent)
          if (res.code === '2000') {
            that.$emit('uploadSuccess', { res: res })
          } else {
            this.uploadFail(res)
          }
          form.reset()
        }
      }
    },
    uploadComplete(event) {
      let res = JSON.parse(event.target.response)
      if (res.code === "2000") {
        this.$emit('uploadSuccess', { res: res })
        document.getElementById(`form${this.n}`).reset()
      } else {
        this.$emit('uploadFail', { res: res })
        document.getElementById(`form${this.n}`).reset()
      }
    },
    uploadFailed(event) {
      let res = JSON.parse(event.target.response)
        this.$emit('uploadFail', { res: res })
    }
  },
  props: {
    value: {                        // 上传文件按钮显示的文字
      type: String,
      default: '选择文件'
    },
    url: {                          // 上传文件路径
      type: String,
      required: true
    },                              // 是否禁用
    disable: {
      type: Boolean,
      default: false
    }
  }
}
</script>
<style lang="stylus" scoped>
.upload
  background #00b7ee
  border-radius 3px
  display inline-block
  color #fff
  font-size 16px
  width 100px
  height 30px
  line-height 30px
  .button
    input
      display none
    label
      position relative
      display inline-block
      cursor pointer
      text-align center
      width 100%
      height 100%
</style>
