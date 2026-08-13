function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function renderList(container, posts) {
  container.innerHTML = '';

  if (posts.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'not-found';
    empty.textContent = '아직 작성된 글이 없습니다.';
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'post-list';

  posts.forEach(function (post) {
    const item = document.createElement('li');
    item.className = 'post-list-item';

    const link = document.createElement('a');
    link.className = 'post-list-title';
    link.href = '#/post/' + encodeURIComponent(post.slug);
    link.textContent = post.title;

    const date = document.createElement('span');
    date.className = 'post-list-date';
    date.textContent = formatDate(post.date);

    item.appendChild(link);
    item.appendChild(date);

    if (post.summary) {
      const summary = document.createElement('p');
      summary.className = 'post-list-summary';
      summary.textContent = post.summary;
      item.appendChild(summary);
    }

    list.appendChild(item);
  });

  container.appendChild(list);
}
