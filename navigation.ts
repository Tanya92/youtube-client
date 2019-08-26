export default class Navigation {
    currentPage: number = 1;

    tooltip: HTMLTemplateElement = document.createElement('template');

    buttonContainer: HTMLDivElement;

    scrollToNextPage: Function;

    scrollToPreviousPage: Function;

    scrollToPrevPreviousPage: Function;

    constructor(
      buttonContainer: HTMLDivElement,
      scrollToNextPage: Function,
      scrollToPreviousPage: Function,
      scrollToPrevPreviousPage: Function,
    ) {
      this.buttonContainer = buttonContainer;
      this.scrollToNextPage = scrollToNextPage;
      this.scrollToPreviousPage = scrollToPreviousPage;
      this.scrollToPrevPreviousPage = scrollToPrevPreviousPage;
    }

    createNavigationMarkup(visibleElements: number, totalElements: number): string {
      let prevPrevButton = '';
      let prevButton = '';
      let currentButton = '';
      let nextButton = '';
      const maxPage = Math.ceil(totalElements / visibleElements);
      if (this.currentPage === 1) {
        currentButton = `<button class="nav_button current" id="current_page_btn">${this.currentPage}</button>`;
        nextButton = '<button class="nav_button" id="next_page_btn"></button>';
      } else if (this.currentPage === 2) {
        prevButton = '<button class="nav_button" id="prev_page_btn"></button>';
        currentButton = `<button class="nav_button current" id="current_page_btn">${this.currentPage}</button>`;
        nextButton = '<button class="nav_button" id="next_page_btn"></button>';
      } else if (this.currentPage === maxPage) {
        prevPrevButton = '<button class="nav_button" id="prev_prev_page_btn"></button>';
        prevButton = '<button class="nav_button" id="prev_page_btn"></button>';
        currentButton = `<button class="nav_button current" id="current_page_btn">${this.currentPage}</button>`;
      } else {
        prevPrevButton = '<button class="nav_button" id="prev_prev_page_btn"></button>';
        prevButton = '<button class="nav_button" id="prev_page_btn"></button>';
        currentButton = `<button class="nav_button current" id="current_page_btn">${this.currentPage}</button>`;
        nextButton = '<button class="nav_button" id="next_page_btn"></button>';
      }
      return `
            ${prevPrevButton}
            ${prevButton}
            ${currentButton}
            ${nextButton}
        `;
    }

    createNavigation(visibleElements: number, totalElements: number):DocumentFragment {
      const navigationTemplate = document.createElement('template');
      navigationTemplate.innerHTML = this.createNavigationMarkup(visibleElements, totalElements);
      return navigationTemplate.content;
    }

    createTooltip(pageNumber: number) {
      const { tooltip } = this;
      tooltip.innerHTML = `
            <div class="tooltip">${pageNumber}</div>
        `;
      return tooltip.content;
    }

    showTooltip(button: HTMLButtonElement, pageNumber: number) {
      button.addEventListener('mousedown', () => {
        const tooltip = this.createTooltip(pageNumber);
        button.appendChild(tooltip);
      });
      button.addEventListener('mouseup', () => {
        const tooltip = button.querySelector('.tooltip');
        button.removeChild(tooltip);
      });
    }

    setCurrentPage(currentPage: number):void {
      this.currentPage = currentPage;
    }

    renderNavigation(visibleElements: number, totalElements: number) {
      const { buttonContainer } = this;
      buttonContainer.innerHTML = '';
      buttonContainer.appendChild(this.createNavigation(visibleElements, totalElements));
      this.addNavigationListeners();
    }

    addNavigationListeners() {
      const nextButton: HTMLButtonElement = this.buttonContainer.querySelector('#next_page_btn');
      if (nextButton) {
        nextButton.addEventListener('click', () => {
          this.scrollToNextPage();
          this.currentPage += 1;
        });
        this.showTooltip(nextButton, this.currentPage + 1);
      }

      const prevButton: HTMLButtonElement = this.buttonContainer.querySelector('#prev_page_btn');
      if (prevButton) {
        prevButton.addEventListener('click', () => {
          this.scrollToPreviousPage();
          this.currentPage -= 1;
        });
        this.showTooltip(prevButton, this.currentPage - 1);
      }

      const prevPreviousButton: HTMLButtonElement = this.buttonContainer.querySelector('#prev_prev_page_btn');
      if (prevPreviousButton) {
        prevPreviousButton.addEventListener('click', () => {
          this.scrollToPrevPreviousPage();
          this.currentPage -= 2;
        });
        this.showTooltip(prevPreviousButton, this.currentPage - 2);
      }
    }
}
