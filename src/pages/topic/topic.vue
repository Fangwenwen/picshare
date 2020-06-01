<template>
  <div class="topic">
    <my-header
      :showBack="true"
      @clicked="back">
    </my-header>
    <div class="topic-wrapper">
      <div class="my-topic topic-item" ref="myTopic" v-if="type==='my'">
        <p class="title">
          <span class="text">My topics</span>
          <span class="more" @click="more"></span>
        </p>
        <ul class="list">
          <li class="item add-item" @click="showFlag=true"></li>
          <li class="item" v-for="(item,index) in myTopicList" :key="index" @click="save(item)">
            {{item}}
          </li>
        </ul>
      </div>
      <div class="topic-list" ref="topicList">
        <div class="topic-item" v-for="(item,index) in topicList" :key="index">
          <p class="title">
            <span class="text">{{item.category}}</span>
            <span class="more" @click="more(index)"></span>
          </p>
          <ul class="list">
            <li class="item" v-for="val in item.tag_list" @click="select(val)">
              {{val}}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <add-topic
      v-if="showFlag"
      @cancel="showFlag=false"
      @save="save">
    </add-topic>
  </div>
</template>

<script>
  import MyHeader from '../../components/myHeader/myHeader'
  import AddTopic from '../../components/addTopic/addTopic'
  import {mapMutations} from 'vuex'
  import {getMyTopicList, getTopicList} from '../../api/picture'

  const topicItemHeight = 228,
    titleHeight = 48,
    gapHeight = 20

  export default {
    data() {
      return {
        type: '', // 判断是否显示我的话题
        showFlag: false, // 控制添加话题组件的显示
        myTopicList: [], // 我的话题列表
        topicList: [] // 分类话题列表
      }
    },
    created() {
      this.type = this.$route.query.type
      if (this.type === 'my') {
        this.getMyTopicList()
      }
      this.getTopicList()
    },
    methods: {
      ...mapMutations([
        'addTopic'
      ]),
      back() {
        this.$router.back()
      },
      // 点击,展开或收起
      more(index) {
        let topicItem
        if (index >= 0) {
          topicItem = this.$refs.topicList.children[index]
        } else {
          topicItem = this.$refs.myTopic
        }
        let more = topicItem.getElementsByClassName('more')[0]
        let listHeight = topicItem.getElementsByClassName('list')[0].clientHeight
        if (more.classList.contains('open')) {
          topicItem.style.maxHeight = topicItemHeight / 100 + 'rem'
          more.classList.remove('open')
        } else {
          topicItem.style.maxHeight = titleHeight + gapHeight + listHeight + 'px'
          more.classList.add('open')
        }
      },
      select(topic) {
        if (this.type === 'my') {
          this.save(topic)
        } else {
          this.$router.push({
            path: `/topic-detail/${topic}`
          })
        }
      },
      // 选择话题
      save(topic) {
        this.addTopic(topic)
        this.$router.back()
      },
      // 获取我的话题列表
      getMyTopicList() {
        getMyTopicList().then((res) => {
          this.myTopicList = res.tag_list
        }).catch((err) => {
          console.log(err)
        })
      },
      // 获取分类话题列表
      getTopicList() {
        getTopicList().then((res) => {
          this.topicList = res
        }).catch((err) => {
          console.log(err)
        })
      }
    },
    components: {
      MyHeader,
      AddTopic
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/css/variable.scss';

  .topic {
    padding-top: pxToRem(112);

    .topic-wrapper {
      padding: pxToRem(24) pxToRem(24) 0;

      .topic-item {
        max-height: pxToRem(228);
        overflow: hidden;
        margin-bottom: pxToRem(28);
        transition: max-height 0.3s;

        .title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: pxToRem(48);
          margin-bottom: pxToRem(20);

          .text {
            @include font-color(roboto medium, 32, #444);
          }

          .more {
            @include wh(24, 24);
            background: url("./more.png") no-repeat center center;
            background-size: pxToRem(24) pxToRem(24);
            transition: transform 0.3s;
          }

          .more.open {
            transform: rotate(-180deg);
          }
        }

        .list {
          display: flex;
          flex-wrap: wrap;

          .item {
            @include font-color(roboto regular, 24, #3b589a);
            height: pxToRem(60);
            line-height: pxToRem(60);
            padding: 0 pxToRem(32);
            border: 1px solid #efefef;
            border-radius: pxToRem(60);
            margin: 0 pxToRem(20) pxToRem(20) 0;
          }
        }
      }

      .my-topic.topic-item {
        .title {
          .text {
            color: #8ae1d9;
          }
        }

        .list {
          .item.add-item {
            padding: 0;
            border: none;
            @include wh(112, 60);
            background: url("./add.png") no-repeat center;
            background-size: pxToRem(112) pxToRem(60);
          }
        }
      }
    }
  }
</style>
