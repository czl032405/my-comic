const app = getApp();

Page({
  data: {
    showSearch: false
  },

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
  },

  search(e) {
    console.info(e);
    let k = e.detail.value;
    wx.navigateTo({
      url: `/pages/comics/comics?k=${k}`
    });
  }
});
