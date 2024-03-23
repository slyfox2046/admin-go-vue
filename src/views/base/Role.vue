<template>
  <el-card>
    <el-form :model="queryParams" label-width="80px" :inline="true" size="mini">
      <el-form-item label="角色名称">
        <el-input v-model="queryParams.roleName" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="账号状态">
        <el-select v-model="queryParams.status" placeholder="请选择账号状态">
          <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="开始时间" prop="beginTime">
        <el-date-picker v-model="queryParams.begintTime" type="year" placeholder="选择开始时间" value-format="yyyy-MM-dd" size="mini" style="width: 190px" class="input-width"> </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="beginTime">
        <el-date-picker v-model="queryParams.endTime" type="year" placeholder="选择结束时间" value-format="yyyy-MM-dd" size="mini" style="width: 190px" class="input-width"> </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">搜索</el-button>
        <el-button type="primary" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="addRoleDialogVisible = true">新增</el-button>
      </el-col>
    </el-row>

    <!-- 列表 -->
    <el-table :data="roleList" v-loading="loading" border stripe style="width: 100%" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column label="ID" prop="id" v-if="false"> </el-table-column>
      <el-table-column label="角色名称" prop="roleName"> </el-table-column>
      <el-table-column label="权限字符串" prop="roleKey"> </el-table-column>
      <el-table-column label="创建时间" prop="createTime"> </el-table-column>
      <el-table-column label="账号状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#f5222d"
            active-text="启用"
            inactive-text="停用"
            @change="roleUpdateStatus(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="description"> </el-table-column>
      <el-table-column label="更多操作" prop="">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleUpdate(scope.row.id)" icon="el-icon-edit">编辑</el-button>
          <el-button type="text" size="small" @click="handleDelete(scope.row)" icon="el-icon-delete">删除</el-button>
          <el-button type="text" size="small" @click="showSetMenuDialog(scope.row)" icon="el-icon-setting">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryParams.pageNum"
      :page-sizes="[20, 40, 80, 100]"
      :page-size="queryParams.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      background
    >
      :pager-count="7">
    </el-pagination>
    <!-- 新增角色 -->
    <el-dialog title="新增角色" :visible.sync="addRoleDialogVisible" width="30%" @close="addRoleDialogClosed">
      <el-form ref="addRoleFormRef" label-width="80px" :model="addRoleForm" :rules="addRoleFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="addRoleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input placeholder="请输入角色标识" v-model="addRoleForm.roleKey" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="addRoleForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input placeholder="请输入角色描述" type="textarea" v-model="addRoleForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="allotMenus">确 定</el-button>
        <el-button type="primary" @click="addRoleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 编辑角色 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDialogVisible" width="30%" @close="editRoleDialogClosed">
      <el-form ref="editRoleFormRef" label-width="80px" :model="editRoleForm" :rules="editRoleFormRules">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="editRoleForm.roleName" />
        </el-form-item>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input placeholder="请输入角色标识" v-model="editRoleForm.roleKey" />
        </el-form-item>
        <el-form-item label="角色状态" prop="status">
          <el-radio-group v-model="editRoleForm.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="2">停用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input placeholder="请输入角色描述" type="textarea" v-model="editRoleForm.description" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editRole">确 定</el-button>
        <el-button type="primary" @click="editRoleDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible.sync="setMenuDialogVisible" width="20%" @close="setRightDialogClosed">
      <el-tree ref="treeRef" :data="menuList" node-key="id" :props="treeProps" :show-checkbox="true" :highlight-current="true" default-expand-all :default-checked-keys="defKeys"></el-tree>

      <span slot="footer">
        <el-button type="primary" @click="allotMenus">确 定</el-button>
        <el-button type="primary" @click="setMenuDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </el-card>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Role',
  components: { Treeselect },
  data() {
    return {
      statusList: [
        {
          value: 1,
          label: '启用',
        },
        { value: 2, label: '停用' },
      ],
      queryParams: {},
      loading: false,
      roleList: [],
      total: 0,
      addRoleDialogVisible: false,
      addRoleForm: {
        roleName: '',
        roleKey: '',
        description: '',
        status: 1,
      },
      addRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleKey: [{ required: true, message: '请角色权限标识', trigger: 'blur' }],
        status: [{ required: true, message: '请输入角色状态', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      editRoleDialogVisible: false,
      editRoleForm: {
        roleName: '',
        roleKey: '',
        description: '',
        status: 1,
      },
      editRoleFormRules: {
        roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        roleKey: [{ required: true, message: '请角色权限标识', trigger: 'blur' }],
        status: [{ required: true, message: '请输入角色状态', trigger: 'blur' }],
        description: [{ required: true, message: '请输入角色描述', trigger: 'blur' }],
      },
      setMenuDialogVisible: false,
      menuList: [],
      treeProps: {
        label: 'label',
      },
      defKeys: [],
      id: '',
    }
  },
  watch: {},
  computed: {},
  methods: {
    // 列表
    async getRoleList() {
      this.loading = true
      const { data: res } = await this.$api.queryRoleList(this.queryParams)
      this.roleList = res.data.list
      this.total = res.data.total
      this.loading = false
    },
    // 搜索
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getRoleList()
    },
    // 重置
    resetQuery() {
      this.queryParams = {}
      this.getRoleList()
      this.$message.success('重置成功')
    },
    //
    handleSizeChange(newSize) {
      this.queryParams.pageSize = newSize
      this.getRoleList()
    },
    //
    handleCurrentChange(newPage) {
      this.queryParams.pageNum = newPage
      this.getRoleList()
    },
    async roleUpdateStatus(row) {
      let text = row.status === 2 ? '停用' : '启用'
      const confirmResult = await this.$confirm('确认要"' + text + '""' + row.roleName + '"角色吗？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult != 'confirm') {
        await this.getRoleList()
        return this.$message.info('已取消删除')
      }
      await this.$api.updateRoleStatus(row.id, row.status)
      await this.getRoleList()
      return this.$message.success(text + '成功')
    },
    // 对话框关闭事件
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    },
    // 新增
    addRole() {
      this.$refs.addRoleFormRef.validate(async valid => {
        if (!valid) return
        await this.$api.addRole(this.addRoleForm)
        this.$message.success('新增角色成功')
        this.addRoleDialogVisible = false
        await this.getRoleList()
      })
    },
    editoleDialogclosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    //
    // 编辑更新岗位
    async handleUpdate(id) {
      const { data: res } = await this.$api.roleInfo(id)
      this.editRoleForm = res.data
      this.editRoleDialogVisible = true
    },
    // 编辑对话框关闭事件
    editRoleDialogClosed() {
      this.$refs.editRoleFormRef.resetFields()
    },
    // 修改岗位
    editRole() {
      this.$refs.editRoleFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$api.updateRole(this.editRoleForm)
        this.$message.success('修改岗位成功')
        this.editRoleDialogVisible = false
        this.getRoleList()
      })
    },
    // 删除岗位
    async handleDelete(row) {
      const confirmResult = await this.$confirm('是否确认删除角色为"' + row.roleName + '"的数据项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).catch(err => err)
      if (confirmResult != 'confirm') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$api.deleteRole(row.id)
      this.$message.success('删除成功')
      await this.getRoleList()
    },
    // 展示分配菜单权限对话框
    async showSetMenuDialog(role) {
      this.id = role.id
      let res = await this.$api.querySysMenuVoList()
      this.menuList = this.$handleTree.handleTree(res.data.data, 'id')

      res = await this.$api.QueryRoleMenuIdList(role.id)
      this.defKeys = res.data.data
      this.setMenuDialogVisible = true
    },
    setRightDialogClosed() {
      this.defKeys = []
    },
    async allotMenus() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        // ...this.$refs.treeRef.getHalfCheckedKeys() // 半选的不应该保存，恢复的时候半选的选上后会导致下级都选中
      ]
      await this.$api.AssignPermissions(this.id, keys)
      this.$message.success('分配权限成功')
      await this.getRoleList()
      this.setMenuDialogVisible = false
    },
  },
  created() {
    this.getRoleList()
  },
  mounted() {},
}
</script>

<style lang="less" scoped></style>
