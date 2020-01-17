const app = getApp();

Page({
  data: {
    showLoading: false,
    id: "5da89cb3a7ed463faded35fe",
    eps: [],
    currentOrder: -1,
    currentIndex: 0
  },

  onLoad(options) {
    console.info(options.id);
    console.info("comic.load");
    if (options.id) {
      this.setData({
        id: options.id
      });
    }
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
      currentIndex: +index,
      currentOrder: +order
    });
  },

  async loadEps() {
    this.setData({ showLoading: true });
    let fResult = await wx.cloud.callFunction({
      name: "pica",
      data: {
        method: `comics/${this.data.id}/alleps`
      }
    });

    let eps = fResult.result;
    this.setData({
      eps
    });

    this.setData({ showLoading: false });
  }
});
