/**
 * Tailwind is compiled ahead of time into assets/css/tailwind.css (the pages
 * used to load the Play CDN, which ships the whole compiler to every visitor).
 *
 * After adding or changing Tailwind classes in the HTML or JS, rebuild with:
 *   npx tailwindcss@3.4.17 -i assets/css/tailwind.input.css -o assets/css/tailwind.css
 *
 * Built without --minify on purpose: that output was checked rule-for-rule against
 * what the CDN generated, and it is only ~4 KB gzipped either way.
 */
module.exports = {
  content: ['./*.html', './assets/js/*.js'],
  // Bootstrap already provides the base reset
  corePlugins: {
    preflight: false,
  },
};
