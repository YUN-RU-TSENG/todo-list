<template>
  <main class="wrapper">
    <BaseTitle tag="h1"
               level="primary"
               class="todo-title">待辦清單</BaseTitle>
    <BaseTitle v-if="todo.length === 0"
               tag="h2"
               level="secondary">尚無代辦事項，請新增。✏️</BaseTitle>
    <template v-else>
      <TodoItem class="todo"
                v-for="(item) of todo"
                v-bind="{
                 ...item,
                 tagStyle: tagStyle(item.level),
                 tagText: tagText(item.level),
                 formateTime: formateDate(item.time)
               }"
                @deleteTodo="deleteTodo($event)"
                @editTodo="setCacheTodo($event), toggle()"
                :key="item.ID" />
    </template>
    <AddCard v-show="isShow"
             v-model:name="cacheTodo.name"
             v-model:level="cacheTodo.level"
             v-model:time="cacheTodo.time"
             :editMode="editMode"
             :options="levelOption"
             @cancel="toggle(), resetCacheTodo()"
             @submit="setTodo(), toggle(), resetCacheTodo()" />
    <button class="add"
            @click="toggle">
      <svg-add />
    </button>
  </main>
</template>

<script>
import dayjs from 'dayjs'
import SvgAdd from './components/SvgAdd.vue'
import AddCard from './components/AddCard.vue'
import TodoItem from './components/TodoItem.vue'

export default {
  name: 'app',
  components: {
    SvgAdd,
    TodoItem,
    AddCard
  },
  data: function () {
    return {
      todo: [
        // {
        //   name: '',
        //   ID: null,
        //   time: null,
        //   level: '',
        // },
      ],
      cacheTodo: {
        name: '',
        ID: null,
        time: null,
        level: ''
      },
      // 表單編輯模式，一共有新增、更新
      editMode: 'add',
      isShow: false,
      levelOption: [
        {
          value: 'hight-level',
          text: '高等'
        },
        {
          value: 'medium-level',
          text: '中等'
        },
        {
          value: 'low-level',
          text: '低等'
        }
      ]
    }
  },
  methods: {
    addTodo () {
      this.todo.push({ ...this.cacheTodo, ID: Date.now().toString() })
    },
    updateTodo () {
      const index = this.todo.findIndex(
        (item) => item.ID === this.cacheTodo.ID
      )
      this.todo.splice(index, 1, this.cacheTodo)
    },
    deleteTodo (ID) {
      const index = this.todo.findIndex((item) => item.ID === ID)
      this.todo.splice(index, 1)
    },
    toggle () {
      this.isShow = !this.isShow
    },
    resetCacheTodo () {
      this.editMode = 'add'
      this.cacheTodo = {
        name: '',
        ID: null,
        time: null,
        level: ''
      }
    },
    setCacheTodo (todoID) {
      this.editMode = 'update'
      this.cacheTodo = { ...this.todo.find((item) => item.ID === todoID) }
    },
    // 表單會隨著新增、編輯不同模式變動資料
    setTodo () {
      if (this.editMode === 'update') this.updateTodo()
      if (this.editMode === 'add') this.addTodo()
    },
    tagStyle (todoLevel) {
      switch (todoLevel) {
        case 'hight-level':
          return 'blue'
        case 'medium-level':
          return 'green'
        case 'low-level':
          return 'orange'
      }
    },
    tagText (todoLevel) {
      switch (todoLevel) {
        case 'hight-level':
          return '重度'
        case 'medium-level':
          return '中度'
        case 'low-level':
          return '輕度'
      }
    },
    formateDate (todoTime) {
      return dayjs(todoTime).format('YYYY 年 MM 月 DD 日')
    }
  }
}
</script>

<style lang="scss">
  @import './assets/style/base/reset';
</style>

<style lang="scss" scoped>
  .wrapper {
    width: 95%;
    margin: auto;
    padding-top: 48px;
    min-height: 100vh;
    position: relative;
    @media (min-width: 576px) {
      width: 540px;
    }
    @media (min-width: 768px) {
      width: 608px;
    }
  }

  button.add {
    background: #24c3c2 0% 0% no-repeat padding-box;
    border-radius: 60px;
    position: fixed;
    width: 60px;
    height: 60px;
    right: 32px;
    bottom: 72px;
    border: none;
    cursor: pointer;
    z-index: 9;
    svg {
      width: 32px;
    }
  }
</style>
