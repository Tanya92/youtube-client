import Slider from './slider';
import ItemModel from './item-model';

test('slider.createItemMarkup should return correct markup', () => {
  const item: ItemModel = {
    snippet: {
      thumbnails: {
        medium: {
          url: 'https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg',
        },
      },
      title: 'Learn JavaScript - Full Course for Beginners',
      channelTitle: 'freeCodeCamp.org',
      publishedAt: '2018-12-10',
      description: 'This complete 134-part JavaScript tutorial for beginners will teach you everything you need to know to get started with the JavaScript programming language.',
    },
    id: {
      videoId: 'PkZNo7MFNFg',
    },
    statistics: {
      viewCount: 1177067,
    },
  };
  expect(Slider.createItemMarkup(item)).toBe(
    `
            <div class="search_item_container">
                <div class="search_item">
                    <img class="imageSrc" src="https://i.ytimg.com/vi/PkZNo7MFNFg/mqdefault.jpg" alt="thumbnail">
                    <div class="title">
                        <a class="youtube_page" href="https://www.youtube.com/watch?v=PkZNo7MFNFg" target="_blank">
                            <p>Learn JavaScript - Full Course for Beginners</p>
                        </a>
                    </div>
                    <div class="information">
                        <img class="icon_img" src="./assets/icon_man.svg" alt="icon_man">
                        <p class="info_text">freeCodeCamp.org</p>
                        <img class="icon_img" src="./assets/icon_calendar.svg" alt="icon_calendar">
                        <p class="info_text">2018-12-10</p>
                        <img class="icon_img" src="./assets/icon_eye.svg" alt="icon_view">
                        <p class="info_text">1177067</p>
                    </div>
                    <p class="description">This complete 134-part JavaScript tutorial for beginners will teach you everything you need to know to get started with the JavaScript programming language.</p>
                </div>
            </div>
        `,
  );
});
