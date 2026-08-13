let cachedPosts = null;

async function loadPosts() {
  if (cachedPosts) return cachedPosts;
  const response = await fetch('posts/posts.json');
  if (!response.ok) {
    throw new Error('posts.json 을 불러오지 못했습니다.');
  }
  const posts = await response.json();
  posts.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  cachedPosts = posts;
  return cachedPosts;
}

export async function getPostList() {
  return loadPosts();
}

export async function getPostMeta(slug) {
  const posts = await loadPosts();
  return posts.find(function (post) { return post.slug === slug; }) || null;
}
