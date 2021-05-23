
<template>
  <section class="todo">
    <BaseTag :color="tagStyle">{{ tagText }}</BaseTag>
    <BaseTitle tag="h2"
               level="secondary">{{ name }}</BaseTitle>
    <BaseTitle tag="p"
               level="third">{{ formateTime }}</BaseTitle>
    <button @click="$emit('deleteTodo', ID)">
      <SvgBucket />
    </button>
    <button @click="$emit('editTodo', ID)">
      <SvgPencil />
    </button>
    <button>
      <SvgChecked />
    </button>
  </section>
</template>

<script>
  import SvgBucket from './SvgBucket.vue';
  import SvgChecked from './SvgChecked.vue';
  import SvgPencil from './SvgPencil.vue';

  export default {
    name: 'TodoItem',
    components: {
      SvgChecked,
      SvgBucket,
      SvgPencil,
    },
    props: {
      ID: { type: String, required: true },
      name: { type: String, required: true },
      time: { type: String, required: true },
      formateTime: { type: String, required: true },
      level: { type: String, required: true },
      tagStyle: { type: String, required: true },
      tagText: { type: String, required: true },
    },
    emits: ['deleteTodo', 'editTodo'],
  };
</script>

<style lang="scss" scoped>
  .todo {
    background-color: #252b3c;
    border-radius: 4px;
    padding: 24px;
    &:not(:first-child) {
      margin-bottom: 16px;
    }

    h2 {
      margin-bottom: 4px;
    }
    p {
      margin-bottom: 12px;
    }
    svg {
      width: 24px;
    }
    button {
      outline: none;
      border: none;
      background-color: transparent;
      cursor: pointer;
      &:not(:first-of-type) {
        margin-left: 8px;
      }
    }

    &-title {
      text-align: left;
      padding-left: 12px;
      margin-bottom: 28px;
    }

    .tag {
      float: right;
    }
  }
</style>
