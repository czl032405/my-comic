const app = getApp();

Page({
  data: {
    showLoading: false,
    id: "5da89cb3a7ed463faded35fe",
    order: "1",
    pages: [],
    index: 0,
    workingPages: [],
    workingIndex: 0
  },

  onLoad(options) {
    console.info("comic-pages.load");
    let { id, order, index } = options;
    this.setData(Object.assign(this.data, JSON.parse(JSON.stringify({ id, order, index }))));
    this.loadPages();
  },

  setPicaProgress() {
    let pica_progress = wx.getStorageSync("pica") || {};
    pica_progress[this.data.id] = {
      order: this.data.order,
      index: this.data.index
    };
    wx.setStorageSync("pica", pica_progress);
  },

  async loadPages() {
    this.setData({ showLoading: true });
    let { id, order } = this.data;
    let fResult = await wx.cloud.callFunction({
      name: "pica",
      data: {
        method: `comics/${id}/eps/${order}/pages`
      }
    });
    let medias = fResult.result;
    let pages = medias.map(media => "https://my-comic.herokuapp.com/pica/image?url=" + media.fileServer + "/static/" + media.path);

    this.setData({
      showLoading: false,
      workingIndex: 0,
      pages
    });

    this.onSwiperChange({ detail: { current: 0 } });
  },

  onSwiperChange(event) {
    let { current } = event.detail;
    let { workingIndex, workingPages, pages, index } = this.data;
    let movedIndex = current - workingIndex; //1 -1 2 -2
    let preloadIndex = null;
    let preloadWorkingIndex = null;
    let preloadIndex2 = null;
    let preloadWorkingIndex2 = null;
    const workingPagesLength = 4;
    workingIndex = current;

    // next
    if (movedIndex == 1 || movedIndex == -workingPagesLength + 1) {
      console.info("next");
      index = (index + 1 + pages.length) % pages.length;
      preloadIndex = (index + 1 + pages.length) % pages.length;
      preloadWorkingIndex = (workingIndex + 1 + workingPagesLength) % workingPagesLength;
      preloadIndex2 = (index + 2 + pages.length) % pages.length;
      preloadWorkingIndex2 = (workingIndex + 2 + workingPagesLength) % workingPagesLength;
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
    this.setData({
      workingIndex: current,
      index,
      [workingKey]: pages[index],
      [preloadWorkingKey]: pages[preloadIndex],
      [preloadWorkingKey2]: pages[preloadIndex2]
    });

    this.setPicaProgress();
  }
});