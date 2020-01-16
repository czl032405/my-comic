const app = getApp();

Page({
  data: {},

  async onLoad() {
    // this.loadCategories();
  },

  async loadCategories() {
    console.info("loadCategories");
    let result = await wx.cloud.callFunction({
      name: "pica",
      data: {
        method: "categories"
      }
    });
    if (result.result.code == 200) {
      let categories = result.result.data.categories;
    }
    console.info(result);
  }
});
