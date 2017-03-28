import { SnippetsManagerPage } from './app.po';

describe('snippets-manager App', () => {
  let page: SnippetsManagerPage;

  beforeEach(() => {
    page = new SnippetsManagerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
