const app = getApp();

Page({
  data: {
    page: 1,
    s: "dd",
    comics: []
  },

  onLoad: function(options) {
    console.info("comics.load");
    let { t, c, k } = options;
    // this.loadComics({ t, c, k });
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
  async loadComics(params) {
    let { t, c = "禁書目錄", k } = params;
    let { page, s } = this.data;
    console.info(t, c, k, page, s);
    let method = k ? "search" : "comics";
    let fResult = await wx.cloud.callFunction({
      name: "pica",
      data: {
        method,
        params: {
          t,
          c,
          k,
          s,
          page
        }
      }
    });
    let comics = fResult.result.data.comics.docs;
    this.setData({
      comics
    });

    console.info(fResult);
  },

  onSortPick(e) {
    this.setData({
      s: ["ua", "dd", "da", "ld", "vd"][e.detail.value]
    });
  }
});
