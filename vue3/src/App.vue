<template>
  <main class="wrapper">
    <BaseTitle tag="h1"
               level="primary"
               class="todo-title">待辦清單</BaseTitle>
    <BaseTitle v-if="!todo.length"
               tag="h2"
               level="secondary">尚無代辦事項，請新增。✏️</BaseTitle>
    <template v-else>
      <TodoItem class="todo"
                v-for="item of todo"
                v-bind="{
                 ...item,
                 tagStyle: tagStyle(item.level),
                 tagText: tagText(item.level),
                 formateTime: formateDate(item.time)
               }"
                @deleteTodo="deleteTodo($event)"
                @editTodo="setCacheTodo($event), setEditMode('update'), toggle()"
                :key="item.ID" />
    </template>
    <AddCard v-show="isShow"
             v-model:name="cacheTodo.name"
             v-model:level="cacheTodo.level"
             v-model:time="cacheTodo.time"
             :minDate="minDate"
             :editMode="editMode"
             :options="levelOption"
             @cancel="toggle(), resetCacheTodo(), setEditMode('add')"
             @submit="setTodo(), toggle(), resetCacheTodo(), setEditMode('add')" />
    <button class="add"
            @click="toggle">
      <svg-add />
    </button>
  </main>
</template>

<script>
  import dayjs from 'dayjs';
  import SvgAdd from './components/SvgAdd.vue';
  import AddCard from './components/AddCard.vue';
  import TodoItem from './components/TodoItem.vue';
  import { reactive, ref } from '@vue/reactivity';

  export default {
    name: 'app',
    components: {
      SvgAdd,
      TodoItem,
      AddCard,
    },
    setup() {
      const {
        todo,
        setTodo,
        deleteTodo,
        cacheTodo,
        setCacheTodo,
        resetCacheTodo,
        editMode,
        setEditMode
      } = todoCRUD();
      const { tagStyle, tagText, formateDate } = formateStyle();
      const { toggle, isShow } = toggleForm();

      return {
        todo,
        setTodo,
        deleteTodo,
        cacheTodo,
        setCacheTodo,
        resetCacheTodo,
        editMode,
        setEditMode,
        tagStyle,
        tagText,
        formateDate,
        isShow,
        toggle,
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
        minDate: dayjs().format('YYYY-MM-DD')
      };
    },
  };


  function todoCRUD() {

    const todo = reactive([]);
    const editMode = ref('add');
    let cacheTodo = reactive({ name: '', ID: null, time: null });

    function setTodo() {
      if (editMode.value === 'update') updateTodo();
      if (editMode.value === 'add') addTodo();
    }

    function addTodo() {
      todo.push({ ...cacheTodo, ID: Date.now().toString() });
    }

    function updateTodo() {
      const index = todo.findIndex((item) => item.ID === cacheTodo.ID);
      todo.splice(index, 1, { ...cacheTodo });
    }

    function deleteTodo(ID) {
      const index = todo.findIndex((item) => item.ID === ID);
      todo.splice(index, 1);
    }

    function resetCacheTodo() {
      cacheTodo.name = '';
      cacheTodo.ID = null;
      cacheTodo.time = null;
      cacheTodo.level = '';
    }

    function setCacheTodo(todoID) {
      const currentTodo = { ...todo.find((item) => item.ID === todoID) };
      cacheTodo.name = currentTodo.name;
      cacheTodo.ID = currentTodo.ID;
      cacheTodo.time = currentTodo.time;
      cacheTodo.level = currentTodo.level;
    }

    function setEditMode(mode) {
      editMode.value = mode
    }

    return {
      setTodo,
      todo,
      cacheTodo,
      resetCacheTodo,
      deleteTodo,
      setCacheTodo,
      editMode,
      setEditMode
    };
  }


  function formateStyle() {
    function tagStyle(todoLevel) {
      switch (todoLevel) {
        case 'hight-level':
          return 'blue';
        case 'medium-level':
          return 'green';
        case 'low-level':
          return 'orange';
      }
    }
    function tagText(todoLevel) {
      switch (todoLevel) {
        case 'hight-level':
          return '重度';
        case 'medium-level':
          return '中度';
        case 'low-level':
          return '輕度';
      }
    }
    function formateDate(todoTime) {
      return dayjs(todoTime).format('YYYY 年 MM 月 DD 日');
    }

    return {
      tagStyle,
      tagText,
      formateDate,
    };
  }


  function toggleForm() {
    const isShow = ref(false);

    function toggle() {
      isShow.value = !isShow.value;
    }

    return {
      toggle,
      isShow,
    };
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
