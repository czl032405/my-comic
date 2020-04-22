const app = getApp();

Page({
  data: {
    showSearch: false,
    searchApiIndex: 3,
    searchRange: ["pica", "pingcc", "mangabz", "hhimm"],
  },

  async onLoad() {
    // this.loadPicaCategories();
  },

  async loadPicaCategories() {
    console.info("loadPicaCategories");
    let result = await wx.cloud.callFunction({
      name: "pica",
      data: {
        method: "categories",
      },
    });
    if (result.result.code == 200) {
      let categories = result.result.data.categories;
    }
    console.info(result);
  },

  onSearchPick(e) {
    let index = e.detail.value;
    this.setData({
      searchApiIndex: index,
    });
  },

  search(e) {
    console.info(e);
    let k = e.detail.value;
    wx.navigateTo({
      url: `/pages/comics/comics?k=${k}&api=${this.data.searchRange[this.data.searchApiIndex]}`,
    });
  },

  onShareAppMessage(ops) {},
});
