/**
 * =============================================
 * COMPONENTES UI — Funciones de renderizado
 * Cada función genera HTML de un componente
 * =============================================
 */

/** Formatea números de likes al estilo Instagram */
function formatLikes(count) {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1).replace('.0', '')} M`;
  if (count >= 10000) return `${Math.floor(count / 1000)} mil`;
  if (count >= 1000) return count.toLocaleString('es-ES');
  return count.toString();
}

/** SVG: corazón outline */
function iconHeart(outline = true) {
  if (outline) {
    return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>`;
  }
  return `<svg class="icon icon--filled" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.916c2.633-2.334 4.998-4.337 4.998-7.722a6.982 6.982 0 0 0-6.982-6.982z"/>
  </svg>`;
}

/** SVG: comentario */
function iconComment() {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"/>
  </svg>`;
}

/** SVG: compartir / enviar */
function iconShare() {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>`;
}

/** SVG: guardar / bookmark */
function iconBookmark(filled = false) {
  if (filled) {
    return `<svg class="icon icon--filled" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5 22.5 12 16.875 4.5 22.5V4.875A2.625 2.625 0 0 1 7.125 2.25h9.75A2.625 2.625 0 0 1 19.5 4.875Z"/>
    </svg>`;
  }
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
    <path d="M19.5 22.5 12 16.875 4.5 22.5V4.875A2.625 2.625 0 0 1 7.125 2.25h9.75A2.625 2.625 0 0 1 19.5 4.875Z"/>
  </svg>`;
}

/** SVG: menú tres puntos */
function iconMenu() {
  return `<svg class="icon" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
  </svg>`;
}

/**
 * Renderiza un item de story
 * @param {Object} story - Datos de la historia
 */
function renderStory(story) {
  const ringClass = story.isOwn
    ? 'story__ring story__ring--own'
    : story.seen
      ? 'story__ring story__ring--seen'
      : 'story__ring';

  const addButton = story.isOwn
    ? '<span class="story__add-btn" aria-hidden="true">+</span>'
    : '';

  return `
    <article class="story" data-story-id="${story.id}">
      <div class="${ringClass}">
        <div class="story__avatar-wrap">
          <img class="story__avatar" src="${story.avatar}" alt="${story.username}" loading="lazy">
          ${addButton}
        </div>
      </div>
      <span class="story__username">${story.username}</span>
    </article>
  `;
}

/**
 * Renderiza todos los stories
 * @param {Array} stories - Lista de historias
 */
function renderStories(stories) {
  return stories.map(renderStory).join('');
}

/**
 * Renderiza puntos de carrusel
 * @param {number} count - Número de slides
 */
function renderCarouselDots(count) {
  if (count <= 1) return '';
  return `<div class="post__carousel-dots">
    ${Array.from({ length: count }, (_, i) =>
      `<span class="post__dot ${i === 0 ? 'post__dot--active' : ''}"></span>`
    ).join('')}
  </div>`;
}

/**
 * Renderiza una tarjeta de publicación completa
 * @param {Object} post - Datos del post
 */
function renderPost(post) {
  const locationHTML = post.location
    ? `<span class="post__location">${post.location}</span>`
    : '';

  const carouselDots = post.carousel ? renderCarouselDots(post.carouselCount || 2) : '';

  return `
    <article class="post" data-post-id="${post.id}">
      <!-- Cabecera -->
      <header class="post__header">
        <div class="post__user">
          <a href="#" class="post__avatar-link">
            <img class="post__avatar" src="${post.avatar}" alt="${post.username}" loading="lazy">
          </a>
          <div class="post__user-info">
            <a href="#" class="post__username">${post.username}</a>
            ${locationHTML}
          </div>
        </div>
        <button class="post__menu-btn" aria-label="Más opciones">${iconMenu()}</button>
      </header>

      <!-- Imagen -->
      <div class="post__media" data-double-tap>
        <img class="post__image" src="${post.image}" alt="Publicación de ${post.username}" loading="lazy">
        ${carouselDots}
      </div>

      <!-- Acciones -->
      <div class="post__actions">
        <div class="post__actions-left">
          <button class="post__action-btn ${post.liked ? 'post__action-btn--liked' : ''}"
                  aria-label="${post.liked ? 'Quitar me gusta' : 'Me gusta'}"
                  data-action="like">
            ${post.liked ? iconHeart(false) : iconHeart(true)}
          </button>
          <button class="post__action-btn" aria-label="Comentar" data-action="comment">
            ${iconComment()}
          </button>
          <button class="post__action-btn" aria-label="Compartir" data-action="share">
            ${iconShare()}
          </button>
        </div>
        <button class="post__action-btn ${post.saved ? 'post__action-btn--saved' : ''}"
                aria-label="${post.saved ? 'Quitar de guardados' : 'Guardar'}"
                data-action="save">
          ${iconBookmark(post.saved)}
        </button>
      </div>

      <!-- Likes, caption, comentarios -->
      <div class="post__body">
        <p class="post__likes" data-likes="${post.likes}">${formatLikes(post.likes)} Me gusta</p>
        <p class="post__caption">
          <a href="#" class="post__caption-username">${post.username}</a>
          ${post.caption}
        </p>
        <p class="post__view-comments">Ver los ${post.commentsCount} comentarios</p>
        <time class="post__timestamp">${post.timestamp}</time>
      </div>

      <!-- Input de comentario -->
      <div class="post__comment-box">
        <input type="text" class="post__comment-input" placeholder="Añade un comentario..." aria-label="Añade un comentario">
        <button class="post__comment-submit" data-action="submit-comment">Publicar</button>
      </div>
    </article>
  `;
}

/**
 * Renderiza el feed completo
 * @param {Array} posts - Lista de publicaciones
 */
function renderFeed(posts) {
  return posts.map(renderPost).join('');
}
