const app = getApp();

Page({
  data: {
    showLoading: false,
    id: "5da89cb3a7ed463faded35fe",
    eps: [],
    currentOrder: -1,
    currentIndex: 0,
    page: {
      total: 1,
      pageNo: 1,
      totalPage: 1
    }
  },

  onLoad(options) {
    console.info(options.id);
    console.info("comic.load");
    if (options.id) {
      this.setData({
        id: options.id
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
        method: `comics/${this.data.id}/eps`
      }
    });
    if (fResult.result.code == 200) {
      let eps = fResult.result.data.eps.docs;
      let totalPage = fResult.result.data.eps.pages;
      let pageNo = fResult.result.data.eps.page;
      let total = fResult.result.data.eps.total;
      this.setData({
        eps,
        page: { totalPage, pageNo, total }
      });
    }
    this.setData({ showLoading: false });
  }
});
