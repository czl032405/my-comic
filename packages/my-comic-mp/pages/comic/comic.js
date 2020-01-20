const app = getApp();

Page({
  data: {
    showLoading: false,
    id: "5da89cb3a7ed463faded35fe",
    api: "pica",
    eps: [],
    currentEp: -1,
    currentIndex: 0
  },

  onLoad(options) {
    console.info(options.id);
    console.info("comic.load");

    this.setData(Object.assign(this.data, options));

    // if (options.epsCount) {
    //   this.setData({
    //     eps: Array.from({ length: options.epsCount })
    //       .map((value, index) => ({ title: index + 1, order: index + 1 }))
    //       .sort((a, b) => b.order - a.order)
    //   });
    // }

    this.loadEps();
  },

  onShow() {
    // reading progress
    let progress = wx.getStorageSync(this.data.api) || {};
    let { ep = -1, index = 0 } = progress[this.data.id] || {};
    console.info(ep, index);
    this.setData({
      currentIndex: index,
      currentEp: ep
    });
  },

  async loadEps() {
    this.setData({ showLoading: true });
    let fResult = await wx.cloud.callFunction({
      name: "comic-api",
      data: {
        api: this.data.api,
        method: `eps`,
        params: {
          comicId: this.data.id
        }
      }
    });

    let eps = fResult.result;
    this.setData({
      eps,
      showLoading: false
    });
  }
});
