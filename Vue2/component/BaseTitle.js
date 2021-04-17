export default {
  name: "BaseTitle",
  render(createElement) {
    return createElement(
      this.tag,
      {
        class: [this.level, "title", { dark: this.isDark }],
      },
      this.$slots.default
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
        return ["primary", "secondary", "third"].includes(val);
      },
    },
    isDark: {
      type: Boolean,
      default: false,
    },
  },
};
