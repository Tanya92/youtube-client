import Navigation from './navigation';

test('navigation.createNavigationMarkup should return correct markup', () => {
  const navigation = new Navigation(null, null, null, null);
  const visibleElements = 4;
  const totalElements = 40;
  navigation.setCurrentPage(1);
  expect(navigation.createNavigationMarkup(visibleElements, totalElements)).toBe(
    `
            
            
            <button class="nav_button current" id="current_page_btn">1</button>
            <button class="nav_button" id="next_page_btn"></button>
        `,
  );

  navigation.setCurrentPage(2);
  expect(navigation.createNavigationMarkup(visibleElements, totalElements)).toBe(
    `
            
            <button class="nav_button" id="prev_page_btn"></button>
            <button class="nav_button current" id="current_page_btn">2</button>
            <button class="nav_button" id="next_page_btn"></button>
        `,
  );

  navigation.setCurrentPage(10);
  expect(navigation.createNavigationMarkup(visibleElements, totalElements)).toBe(
    `
            <button class="nav_button" id="prev_prev_page_btn"></button>
            <button class="nav_button" id="prev_page_btn"></button>
            <button class="nav_button current" id="current_page_btn">10</button>
            
        `,
  );

  navigation.setCurrentPage(5);
  expect(navigation.createNavigationMarkup(visibleElements, totalElements)).toBe(
    `
            <button class="nav_button" id="prev_prev_page_btn"></button>
            <button class="nav_button" id="prev_page_btn"></button>
            <button class="nav_button current" id="current_page_btn">5</button>
            <button class="nav_button" id="next_page_btn"></button>
        `,
  );
});
