// 引入 Vue ES Module
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.esm.browser.js'

// component
import SvgBucket from './component/SvgBucket.js'
import SvgChecked from './component/SvgChecked.js'
import SvgPencil from './component/SvgPencil.js'
import SvgAdd from './component/SvgAdd.js'
import BaseTitle from './component/BaseTitle.js'
import AddCard from './component/AddCard.js'
import TodoItem from './component/TodoItem.js'
import BaseTag from './component/BaseTag.js'
import BaseInput from './component/BaseInput.js'
import BaseButton from './component/BaseButton.js'
import BaseSelect from './component/BaseSelect.js'

const vm = new Vue({
  el: '#app',
  components: {
    SvgAdd,
    SvgBucket,
    SvgPencil,
    SvgChecked,
    TodoItem,
    AddCard,
    BaseTag,
    BaseTitle,
    BaseInput,
    BaseButton,
    BaseSelect,
  },
  data: {
    todo: [],
    cacheTodo: {
      name: '',
      ID: null,
      time: null,
      level: '',
      finish: false,
    },
    minDate: dayjs().format('YYYY-MM-DD'),
    // 表單編輯模式，一共有新增、更新
    editMode: 'add',
    isShow: false,
    levelOption: [
      {
        value: 'hight-level',
        text: '高等',
      },
      {
        value: 'medium-level',
        text: '中等',
      },
      {
        value: 'low-level',
        text: '低等',
      },
    ],
  },
  methods: {
    addTodo() {
      this.todo.push({ ...this.cacheTodo, ID: Date.now() })
    },
    updateTodo() {
      const index = this.todo.findIndex((item) => item.ID === this.cacheTodo.ID)
      this.todo.splice(index, 1, this.cacheTodo)
    },
    deleteTodo(index) {
      this.todo.splice(index, 1)
    },
    toggle() {
      this.isShow = !this.isShow
    },
    resetCacheTodo() {
      this.editMode = 'add'
      this.cacheTodo = {
        name: '',
        ID: null,
        time: null,
        level: '',
      }
    },
    updateCacheTodo(todoID) {
      this.editMode = 'update'
      this.cacheTodo = { ...this.todo.find((item) => item.ID === todoID) }
    },
    finishTodo(todoID) {
      const index = this.todo.findIndex((item) => item.ID === todoID)
      this.todo[index].finish = !this.todo[index].finish
    },
    // 表單會隨著新增、編輯不同模式變動資料
    setTodo() {
      if (this.editMode === 'update') this.updateTodo()
      else if (this.editMode === 'add') this.addTodo()
    },
    tagStyle(todoLevel) {
      switch (todoLevel) {
        case 'hight-level':
          return 'blue'
        case 'medium-level':
          return 'green'
        case 'low-level':
          return 'orange'
      }
    },
    tagText(todoLevel) {
      switch (todoLevel) {
        case 'hight-level':
          return '重度'
        case 'medium-level':
          return '中度'
        case 'low-level':
          return '輕度'
      }
    },
    formateDate(todoTime) {
      return dayjs(todoTime).format('YYYY 年 MM 月 DD 日')
    },
  },
  template: `
    <main id="app">
        <base-title tag="h1" level="primary" class="todo-title">待辦清單</base-title>
        <todo-item v-if="todo.length === 0"><base-title tag="h2" level="secondary">尚無代辦事項，請新增。✏️</base-title></todo-item>
        <todo-item v-else :class="['todo' , item.finish ? 'finish' : '']" v-for="(item, index) of todo" :key="item.ID">
            <base-tag :color="tagStyle(item.level)">{{ tagText(item.level) }}</base-tag>
            <base-title tag="h2" level="secondary">{{ item.name }}</base-title>
            <base-title tag="p" level="third">{{ formateDate(item.time) }}</base-title>
            <button @click="deleteTodo(index)"><svg-bucket/></button>
            <button @click="updateCacheTodo(item.ID), toggle()"><svg-pencil/></button>
            <button @click="finishTodo(item.ID)"><svg-checked/></button>
        </todo-item>
        <add-card class="add-card"
                v-show="isShow"
                @submit="setTodo(), toggle(), resetCacheTodo()">
            <base-title tag="h2"
                        level="primary"
                        :isDark="true">ADD TODO</base-title>
            <base-input label="事項"
                        required
            type="text" v-model="cacheTodo.name"/>
            <base-select label="重要程度"
                            v-model="cacheTodo.level"
                        required
                        name="level"
                        :options="levelOption"/>
            <base-input label="代辦時間"
                        required
                        type="date"
                        :min="minDate"
                        v-model="cacheTodo.time"/>
            <div class="add-card-buttons">
                <base-button level="secondary"
                        type="button"
                        @click.native="toggle(), resetCacheTodo()">Cancel</base-button>
                <base-button level="primary"
                        v-if="editMode === 'update'"
                        type="submit">Update</base-button>
                <base-button level="primary"
                        v-if="editMode === 'add'"
                        type="submit">ADD</base-button>
            </div>
        </add-card>
        <button class="add" @click="toggle"><svg-add/></button>
    </main>`,
})
