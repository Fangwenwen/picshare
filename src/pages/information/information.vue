<template>
  <div class="information">
    <my-header
      :showBack="true"
      title="Profile your information"
      @clicked="back">
    </my-header>
    <div class="photo-box">
      <input type="file"
             accept="image/png, image/jpeg, image/jpg"
             class="blank"
             ref="files"
             @change="changeImg">
      <img :src="userInfo.src" alt="default" class="default-photo">
      <span class="photo-tips">Change Photo</span>
    </div>
    <div class="info-box">
      <set-username v-model="userInfo.username"></set-username>
      <cell
        title="Birthday"
        placeholder="Set your birthday"
        :des="userInfo.birthday"
        @clicked="setBirthday">
      </cell>
      <set-gender v-model="userInfo.gender"></set-gender>
    </div>
    <my-button
      :width="528" :height="72" :fontSize="36"
      @clicked="update">
      SAVE
    </my-button>
    <!--<span class="next">Skip</span>-->
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader' // 头部
  import Cell from '../../components/cell/cell'
  import SetUsername from '../../components/setUsername/setUsername'
  import SetGender from '../../components/setGender/setGender'
  import MyButton from '../../components/myButton/myButton'
  import {mapGetters, mapMutations} from 'vuex'
  import {getUserInfo, imgUpload, updateUserInfo} from '../../api/user'
  import {getObjectURL, setStorage, getStorage} from '../../common/js/util'

  const SRC = "../../assets/img/default-photo.png"

  export default {
    created() {
      this._userInfo = this.user.username ? this.user : getStorage('user')
      this.userInfo = {
        src: this._userInfo.picture || SRC,
        username: this._userInfo.name,
        birthday: this._userInfo.birthday,
        gender: this._userInfo.gender
      }
    },
    data() {
      return {
        formData: new FormData(),
        userInfo: {}
      }
    },
    computed: {
      ...mapGetters([
        'user'
      ])
    },
    methods: {
      ...mapMutations([
        'setUser'
      ]),
      back() {
        this.$router.back()
      },
      // 更换头像 临时
      changeImg() {
        this.file = this.$refs.files.files[0]
        console.log(this.file.size)
        let size = Math.floor(this.file.size / 1024)
        if (size > 5 * 1024) {
          this.$toast({
            message: 'Please select photos within 5M'
          })
          return
        }
        let newUrl = getObjectURL(this.file)
        this.userInfo.src = newUrl
      },
      // 设置生日
      setBirthday() {
        if (!this.datePicker) {
          this.datePicker = this.$createDatePicker({
            title: 'Birthday',
            min: new Date(1900, 1, 1),
            max: new Date(),
            value: new Date(),
            onSelect: this.selectHandle
          })
        }
        this.datePicker.show()
      },
      selectHandle(date, selectedVal) {
        this.userInfo.birthday = selectedVal.join('-')
      },
      // 更新用户信息
      async update() {
        let result
        if (this.file) {
          this.formData.append('file', this.file)
          try {
            result = await imgUpload(this.formData)
            this.userInfo.src = result.url
          } catch (err) {
            console.log(err)
          }
        }
        try {
          result = await updateUserInfo(this._userInfo.username, this.userInfo.username, this.userInfo.birthday, this.userInfo.gender, this.userInfo.src)
          this.setUser(result) // 更新全局中的用户信息
          setStorage('user', result) // 更新 localStorage中的用户信息
          this.$toast({
            message: '修改成功'
          })
        } catch (err) {
          console.log(err)
        }
      }
    },
    components: {
      MyHeader,
      Cell,
      SetUsername,
      SetGender,
      MyButton
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .information {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding-top: pxToRem(286);

    .photo-box {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: pxToRem(96);

      .blank {
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        @include wh(160, 160);
        opacity: 0;
        font-size: pxToRem(0);
      }

      .default-photo {
        @include wh(160, 160);
        border-radius: 50%;
        object-fit: cover; // 图片在保持其宽高比的同时填充元素的整个内容框。如果对象的宽高比与内容框不相匹配，该对象将被剪裁以适应内容框
        margin-bottom: pxToRem(32);
      }

      .photo-tips {
        @include font-color(roboto regular, 28, #b2b2b2);
      }
    }

    .info-box {
      width: 100%;
      margin-bottom: pxToRem(96);
    }

    .next {
      @include font-color(roboto regular, 24, #587ba1);
      padding-right: pxToRem(25);
      background: url("./skip-icon.png") no-repeat right center;
      background-size: pxToRem(25) pxToRem(17);
      margin-top: pxToRem(64);
    }
  }
</style>
