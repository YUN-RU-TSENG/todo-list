<template>
  <section :class="['todo', finish ? 'finish' : '']">
    <BaseTag :color="tagStyle">{{ tagText }}</BaseTag>
    <BaseTitle tag="h2" level="secondary">{{ name }}</BaseTitle>
    <BaseTitle tag="p" level="third">{{ formateDate }}</BaseTitle>
    <button @click="$emit('deleteTodo')">
      <SvgBucket />
    </button>
    <button @click="$emit('editTodo')">
      <SvgPencil />
    </button>
    <button @click="$emit('finishTodo')">
      <SvgChecked />
    </button>
  </section>
</template>

<script>
import SvgBucket from "./SvgBucket.vue";
import SvgChecked from "./SvgChecked.vue";
import SvgPencil from "./SvgPencil.vue";

import dayjs from "dayjs";
import { computed } from "vue";

export default {
  name: "TodoItem",
  components: {
    SvgChecked,
    SvgBucket,
    SvgPencil
  },
  setup(props) {

    const tagStyle = computed(() => {
      switch (props.level.value) {
        case "hight-level":
          return "blue";
        case "medium-level":
          return "green";
        case "low-level":
          return "orange";
        default:
          return "";
      }
    });

    const tagText = computed(() => {
      switch (props.level.value) {
        case "hight-level":
          return "重度";
        case "medium-level":
          return "中度";
        case "low-level":
          return "輕度";
        default:
          return "";
      }
    });

    const formateDate = computed(() => {
      return dayjs(props.time.value).format("YYYY 年 MM 月 DD 日");
    });

    return { tagStyle, formateDate, tagText };
  },
  props: {
    ID: { type: String, required: true },
    finish: { type: Boolean, required: true },
    name: { type: String, required: true },
    time: { type: String, required: true },
    level: { type: String, required: true }
  },
  emits: ["deleteTodo", "editTodo", "finishTodo"]
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

  &.finish {
    opacity: 0.5;
  }
}
</style>
