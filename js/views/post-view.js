function formatDate(dateStr) {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function renderPost(container, meta, bodyHtml) {
  container.innerHTML = '';

  const back = document.createElement('a');
  back.className = 'back-link';
  back.href = '#/';
  back.textContent = '← 목록으로';
  container.appendChild(back);

  const header = document.createElement('div');
  header.className = 'post-header';

  const title = document.createElement('h1');
  title.textContent = meta.title;

  const date = document.createElement('p');
  date.className = 'post-date';
  date.textContent = formatDate(meta.date);

  header.appendChild(title);
  header.appendChild(date);
  container.appendChild(header);

  const body = document.createElement('div');
  body.className = 'post-body';
  body.innerHTML = bodyHtml;
  container.appendChild(body);
}

export function renderNotFound(container) {
  container.innerHTML = '';

  const back = document.createElement('a');
  back.className = 'back-link';
  back.href = '#/';
  back.textContent = '← 목록으로';
  container.appendChild(back);

  const wrap = document.createElement('div');
  wrap.className = 'not-found';

  const heading = document.createElement('h1');
  heading.textContent = '글을 찾을 수 없습니다';

  const message = document.createElement('p');
  message.textContent = '요청하신 글이 존재하지 않거나 삭제되었습니다.';

  wrap.appendChild(heading);
  wrap.appendChild(message);
  container.appendChild(wrap);
}
