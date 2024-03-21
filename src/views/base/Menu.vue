<template>
  <el-card>
    <!-- 条件搜索 -->
    <el-form :model="queryParams" :inline="true">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input placeholder="请输入菜单名称" clearable size="mini" v-model="queryParams.menuName" @keyup.enter.native="handleQuery"></el-input>
      </el-form-item>
      <el-form-item label="菜单状态" prop="menuStatus">
        <el-select v-model="queryParams.menuStatus" size="mini" placeholder="请选择菜单状态">
          <el-option v-for="item in menuStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button plain type="primary" icon="el-icon-plus" size="mini" @click="addMenuDialogVisible = true">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button plain type="info" icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table
      border
      stripe
      style="width: 100%"
      :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      v-loading="loading"
      :data="menuList"
      v-if="refreshTable"
      row-key="id"
      :default-expand-all="isExpandAll"
    >
      <!-- <el-table-column label="ID" v-if="false" prop="id" /> -->
      <el-table-column label="菜单名称" prop="menuName" />
      <el-table-column label="图标" prop="icon">
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" />
      <el-table-column label="权限标识" prop="value" />
      <el-table-column label="组件路径" prop="url" />
      <el-table-column label="菜单类型" prop="menuType">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menuType === 1" type="">目录</el-tag>
          <el-tag v-else-if="scope.row.menuType === 2" type="success">菜单</el-tag>
          <el-tag v-else-if="scope.row.menuType === 3" type="danger">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="菜单状态" prop="menuStatus">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.menuStatus === 2" type="success">启用</el-tag>
          <el-tag v-else-if="scope.row.menuStatus === 1" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"> </el-table-column>

      <el-table-column label="更多操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="showEditMenuDialog(scope.row.id)">编辑</el-button>
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleMenuDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
<!-- 新增对话框 -->
    <el-dialog title="新增菜单" :visible.sync="addMenuDialogVisible" width="30%" @close="addMenuDialogClosed">
      <el-form :model="menuForm" :rules="addMenuFormRules" ref="addMenuFormRef" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuForm.menuType">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item size="mini" label="上级菜单" prop="parentId" v-if="menuForm.menuType != 1">
              <treeselect :options="treeList" placeholder="请选择上级菜单" v-model="menuForm.parentId" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单图标" prop="icon" v-if="menuForm.menuType != 3">
              <el-select v-model="menuForm.icon">
                <el-option v-for="item in iconList" :key="item.value" :label="item.label" :value="item.value">
                  <i :class="item.value" style="font-size: 25px" />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="menuForm.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col v-if="menuForm.menuType != 3">
            <el-form-item label="菜单url" prop="url">
              <el-input v-model="menuForm.url" placeholder="菜单url" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuForm.menuType != 1" label="权限标识" prop="value">
              <el-input v-model="menuForm.value" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuForm.menuType != 3" label="显示状态" prop="menuStatus">
              <el-radio-group v-model="menuForm.menuStatus">
                <el-radio :label="1">停用</el-radio>
                <el-radio :label="2">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer">
        <el-button type="primary" @click="addMenu">确定</el-button>
        <el-button type="primary" @click="addMenuDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="修改菜单" :visible.sync="editMenuDialogVisible" width="30%" @close="editMenuDialogClosed">
      <el-form :model="menuForm" :rules="editMenuFormRules" ref="editMenuFormRef" label-width="80px">
        <el-row>
          <el-col>
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="menuForm.menuType">
                <el-radio :label="1">目录</el-radio>
                <el-radio :label="2">菜单</el-radio>
                <el-radio :label="3">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item size="mini" label="上级菜单" prop="parentId" v-if="menuForm.menuType != 1">
              <treeselect :options="treeList" placeholder="请选择上级菜单" v-model="menuForm.parentId" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单图标" prop="icon" v-if="menuForm.menuType != 3">
              <el-select v-model="menuForm.icon">
                <el-option v-for="item in iconList" :key="item.value" :label="item.label" :value="item.value">
                  <i :class="item.value" style="font-size: 25px" />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="menuForm.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
          <el-col v-if="menuForm.menuType != 3">
            <el-form-item label="菜单url" prop="url">
              <el-input v-model="menuForm.url" placeholder="菜单url" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuForm.menuType != 1" label="权限标识" prop="value">
              <el-input v-model="menuForm.value" placeholder="请权限标识" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item v-if="menuForm.menuType != 3" label="显示状态" prop="menuStatus">
              <el-radio-group v-model="menuForm.menuStatus">
                <el-radio :label="1">停用</el-radio>
                <el-radio :label="2">启用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer">
        <el-button type="primary" @click="editMenu">确定</el-button>
        <el-button type="primary" @click="editMenuDialogVisible=false">取消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Menu',
  data() {
    return {
      queryParams: {},
      menuStatusList: [
        { value: 2, label: '启用' },
        { value: 1, label: '停用' },
      ],
      loading: true,
      menuList: [],
      isExpandAll: false,
      refreshTable: true,
      addMenuDialogVisible: false,
      editMenuDialogVisible: false,
      menuForm: {
        menuStatus: 2,
        menuName: "",
        menuType :1,
        url: ""

      },
      addMenuFormRules: {
        menuType: [{ required: true, message: '菜单类型不能为空', trigger: 'blur' }],
        menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }],
      },
      editMenuFormRules: {
        menuType: [{ required: true, message: '菜单类型不能为空', trigger: 'blur' }],
        menuName: [{ required: true, message: '菜单名称不能为空', trigger: 'blur' }],
        sort: [{ required: true, message: '菜单顺序不能为空', trigger: 'blur' }],
        value: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }],
      },
      treeList: [],
      iconList: [
        { value: 'el-icon-platform-eleme', label: 'el-icon-platform-eleme' },
        { value: 'el-icon-eleme', label: 'el-icon-eleme' },
        { value: 'el-icon-delete-solid', label: 'el-icon-delete-solid' },
        { value: 'el-icon-delete', label: 'el-icon-delete' },
        { value: 'el-icon-s-tools', label: 'el-icon-s-tools' },
        { value: 'el-icon-setting', label: 'el-icon-setting' },
        { value: 'el-icon-user-solid', label: 'el-icon-user-solid' },
        { value: 'el-icon-user', label: 'el-icon-user' },
        { value: 'el-icon-phone', label: 'el-icon-phone' },
        { value: 'el-icon-phone-outline', label: 'el-icon-phone-outline' },
        { value: 'el-icon-more', label: 'el-icon-more' },
        { value: 'el-icon-more-outline', label: 'el-icon-more-outline' },
        { value: 'el-icon-star-on', label: 'el-icon-star-on' },
        { value: 'el-icon-star-off', label: 'el-icon-star-off' },
        { value: 'el-icon-s-goods', label: 'el-icon-s-goods' },
        { value: 'el-icon-goods', label: 'el-icon-goods' },
        { value: 'el-icon-warning', label: 'el-icon-warning' },
        { value: 'el-icon-warning-outline', label: 'el-icon-warning-outline' },
        { value: 'el-icon-question', label: 'el-icon-question' },
        { value: 'el-icon-info', label: 'el-icon-info' },
        { value: 'el-icon-remove', label: 'el-icon-remove' },
        { value: 'el-icon-circle-plus', label: 'el-icon-circle-plus' },
        { value: 'el-icon-success', label: 'el-icon-success' },
        { value: 'el-icon-error', label: 'el-icon-error' },
        { value: 'el-icon-zoom-in', label: 'el-icon-zoom-in' },
        { value: 'el-icon-zoom-out', label: 'el-icon-zoom-out' },
        { value: 'el-icon-remove-outline', label: 'el-icon-remove-outline' },
        { value: 'el-icon-circle-plus-outline', label: 'el-icon-circle-plus-outline' },
        { value: 'el-icon-circle-check', label: 'el-icon-circle-check' },
        { value: 'el-icon-circle-close', label: 'el-icon-circle-close' },
        { value: 'el-icon-s-help', label: 'el-icon-s-help' },
        { value: 'el-icon-help', label: 'el-icon-help' },
        { value: 'el-icon-minus', label: 'el-icon-minus' },
        { value: 'el-icon-plus', label: 'el-icon-plus' },
        { value: 'el-icon-check', label: 'el-icon-check' },
        { value: 'el-icon-close', label: 'el-icon-close' },
        { value: 'el-icon-picture', label: 'el-icon-picture' },
        { value: 'el-icon-picture-outline', label: 'el-icon-picture-outline' },
        { value: 'el-icon-upload', label: 'el-icon-upload' },
      ],
    }
  },
  watch: {},
  computed: {},
  methods: {
    async getMenuList() {
      this.loading = true
      const { data: res } = await this.$api.queryMenuList(this.queryParams)
      this.menuList = this.$handleTree.handleTree(res.data, 'id')
      this.loading = false
    },
    handleQuery() {
      this.getMenuList()
    },
    resetQuery() {
      this.queryParams = {}
      this.getMenuList()
      this.$message.success('重置成功')
    },
    // 展开折叠
    toggleExpandAll() {
      this.refreshTable = false
      this.isExpandAll = !this.isExpandAll
      this.$nextTick(() => {
        this.refreshTable = true
      })
    },
    // 关闭对话框事件
    addMenuDialogClosed() {
      this.$refs.addMenuFormRef.resetFields()
    },
// 新增下来列表
    async getMenuVoList() {
      const { data: res } = await this.$api.querySysMenuVoList()
      this.treeList = this.$handleTree.handleTree(res.data, 'id')
    },
    // 新增提交
    addMenu() {
      console.log(this.menuForm)
      this.$refs.addMenuFormRef.validate(async valid => {
        if (!valid) return
        await this.$api.addMenu(this.menuForm)
        this.$message.success('新增菜单成功')
        this.addMenuDialogVisible = false
        await this.getMenuList()
        await this.getMenuVoList()
      })
    },
    //
    //
    editMenuDialogClosed(){
      this.$refs.editMenuFormRef.resetFields()
    },
    async showEditMenuDialog(id){
      const {data:res} = await this.$api.menuInfo(id)
      console.log("🚀 ~ showEditMenuDialog ~ res:", res)

      this.menuForm = res.data
      this.editMenuDialogVisible= true
    },
    editMenu(){
      this.$refs.editMenuFormRef.validate(async valid =>{
        if (!valid ) return
      await this.$api.menuUpdate(this.menuForm)
      this.editMenuDialogVisible = false
      await this.getMenuList()
      this.$message.success("修改菜单成功")
      })
    },
    //
    async handleMenuDelete(row) {
      const confirmResult = await this.$confirm('是否确认删除菜单为"' + row.menuName + '"的数据项?','提示',{
        confirmButtonText: "确定",
        canceButtonText: '取消',
        type:"warning"
      })
      if(confirmResult !='confirm') {
        return this.$message.info('已取消删除')
      }
      await this.$api.deleteMenu(row.id)
      this.$message.success("删除成功")
      await this.getMenuList()
    }
  },
  created() {
    this.getMenuList()
    this.getMenuVoList()
  },
  mounted() {},
}
</script>

<style lang="less" scoped></style>
