const app = getApp();

Page({
  data: {
    showSearch: false
  },

  async onLoad() {
    // this.loadPicaCategories();
  },

  async loadPicaCategories() {
    console.info("loadPicaCategories");
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

  searchPica(e) {
    console.info(e);
    let k = e.detail.value;
    wx.navigateTo({
      url: `/pages/comics/comics?k=${k}&api=pica`
    });
  },

  searchPingcc(e) {
    console.info(e);
    let k = e.detail.value;
    wx.navigateTo({
      url: `/pages/comics/comics?k=${k}&api=pingcc`
    });
  },

  searchMangabz() {
    console.info(e);
    let k = e.detail.value;
    wx.navigateTo({
      url: `/pages/comics/comics?k=${k}&api=mangabz`
    });
  }
});
