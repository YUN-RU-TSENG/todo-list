<script>
  import { h } from 'vue';
  export default {
    name: 'BaseTitle',
    render() {
      return h(
        this.tag,
        {
          class: [this.level, 'title', { dark: this.isDark }],
        },
        this.$slots.default()
      );
    },
    props: {
      tag: {
        type: String,
        required: true,
      },
      level: {
        type: String,
        required: true,
        validation(val) {
          return ['primary', 'secondary', 'third'].includes(val);
        },
      },
      isDark: {
        type: Boolean,
        default: false,
      },
    },
  };
</script>

<style lang="scss" scoped>
  .title {
    &.primary {
      font: normal normal normal 20px Helvetica Neue;
      color: #9fa3a7;
    }
    &.secondary {
      font: normal normal normal 16px Helvetica Neue;
      color: #9fa3a7;
    }
    &.third {
      font: normal normal normal 12px Helvetica Neue;
      color: #848797;
    }
    &.dark.primary {
      font: normal normal bold 20px Helvetica Neue;
      color: #6f7377;
    }
    &.dark.secondary {
      font: normal normal bold 16px Helvetica Neue;
      color: #6f7377;
    }
    &.dark.third {
      font: normal normal bold 12px Helvetica Neue;
      color: #6f7377;
    }
  }
</style>
