import * as params from '@params';

const comment = params.comment.provider
const default_theme_config = params.defaulttheme
const icon_dark = `
<svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" stroke-width="1.75">
  <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"></path>
  <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"></path>
</svg>
`
const icon_light = `
<svg xmlns="http://www.w3.org/2000/svg" x-bind:width="size" x-bind:height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" x-bind:stroke-width="stroke" stroke-linecap="round" stroke-linejoin="round" width="28" height="28" stroke-width="1.75">
  <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"></path>
</svg>
`
const THEME_LIGHT = default_theme_config === 'system' ? 'light' : default_theme_config
const THEME_DARK = 'dark'

/** @type {HTMLElement} */
let toggler
/** @type {HTMLIFrameElement} */
let utterances
/** @type {HTMLIFrameElement} */
let giscus

/** @param {string} id */
export function setup_theme_switch(id) {
  if (!toggler) {
    toggler = document.getElementById(id)
  }
  toggler.innerHTML = localStorage.theme === THEME_LIGHT ? icon_light : icon_dark
  toggler.addEventListener('click', switch_theme);
}

function switch_theme() {
  const current = localStorage.getItem('theme')
  const next = current === THEME_LIGHT ? THEME_DARK : THEME_LIGHT

  switch_xlog_theme(current, next)

  switch (comment) {
    case 'utterances':
      switch_utterances_theme(`github-${next}`)
      break
    case 'giscus':
      switch_giscus_theme(next)
      break
    default:
  }
}

/**
 * @param {string} current  
 * @param {string} next 
 */
function switch_xlog_theme(current, next) {
  const { classList } = document.documentElement
  const icon = next === THEME_LIGHT ? icon_light : icon_dark;

  classList.remove(current);
  classList.add(next);
  localStorage.setItem('theme', next);
  toggler.innerHTML = icon;
}

/** @param {string} theme  */
function switch_utterances_theme(theme) {
  if (theme !== 'dark') {
    theme = 'light'
  }
  utterances = utterances || document.querySelector('iframe.utterances-frame')
  if (!utterances) return
  utterances.contentWindow.postMessage({ type: 'set-theme', theme }, 'https://utteranc.es')
}

/** @param {string} theme */
function switch_giscus_theme(theme) {
  if (theme !== 'dark') {
    theme = 'light_protanopia'
  }
  giscus = giscus || document.querySelector('iframe.giscus-frame')
  if (!giscus) return
  giscus.contentWindow.postMessage({ giscus: { setConfig: { theme } } }, 'https://giscus.app')
}
