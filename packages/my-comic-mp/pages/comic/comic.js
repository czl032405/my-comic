const app = getApp();

Page({
  data: {
    showLoading: false,
    id: "5da89cb3a7ed463faded35fe",
    title: "",
    thumb: "",
    api: "pica",
    eps: [],
    currentEp: -1,
    currentIndex: 0
  },

  async onLoad(options) {
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
    this.addHistory();
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
    // cahced
    let { api, id } = this.data;
    let { data, date } = wx.getStorageSync(`${api}_${id}`) || {};
    if (+new Date() - +new Date(date) < 1000 * 60 * 60 * 24 * 2) {
      console.info("comic eps cached");
      this.setData({
        eps: data,
        showLoading: false
      });
      return;
    }

    // notcached
    try {
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
      wx.setStorageSync(`${api}_${id}`, { data: eps, date: new Date() });
    } catch (error) {
      wx.showToast({
        title: error.message || error.errMsg || error
      });
      this.setData({
        showLoading: false
      });
    }
  },

  addHistory() {
    try {
      let history = wx.getStorageSync("history") || [];
      history = history.filter(c => c.comicId != this.data.id);
      history.unshift({
        comicId: this.data.id,
        title: this.data.title,
        thumb: this.data.thumb,
        api: this.data.api
      });
      wx.setStorageSync("history", history);
    } catch (error) {
      wx.setStorageSync("history", []);
    }
  }
});
