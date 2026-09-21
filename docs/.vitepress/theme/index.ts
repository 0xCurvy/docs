import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import PageActions from "./PageActions.vue";
import PaymentsBanner from "./PaymentsBanner.vue";
import "./custom.css";

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "doc-before": () => h(PageActions),
      "home-hero-before": () => h(PaymentsBanner),
    }),
};
