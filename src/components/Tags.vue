<template>
  <div class="tags">
    <el-tag
      class="tag"
      size="medium"
      v-for="(item, index) in tags"
      :key="item.path"
      :closable="index > 0"
      :effect="item.title == $route.meta.tTitle ? 'dark' : 'plain'"
      @click="goTo(item.path)"
      @close="close(index)"
      :disable-transitions="true"
    >
      <i class="circular" v-show="item.title == $route.meta.tTitle"></i>
      {{ item.title }}</el-tag
    >
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Tags',
  data() {
    return {
      tags: [{ title: '首页', path: '/welcome' }],
    }
  },
  watch: {
    $route: {
      immdeicat: true,
      handler(val) {
        const boolean = this.tags.find(item => {
          return val.path == item.path
        })
        if (!boolean) {
          this.tags.push({
            title: val.meta.tTitle,
            path: val.path,
          })
        }
      },
    },
  },
  computed: {},
  methods: {
    // 点击跳转到指定位置
    goTo(path) {
      this.$router.push(path)
    },
    // 点击关闭
    close(i) {
      if (this.tags[i].path == this.$route.path && i !== this.tags.length - 1) {
        // 关闭选中的tag情况下 ，并且不是最后1个tag
        this.$router.push(this.tags[i - 1].path)
      } else if (i === this.tags.length - 1) {
        // 关闭最后一个标签的情况
        this.$router.push(this.tags[this.tags.length - 2].path)
      }
      this.tags.splice(i, 1)
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="scss" scoped>
.tags {
  padding-left: 20px;
  padding-top: 2px;
  padding-bottom: 2px;
  .tag {
    cursor: pointer;
    margin-right: 3px;
    .circular {
      width: 8px;
      height: 8px;
      margin-right: 4px;
      background-color: #fff;
      border-radius: 50%;
      display: inline-block;
    }
  }
}
</style>
