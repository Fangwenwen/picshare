<template>
  <div class="publish">
    <my-header
      :showBack="true"
      :showBtn="true"
      @clicked="back">
      <my-button
        :width="144" :height="60"
        :fontSize="32"
        :disabled="disabled"
        @clicked="post">
        Post
      </my-button>
    </my-header>
    <div class="content">
      <textarea
        placeholder="What would you like to share?"
        class="text"
        :value="content"
        @input="setContent($event.target.value)">
      </textarea>
      <div class="img-list">
        <div class="img-item" v-for="(item,index) in urlList" :key="index">
          <img :src="item" alt="">
          <span class="delete" @click="remove(index)"></span>
        </div>
        <div class="add-img" v-if="urlList.length<9">
          <input type="file"
                 accept="image/png, image/jpeg, image/jpg"
                 multiple
                 class="blank"
                 ref="files"
                 @change="selectImg">
        </div>
      </div>
      <div class="topic">
        <span class="title">Topic</span>
        <router-link class="des" tag="span" to="/topics?type=my">{{tag}}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader'
  import MyButton from '../../components/myButton/myButton'
  import {mapGetters, mapMutations} from 'vuex'
  import {getStorage} from '../../common/js/util'
  import {imgListUpload, publish, deleteStatus} from '../../api/picture'

  export default {
    created() {
      this.authorId = this.user.id || getStorage('user').id // 登录用户的id
    },
    computed: {
      ...mapGetters([
        'user',
        'topic',
        'content',
        'fileList',
        'urlList'
      ]),
      tag() { // 话题
        return this.topic.length === 0 ? 'Add related topics' : `#${this.topic[0]}`
      },
      disabled() { // post 按钮是否可点
        return this.topic.length === 0 || this.fileList.length === 0
      }
    },
    methods: {
      ...mapMutations([
        'setContent',
        'clearTopic',
        'addFiles',
        'removeOneFile'
      ]),
      back() {
        this.reset()
        this.$router.back()
      },
      // 发布动态
      async post() {
        this.formData = new FormData()
        this.fileList.forEach((item) => {
          this.formData.append('image', item)
        })
        let result
        try {
          result = await imgListUpload(this.formData)
          this.picList = result.picture_list
          result = await publish(this.authorId, this.content, this.picList, this.topic)
          console.log(result)
          this.reset()
          this.$router.push({
            path: '/home/recommend'
          })
        } catch (err) {
          console.log(err)
        }
      },
      // 选择图片
      selectImg() {
        let fileList = this.$refs.files.files
        console.log(fileList)
        console.log(this.fileList)
        if (fileList.length + this.fileList.length > 9) {
          this.$toast({
            message: 'You can only select 9 photos'
          })
          return
        }
        for (let i = 0; i < fileList.length; i++) {
          let size = Math.floor(fileList[i].size / 1024)
          if (size > 5 * 1024) {
            this.$toast({
              message: 'Please select photos within 5M'
            })
            return
          }
        }
        this.addFiles(Array.from(fileList))
      },
      remove(index) {
        this.removeOneFile(index)
      },
      // 清空文章内容、话题
      reset() {
        this.setContent('')
        this.clearTopic()
      }
    },
    components: {
      MyHeader,
      MyButton
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .publish {
    padding-top: pxToRem(112);

    .content {
      width: 100%;
      padding: pxToRem(24) pxToRem(24) 0;

      .text {
        @include font-color(roboto regular, 28, #444);
        width: 100%;
        height: pxToRem(240);
        padding: pxToRem(8);
        resize: none;
        border: none;
        margin-bottom: pxToRem(24);
      }

      ::-webkit-input-placeholder {
        color: #c7c7c7;
      }

      .img-list {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: pxToRem(30);

        .img-item {
          position: relative;
          @include wh(212, 212);
          margin-right: pxToRem(18);
          margin-bottom: pxToRem(18);

          &:nth-child(3n) {
            margin-right: 0;
          }

          img {
            width: 100%;
            height: 100%;
            border-radius: pxToRem(6);
            object-fit: cover; // 图片在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框
          }

          .delete {
            position: absolute;
            top: pxToRem(8);
            right: pxToRem(8);
            @include wh(40, 40);
            background: url("./delete.png") no-repeat center;
            background-size: pxToRem(40) pxToRem(40);
          }
        }

        .add-img {
          display: flex;
          @include wh(212, 212);
          background: url("./add.png") no-repeat center #f3f3f3;
          background-size: pxToRem(56) pxToRem(56);
          border-radius: pxToRem(6);

          .blank {
            width: 100%;
            height: 100%;
            opacity: 0;
            font-size: pxToRem(0);
          }
        }
      }

      .topic {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        height: pxToRem(96);
        border-top: 1px solid #f1f1f1;

        .title {
          @include font-color(roboto regular, 32, #333);
          padding-left: pxToRem(64);
          background: url("./topic-icon.png") no-repeat left center;
          background-size: pxToRem(48) pxToRem(48);
        }

        .des {
          @include font-color(roboto regular, 28, #7e7e7e);
          padding-right: pxToRem(40);
          background: url("./arrow.png") no-repeat right center;
          background-size: pxToRem(24) pxToRem(24);
        }
      }
    }
  }
</style>
