const app = getApp();

Page({
  data: {
    showLoading: false,
    id: "5da89cb3a7ed463faded35fe",
    order: "1",
    pages: [],
    workingPages: [],
    workingIndex: 0,
    swiperIndex: 0
  },

  onLoad(options) {
    console.info("comic-pages.load");
    let { id, order } = options;
    this.setData(Object.assign(this.data, { id, order }));
    this.loadPages();
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
    let pages = medias.map(
      media =>
        "https://my-comic.herokuapp.com/pica/image?url=" +
        media.fileServer +
        "/static/" +
        media.path
    );

    this.setData({
      showLoading: false,
      pages,
      workingPages: pages.slice(0, 3)
    });
  },

  onSwiperChange(event) {
    let { current } = event.detail;
    let { workingIndex, workingPages, pages, swiperIndex } = this.data;
    let movedIndex = current - swiperIndex; //1 -1 2 -2

    let preloadWorkingIndex = null;
    let preloadIndex = null;
    // next
    if (movedIndex == 1 || movedIndex == -2) {
      console.info("next");
      workingIndex = (workingIndex + 1 + pages.length) % pages.length;
      preloadIndex = (workingIndex + 1 + pages.length) % pages.length;
      preloadWorkingIndex =
        (current + 1 + workingPages.length) % workingPages.length;
    }
    // prev
    else if (movedIndex == -1 || movedIndex == 2) {
      console.info("prev");
      workingIndex = (workingIndex - 1 + pages.length) % pages.length;
      preloadIndex = (workingIndex - 1 + pages.length) % pages.length;
      preloadWorkingIndex =
        (current - 1 + workingPages.length) % workingPages.length;
    }

    console.info(`swiperIndex`, current);
    console.info(`workingIndex`, workingIndex);
    console.info(`preloadWorkingIndex`, preloadWorkingIndex);
    console.info(`preloadIndex`, preloadIndex);
    let workingPagesKey = `workingPages[${preloadWorkingIndex}]`;
    this.setData({
      swiperIndex: current,
      workingIndex,
      [workingPagesKey]: pages[preloadIndex]
    });
  }
});
