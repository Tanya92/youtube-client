import ItemModel from './item-model';
import animate from './utils';

export default class Slider {
    slider: HTMLDivElement;

    animationDuration: number = 300;

    isDown: boolean = false;

    startX: number;

    scrollLeft: number;

    isMove: boolean = false;

    updateNavigation: Function;

    loadMoreItems: Function;

    itemsData: ItemModel[];

    constructor(slider: HTMLDivElement, updateNavigation: Function, loadMoreItems: Function) {
      this.slider = slider;
      this.updateNavigation = updateNavigation;
      this.loadMoreItems = loadMoreItems;
      this.addSliderListeners();
    }

    clear() {
      this.slider.innerHTML = '';
      this.itemsData = [];
    }

    appendItems(items: ItemModel[]) {
      const fragment = document.createDocumentFragment();
      for (let i = 0; i < items.length; i += 1) {
        fragment.appendChild(Slider.createItem(items[i]));
        this.itemsData.push(items[i]);
      }
      this.slider.appendChild(fragment);
    }

    static createItemMarkup(data: ItemModel): string {
      const imageSrc = data.snippet.thumbnails.medium.url;
      const { title } = data.snippet;
      const link = `https://www.youtube.com/watch?v=${data.id.videoId}`;
      const channel = data.snippet.channelTitle;
      const dataPublished = data.snippet.publishedAt.slice(0, 10);
      const views = data.statistics.viewCount;
      const { description } = data.snippet;
      return `
            <div class="search_item_container">
                <div class="search_item">
                    <img class="imageSrc" src="${imageSrc}" alt="thumbnail">
                    <div class="title">
                        <a class="youtube_page" href="${link}" target="_blank">
                            <p>${title}</p>
                        </a>
                    </div>
                    <div class="information">
                        <img class="icon_img" src="./assets/icon_man.svg" alt="icon_man">
                        <p class="info_text">${channel}</p>
                        <img class="icon_img" src="./assets/icon_calendar.svg" alt="icon_calendar">
                        <p class="info_text">${dataPublished}</p>
                        <img class="icon_img" src="./assets/icon_eye.svg" alt="icon_view">
                        <p class="info_text">${views}</p>
                    </div>
                    <p class="description">${description}</p>
                </div>
            </div>
        `;
    }

    static createItem(data: ItemModel): DocumentFragment {
      const itemTemplate = document.createElement('template');
      itemTemplate.innerHTML = Slider.createItemMarkup(data);
      return itemTemplate.content;
    }


    getItem() {
      return this.slider.querySelector('.search_item_container');
    }

    getItemWidth() {
      return this.getItem().clientWidth;
    }

    getSliderWidth() {
      return this.slider.clientWidth;
    }

    getSliderScroll() {
      return this.slider.scrollLeft;
    }

    getVisibleItemsCount() {
      const itemWidth = this.getItemWidth();
      const sliderWidth = this.getSliderWidth();
      return Math.round(sliderWidth / itemWidth);
    }

    scroll(pixels: number, animated: boolean = true) {
      const currentScroll = this.getSliderScroll();
      return Promise.resolve().then(
        () => {
          if (animated) {
            return new Promise<void>((resolve) => {
              animate((timePassed) => {
                this.setScroll(currentScroll + pixels * (timePassed / this.animationDuration));
                if (timePassed === this.animationDuration) {
                  resolve();
                }
              }, this.animationDuration);
            });
          }
          this.setScroll(currentScroll + pixels);
          return Promise.resolve();
        },
      );
    }

    setScroll(pixels: number): void {
      this.slider.scrollLeft = pixels;
    }

    saveScrolledItems = () => {
      const scrolledElementsNumber: number = Math.floor(
        this.getSliderScroll() / this.getItemWidth(),
      );
      this.slider.setAttribute('data-scroll', String(scrolledElementsNumber));
    };

    getSavedScrollItemsCount = (): number => Number(
      this.slider.getAttribute('data-scroll'),
    );

    getPageNumber():number {
      const scrolledElementsNumber: number = Math.floor(
        this.getSliderScroll() / this.getItemWidth(),
      );
      const visibleItemsCount = this.getVisibleItemsCount();
      return Math.floor(scrolledElementsNumber / visibleItemsCount) + 1;
    }

    restoreScrolledItemsNumber() {
      const scrolledElementsNumber: number = this.getSavedScrollItemsCount();
      return this.setScroll(this.getItemWidth() * scrolledElementsNumber);
    }

    actionStart = (event) => {
      this.isDown = true;
      this.slider.classList.add('active');
      this.startX = event.pageX - this.slider.offsetLeft;
      this.scrollLeft = this.getSliderScroll();
    };

    sliderLeave = () => {
      this.isDown = false;
      this.slider.classList.remove('active');
    };

    onMoveEnd() {
      const itemWidth = this.getItemWidth();
      this.slider.classList.remove('active');
      const difference = this.getSliderScroll() % itemWidth;
      let animationPromise;
      if (difference >= itemWidth / 2) {
        animationPromise = this.scroll(itemWidth - difference);
      } else {
        animationPromise = this.scroll(difference * (-1));
      }
      return animationPromise.then(
        this.saveScrolledItems,
      ).then(
        this.updateNavigation,
      );
    }

    shouldLoadMore(): boolean {
      const visibleItems = this.getVisibleItemsCount();
      const itemsCount = this.itemsData.length;
      const maxPage = Math.floor(itemsCount / visibleItems);
      const currentPage = this.getPageNumber();
      if (maxPage - currentPage <= 3) {
        return true;
      }
      return false;
    }

    actionEnd = () => {
      if (!this.isMove) return;
      this.isMove = false;
      this.isDown = false;
      this.onMoveEnd().then(
        () => {
          if (this.shouldLoadMore()) {
            this.loadMoreItems();
          }
        },
      );
    };

    actionMove = (event, pageX) => {
      if (!this.isDown) return;
      this.isMove = true;
      event.preventDefault();
      const x = pageX - this.slider.offsetLeft;
      const walk = (x - this.startX) * 3;
      this.setScroll(this.scrollLeft - walk);
      this.updateNavigation();
    };

    addSliderListeners() {
      this.slider.addEventListener('mousemove', event => this.actionMove(event, event.pageX));
      this.slider.addEventListener('touchmove', event => this.actionMove(event, event.changedTouches[0].pageX));
      this.slider.addEventListener('mousedown', event => this.actionStart(event));
      this.slider.addEventListener('touchstart', event => this.actionStart(event.changedTouches[0]));
      this.slider.addEventListener('mouseleave', this.sliderLeave);
      this.slider.addEventListener('touchleave', this.sliderLeave);
      this.slider.addEventListener('touchenter', () => {
        this.isDown = true;
        this.slider.classList.add('active');
      });
      document.body.addEventListener('mouseup', this.actionEnd);
      document.body.addEventListener('touchend', this.actionEnd);
    }

    scrollPages(count: number): Promise<void> {
      const sliderWidth = this.getSliderWidth();
      return this.scroll(sliderWidth * count).then(
        this.saveScrolledItems,
      );
    }
}
