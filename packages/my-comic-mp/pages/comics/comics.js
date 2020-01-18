const app = getApp();

Page({
  data: {
    showLoading: false,
    api: "pica",
    s: "dd",
    t: undefined,
    c: "禁書目錄",
    k: undefined,
    comics: []
  },

  onLoad: function(options) {
    console.info("comics.load");
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
    if (api == "pica") {
      console.info({ s, t, c, k });
      let { data, date } = wx.getStorageSync(`pica_${s}_${t}_${c}_${k}`) || {};
      if (+new Date() - +new Date(date) < 1000 * 60 * 60 * 6) {
        console.info("comics cached");
        this.setData({
          comics: data,
          showLoading: false
        });
        return;
      }
      this.setData({ showLoading: true });
      let fResult = await wx.cloud.callFunction({
        name: "pica",
        data: {
          method: "allcomics",
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

      wx.setStorageSync(`pica_${s}_${t}_${c}_${k}`, { data: comics, date: new Date() });
      console.info(fResult);
    }

    if (api == "pingcc") {
      console.info({ k });
      let fResult = await wx.cloud.callFunction({
        name: "pingcc",
        data: {
          params: {
            name: k
          }
        }
      });
      if (fResult.result.mhlist) {
        let comics = fResult.result.mhlist.map(l => ({ _id: l.url, epsCount: 0, thumb: l.cover, title: l.name }));
        this.setData({
          comics,
          showLoading: false
        });
      }
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
