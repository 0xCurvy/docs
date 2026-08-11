import { actionReferences, renderActionPage } from "../../../.vitepress/sdk-reference.mts";

export default {
  paths: () =>
    actionReferences.map((action) => ({
      params: {
        sdkReferenceKind: "action",
        category: action.category,
        action: action.name,
      },
      content: renderActionPage(action),
    })),
};
