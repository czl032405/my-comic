const app = getApp();

Page({
  data: {
    showLoading: false,
    api: "pica",
    s: "dd",
    t: undefined,
    c: undefined,
    k: undefined,
    comics: []
  },

  onLoad: function(options) {
    console.info("comics.load", options);
    let { t, c, k, api } = options;
    this.setData(Object.assign(this.data, { api, t, c, k }));
    this.loadComics();
  },

  /**
   *
   * @param params
   * @param {number} page 页码
   * @param {string} c 分区名字 categories里面的title，如"嗶咔漢化"
   * @param {string} t 标签的名字，由info返回数据里面的"tags"获得
   * @param {string} k 搜索keyword
   * @param {string} s 排序
   *  ua: 默认
   *  dd: 新到旧
   *  da: 旧到新
   *  ld: 最多爱心
   *  vd: 最多指名
   */
  async loadComics() {
    let { api, s, t, c, k } = this.data;

    // cached
    let { data, date } = wx.getStorageSync(`${api}_${s}_${t}_${c}_${k}`) || {};
    if (+new Date() - +new Date(date) < 1000 * 60 * 60 * 24) {
      console.info("comics cached");
      this.setData({
        comics: data,
        showLoading: false
      });
      return;
    }

    // not cached
    try {
      this.setData({ showLoading: true });
      let fResult = await wx.cloud.callFunction({
        name: "comic-api",
        data: {
          api,
          method: "comics",
          params: {
            t,
            c,
            k,
            s
          }
        }
      });
      let comics = fResult.result;
      this.setData({
        comics,
        showLoading: false
      });

      wx.setStorageSync(`${api}_${s}_${t}_${c}_${k}`, { data: comics, date: new Date() });
    } catch (error) {
      wx.showToast({
        title: error.message || error.errMsg || error
      });
      this.setData({
        showLoading: false
      });
    }
  },

  onSortPick(e) {
    let s = ["ua", "dd", "da", "ld", "vd"][e.detail.value];
    this.setData({
      s
    });
    this.loadComics();
  }
});
