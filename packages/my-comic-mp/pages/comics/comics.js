const app = getApp();

Page({
  data: {
    showLoading: false,
    s: "dd",
    t: undefined,
    c: undefined,
    k: undefined,
    comics: []
  },

  onLoad: function(options) {
    console.info("comics.load");
    let { t, c, k } = options;
    if (!t && !c && !k) {
      c = "禁書目錄";
    }
    this.setData(Object.assign(this.data, JSON.parse(JSON.stringify({ t, c, k }))));
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
    let { s, t, c, k } = this.data;
    console.info({ s, t, c, k });
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

    console.info(fResult);
  },

  onSortPick(e) {
    let s = ["ua", "dd", "da", "ld", "vd"][e.detail.value];
    this.setData({
      s
    });

    this.loadComics();
  }
});
