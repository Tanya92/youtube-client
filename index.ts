import { debounce } from 'lodash';
import ItemModel from './item-model';
import Slider from './slider';
import Navigation from './navigation';
import './style.css';

class App {
    inputField: HTMLInputElement;

    buttonSearch: Element;

    nextPageToken: string;

    items: ItemModel[];

    slider: Slider;

    sliderContainer: HTMLDivElement;

    navigation: Navigation;

    bootstrap() {
      const appTemplate = document.createElement('template');
      appTemplate.innerHTML = `
            <div class="search_container">
            <input class="input_field" placeholder="Enter your request here">
            <button class="button_search">
                <img src="./assets/icon_search.svg" alt="icon_search" class="icon_search">
            </button>
            </div>
            <div class="search_results"></div>
            <div class="button_container" id="button_container"></div>
        `;
      document.body.appendChild(appTemplate.content);
      this.sliderContainer = document.querySelector('.search_results') as HTMLDivElement;
      this.slider = new Slider(
        this.sliderContainer,
        this.updateNavigationOnScroll,
        this.loadMoreItems,
      );
      this.navigation = new Navigation(
            document.getElementById('button_container') as HTMLDivElement,
            this.scrollToNextPage,
            this.scrollToPreviousPage,
            this.scrollToPrevPreviousPage,
      );
    }

    addSearchListeners() {
      this.inputField = document.querySelector('.input_field');
      this.buttonSearch = document.querySelector('.button_search');
      this.inputField.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.keyCode === 13) {
          this.searchListener();
        }
      });
      this.buttonSearch.addEventListener('click', this.searchListener);
    }

    searchListener = () => {
      this.onSearch(this.inputField.value, true);
    };

    onSearch(query: string, clear: boolean) {
      if (clear) {
        this.items = [];
      }
      this.search(query, clear).then((resp) => {
        if (clear) {
          this.slider.clear();
        }
        this.slider.appendItems(resp.items);
        this.updateNavigation();
      });
    }

    search(query: string, isFirstPage: boolean) {
      const key = 'AIzaSyDDQPG1WbVE34hhLNTGgvBZvfd0gl7h18c';
      let nextParam;
      if (!isFirstPage) {
        nextParam = `&pageToken=${this.nextPageToken}`;
      } else {
        nextParam = '';
      }
      return fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${key}&type=video${nextParam}&part=snippet&maxResults=15&q=${query}`,
      ).then(resp => resp.json())
        .then((searchResp) => {
          const searchData = searchResp;
          const ids = searchData.items.map(item => item.id.videoId).join(',');
          this.nextPageToken = searchData.nextPageToken;// eslint-disable-line prefer-destructuring
          return fetch(
            `https://www.googleapis.com/youtube/v3/videos?key=${key}&id=${ids}&part=snippet,statistics`,
          ).then(resp => resp.json())
            .then((statisticsData) => {
              searchData.items = searchData.items.map(item => Object.assign(
                {},
                statisticsData.items.find(elem => elem.id === item.id.videoId),
                item,
              ));
              return searchData;
            });
        });
    }

    updateNavigation = () => {
      this.navigation.renderNavigation(
        this.slider.getVisibleItemsCount(),
        this.items.length,
      );
    };

    updateNavigationOnScroll = debounce(() => {
      const pageNumber = this.slider.getPageNumber();
      this.navigation.setCurrentPage(pageNumber);
      this.updateNavigation();
    }, 50);

    loadMoreItems = () => {
      this.onSearch(this.inputField.value, false);
    };

    scrollToNextPage = () => {
      this.slider.scrollPages(1).then(
        () => {
          this.updateNavigation();
        },
      );
    };

    scrollToPreviousPage = () => {
      this.slider.scrollPages(-1).then(
        () => {
          this.updateNavigation();
        },
      );
    };

    scrollToPrevPreviousPage = () => {
      this.slider.scrollPages(-2).then(
        () => {
          this.updateNavigation();
        },
      );
    };

    onResize = () => {
      if (this.sliderContainer.childNodes.length) {
        this.slider.restoreScrolledItemsNumber();
        this.updateNavigationOnScroll();
      }
    };


    addEventListeners() {
      window.addEventListener('resize', this.onResize);
    }

    start() {
      this.bootstrap();
      this.addSearchListeners();
      this.addEventListeners();
    }
}

const app = new App();
app.start();
