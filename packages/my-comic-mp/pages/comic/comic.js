const app = getApp();

Page({
  data: {
    showLoading: false,
    id: "5da89cb3a7ed463faded35fe",
    api: "pica",
    eps: [],
    currentOrder: -1,
    currentIndex: 0
  },

  onLoad(options) {
    console.info(options.id);
    console.info("comic.load");

    this.setData(Object.assign(this.data, options));

    if (options.epsCount) {
      this.setData({
        eps: Array.from({ length: options.epsCount })
          .map((value, index) => ({ title: index + 1, order: index + 1 }))
          .sort((a, b) => b.order - a.order)
      });
    }

    this.loadEps();
  },

  onShow() {
    // reading progress
    let pica_progress = wx.getStorageSync("pica") || {};
    let { order = -1, index = 0 } = pica_progress[this.data.id] || {};
    console.info(order, index);
    this.setData({
      currentIndex: index,
      currentOrder: order
    });
  },

  async loadEps() {
    if (this.data.api == "pica") {
      this.setData({ showLoading: true });
      let fResult = await wx.cloud.callFunction({
        name: "pica",
        data: {
          method: `comics/${this.data.id}/alleps`
        }
      });

      let eps = fResult.result;
      this.setData({
        eps,
        showLoading: false
      });
    }

    if (this.data.api == "pingcc") {
      this.setData({ showLoading: true });
      let fResult = await wx.cloud.callFunction({
        name: "pingcc",
        data: {
          params: {
            mhurl1: this.data.id
          }
        }
      });
      console.info(fResult.result);
      let eps = fResult.result.list.map(i => ({ order: i.url, title: i.num })).reverse();
      this.setData({
        eps,
        showLoading: false
      });
    }
  }
});
