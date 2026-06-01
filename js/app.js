/**
 * =============================================
 * APP — Inicialización e interacciones
 * Punto de entrada de la aplicación
 * =============================================
 */

(function initApp() {
  'use strict';

  // Redirigir al login si no hay sesión
  if (sessionStorage.getItem('insta_logged_in') !== 'true') {
    window.location.replace('index.html');
    return;
  }

  // Referencias DOM
  const storiesContainer = document.getElementById('stories-container');
  const feedContainer = document.getElementById('feed-container');
  const bottomNavItems = document.querySelectorAll('.bottom-nav__item');

  // Estado local de posts (clon mutable de datos mock)
  let postsState = POSTS_DATA.map((p) => ({ ...p }));

  /* ─── Renderizado inicial ─── */

  function render() {
    storiesContainer.innerHTML = renderStories(STORIES_DATA);
    feedContainer.innerHTML = renderFeed(postsState);
    bindPostEvents();
  }

  /* ─── Interacciones de posts ─── */

  function bindPostEvents() {
    feedContainer.querySelectorAll('.post').forEach((postEl) => {
      const postId = postEl.dataset.postId;
      const likeBtn = postEl.querySelector('[data-action="like"]');
      const saveBtn = postEl.querySelector('[data-action="save"]');
      const mediaEl = postEl.querySelector('[data-double-tap]');
      const commentInput = postEl.querySelector('.post__comment-input');
      const commentSubmit = postEl.querySelector('[data-action="submit-comment"]');

      // Like / Unlike
      likeBtn.addEventListener('click', () => toggleLike(postId, postEl));

      // Guardar / Quitar guardado
      saveBtn.addEventListener('click', () => toggleSave(postId, postEl));

      // Doble tap para like (comportamiento Instagram)
      let lastTap = 0;
      mediaEl.addEventListener('click', (e) => {
        const now = Date.now();
        if (now - lastTap < 300) {
          const post = postsState.find((p) => p.id === postId);
          if (post && !post.liked) {
            toggleLike(postId, postEl);
            showLikeAnimation(mediaEl);
          } else if (post && post.liked) {
            showLikeAnimation(mediaEl);
          }
          e.preventDefault();
        }
        lastTap = now;
      });

      // Comentario: activar botón Publicar
      commentInput.addEventListener('input', () => {
        const hasText = commentInput.value.trim().length > 0;
        commentSubmit.classList.toggle('post__comment-submit--active', hasText);
      });

      commentSubmit.addEventListener('click', () => {
        if (commentInput.value.trim()) {
          commentInput.value = '';
          commentSubmit.classList.remove('post__comment-submit--active');
        }
      });
    });
  }

  /** Alterna estado de "Me gusta" */
  function toggleLike(postId, postEl) {
    const post = postsState.find((p) => p.id === postId);
    if (!post) return;

    post.liked = !post.liked;
    post.likes += post.liked ? 1 : -1;

    const likeBtn = postEl.querySelector('[data-action="like"]');
    const likesEl = postEl.querySelector('.post__likes');

    likeBtn.classList.toggle('post__action-btn--liked', post.liked);
    likeBtn.innerHTML = post.liked ? iconHeart(false) : iconHeart(true);
    likeBtn.setAttribute('aria-label', post.liked ? 'Quitar me gusta' : 'Me gusta');
    likesEl.textContent = `${formatLikes(post.likes)} Me gusta`;
    likesEl.dataset.likes = post.likes;
  }

  /** Alterna estado de guardado */
  function toggleSave(postId, postEl) {
    const post = postsState.find((p) => p.id === postId);
    if (!post) return;

    post.saved = !post.saved;

    const saveBtn = postEl.querySelector('[data-action="save"]');
    saveBtn.classList.toggle('post__action-btn--saved', post.saved);
    saveBtn.innerHTML = iconBookmark(post.saved);
    saveBtn.setAttribute('aria-label', post.saved ? 'Quitar de guardados' : 'Guardar');
  }

  /** Animación de corazón al doble tap */
  function showLikeAnimation(container) {
    const existing = container.querySelector('.like-animation');
    if (existing) existing.remove();

    const anim = document.createElement('div');
    anim.className = 'like-animation';
    anim.innerHTML = iconHeart(false);
    container.appendChild(anim);

    anim.addEventListener('animationend', () => anim.remove());
  }

  /* ─── Navegación inferior ─── */

  bottomNavItems.forEach((item) => {
    item.addEventListener('click', () => {
      bottomNavItems.forEach((nav) => nav.classList.remove('bottom-nav__item--active'));
      item.classList.add('bottom-nav__item--active');
    });
  });

  /* ─── Stories: marcar como vista al tocar ─── */

  storiesContainer.addEventListener('click', (e) => {
    const storyEl = e.target.closest('.story');
    if (!storyEl || storyEl.dataset.storyId === 'own') return;

    const storyId = storyEl.dataset.storyId;
    const story = STORIES_DATA.find((s) => s.id === storyId);
    if (story && !story.seen) {
      story.seen = true;
      const ring = storyEl.querySelector('.story__ring');
      ring.classList.add('story__ring--seen');
    }
  });

  /* ─── Modo oscuro: detectar preferencia del sistema ─── */

  function applyTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]')
      .setAttribute('content', prefersDark ? '#000000' : '#ffffff');
  }

  applyTheme();
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

  /* ─── Arranque ─── */

  render();
})();
