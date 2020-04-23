const app = getApp();

Page({
  data: {
    showLoading: false,
    id: "5da89cb3a7ed463faded35fe",
    api: "pica",
    ep: "1",
    epTitle: "",
    comicTitle: "",
    pages: [],
    index: 0,
    workingPages: [],
    workingIndex: 0,
    workingPagesLength: 4,
    workingPagesStatus: [],
  },

  onLoad(options) {
    console.info("comic-pages.load", options);
    this.setData(Object.assign(this.data, options));
    this.loadPages();
  },

  onImageLoad(e) {
    console.info("success", e.target.id);
    let id = e.target.id;
    let index = this.data.workingPages.findIndex((p) => p == id);
    let key = `workingPagesStatus[${index}]`;
    this.setData({
      [key]: "success",
    });
  },

  onImageError(e) {
    console.info("error");
    let id = e.target.id;
    let index = this.data.workingPages.findIndex((p) => p == id);
    let key = `workingPagesStatus[${index}]`;
    this.setData({
      [key]: "error",
    });
  },
  setPicaProgress() {
    let pica_progress = wx.getStorageSync(this.data.api) || {};
    pica_progress[this.data.id] = {
      ep: this.data.ep,
      index: this.data.index,
    };
    wx.setStorageSync(this.data.api, pica_progress);
  },

  async loadPages() {
    let { id, ep, api } = this.data;
    let { epTitle, comicTitle } = this.data;
    // cahced
    let { data, date } = wx.getStorageSync(`${api}_${id}_${ep}`) || {};
    if (+new Date() - +new Date(date) < 1000 * 60 * 60 * 24 * 2) {
      console.info("comic pages cached");
      if (data && data.length) {
        this.setData({
          showLoading: false,
          workingIndex: 0,
          pages: data,
        });
        this.onSwiperChange({ detail: { current: 0 } });
        return;
      }
    }

    try {
      this.setData({ showLoading: true });
      let fResult = await wx.cloud.callFunction({
        name: "comic-api",
        data: {
          api: this.data.api,
          method: `pages`,
          params: {
            comicId: id,
            epId: ep,
            epTitle,
            comicTitle,
          },
        },
      });

      let pages = fResult.result.map((r) => r.url);

      this.setData({
        showLoading: false,
        workingIndex: 0,
        pages,
      });

      this.onSwiperChange({ detail: { current: 0 } });
      wx.setStorageSync(`${api}_${id}_${ep}`, { data: pages, date: new Date() });
    } catch (error) {
      console.error(error);
      debugger;
      wx.showToast({
        title: error.message || error.stack || error,
      });
      this.setData({
        showLoading: false,
      });
    }
  },

  onSwiperChange(event) {
    let { current } = event.detail;
    let { workingIndex, workingPages, pages, index } = this.data;
    let movedIndex = current - workingIndex; //1 -1 3 -3
    let preloadIndex = null;
    let preloadWorkingIndex = null;
    let preloadIndex2 = null;
    let preloadWorkingIndex2 = null;
    let workingPagesLength = this.data.workingPagesLength;
    workingIndex = current;

    // next
    if (movedIndex == 1 || movedIndex == -workingPagesLength + 1) {
      console.info("next");
      index = (index + 1 + pages.length) % pages.length;
      preloadIndex = (index + 1 + pages.length) % pages.length;
      preloadWorkingIndex = (workingIndex + 1 + workingPagesLength) % workingPagesLength;
      preloadIndex2 = (index + 2 + pages.length) % pages.length;
      preloadWorkingIndex2 = (workingIndex + 2 + workingPagesLength) % workingPagesLength;
      // todo 最后一页阻止滑动?
    }
    // prev
    else if (movedIndex == -1 || movedIndex == workingPagesLength - 1) {
      console.info("prev");
      index = (index - 1 + pages.length) % pages.length;
      preloadIndex = (index - 1 + pages.length) % pages.length;
      preloadWorkingIndex = (workingIndex - 1 + workingPagesLength) % workingPagesLength;
      preloadIndex2 = (index - 2 + pages.length) % pages.length;
      preloadWorkingIndex2 = (workingIndex - 2 + workingPagesLength) % workingPagesLength;
    } else if (movedIndex == 0) {
      console.info("init");
      this.setData({
        workingPages: new Array(4),
      });
      index = (index + pages.length) % pages.length;
      preloadIndex = (index + 1 + pages.length) % pages.length;
      preloadWorkingIndex = (workingIndex + 1 + workingPagesLength) % workingPagesLength;
      preloadIndex2 = (index + 2 + pages.length) % pages.length;
      preloadWorkingIndex2 = (workingIndex + 2 + workingPagesLength) % workingPagesLength;
    }
    console.info("movedIndex", movedIndex);
    console.info(`workingIndex`, current);
    console.info(`index`, index);
    console.info(`preloadWorkingIndex`, preloadWorkingIndex);
    console.info(`preloadWorkingIndex2`, preloadWorkingIndex2);
    console.info(`preloadIndex`, preloadIndex);
    console.info(`preloadIndex2`, preloadIndex2);
    let workingKey = `workingPages[${workingIndex}]`;
    let preloadWorkingKey = `workingPages[${preloadWorkingIndex}]`;
    let preloadWorkingKey2 = `workingPages[${preloadWorkingIndex2}]`;
    let workingStatusKey = `workingPagesStatus[${workingIndex}]`;
    let preloadworkingStatusKey = `workingPagesStatus[${preloadWorkingIndex}]`;
    let preloadworkingStatusKey2 = `workingPagesStatus[${preloadWorkingIndex2}]`;

    console.info(this.data[workingKey]);
    console.info(pages[index]);

    this.setData({
      workingIndex: current,
      index,
      [workingKey]: pages[index],
      [preloadWorkingKey]: pages[preloadIndex],
      [preloadWorkingKey2]: pages[preloadIndex2],
      [workingStatusKey]: this.data.workingPages[workingIndex] != pages[index] ? "loading" : this.data.workingPagesStatus[workingIndex],
      [preloadworkingStatusKey]: this.data.workingPages[preloadWorkingIndex] != pages[preloadIndex] ? "loading" : this.data.workingPagesStatus[preloadWorkingIndex],
      [preloadworkingStatusKey2]: this.data.workingPages[preloadWorkingIndex2] != pages[preloadIndex2] ? "loading" : this.data.workingPagesStatus[preloadWorkingIndex2],
    });

    this.setPicaProgress();
  },
});
