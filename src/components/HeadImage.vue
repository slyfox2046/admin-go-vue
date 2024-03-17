<template>
  <div>
    <span class="user-username">{{ sysAdmin.username }}</span>
    <el-dropdown>
      <img v-if="!sysAdmin.icon" src="./../assets/image/logo.png" alt="" class="user-avator" />
      <!-- <img v-else :src="sysAdmin.icon" class="user-avator" /> -->
      <img v-else :src="'https://vue.ruoyi.vip/static/img/profile.473f5971.jpg'" class="user-avator" />
      <el-dropdown-menu>
        <el-dropdown-item>
          <span @click="openPersonal">个人信息</span>
        </el-dropdown-item>
        <el-dropdown-item>
          <span @click="logout">退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import storage from '@/utils/storage'
export default {
  name: 'HeadImage',
  data() {
    return {
      sysAdmin: storage.getItem('sysAdmin'),
    }
  },
  watch: {},
  computed: {},
  methods: {
    openPersonal() {
      this.$router.push('/personal')
    },
    // 登出
    async logout() {
      const confirmResult = await this.$confirm('确定要退出登录吗，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消登录')
      }
      console.log(this)
      this.$storage.clearAll()
      this.$router.push('/login')
      this.$message.success('退出成功')
    },
  },
  created() {},
  mounted() {},
}
</script>

<style lang="less" scoped>
.user-username {
  position: fixed;
  right: 70px;
  font-size: medium;
  margin-top: 11px;
}
.user-avator {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
</style>
