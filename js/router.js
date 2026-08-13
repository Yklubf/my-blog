import { getPostList, getPostMeta } from './posts.js';
import { parseMarkdown } from './markdown.js';
import { renderList } from './views/list-view.js';
import { renderPost, renderNotFound } from './views/post-view.js';

const container = document.getElementById('app');

async function showListView() {
  try {
    const posts = await getPostList();
    renderList(container, posts);
    document.title = 'My Blog';
  } catch (err) {
    container.innerHTML = '<p class="not-found">글 목록을 불러오지 못했습니다.</p>';
  }
}

async function showPostView(slug) {
  try {
    const meta = await getPostMeta(slug);
    if (!meta) {
      renderNotFound(container);
      document.title = '글을 찾을 수 없습니다 · My Blog';
      return;
    }

    const response = await fetch('posts/' + meta.file);
    if (!response.ok) {
      renderNotFound(container);
      document.title = '글을 찾을 수 없습니다 · My Blog';
      return;
    }

    const markdown = await response.text();
    const html = parseMarkdown(markdown);
    renderPost(container, meta, html);
    document.title = meta.title + ' · My Blog';
  } catch (err) {
    renderNotFound(container);
    document.title = '글을 찾을 수 없습니다 · My Blog';
  }
}

async function handleRoute() {
  const hash = window.location.hash;

  if (!hash || hash === '#') {
    window.location.hash = '#/';
    return;
  }

  const postMatch = hash.match(/^#\/post\/([^/]+)$/);

  if (hash === '#/') {
    await showListView();
  } else if (postMatch) {
    await showPostView(decodeURIComponent(postMatch[1]));
  } else {
    renderNotFound(container);
    document.title = '글을 찾을 수 없습니다 · My Blog';
  }

  window.scrollTo(0, 0);
}

export function initRouter() {
  window.addEventListener('hashchange', handleRoute);
  handleRoute();
}
