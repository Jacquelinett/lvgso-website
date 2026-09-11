# LVGSO Website

Source for [lvgso.org](https://lvgso.org) — the Lehigh Valley Gamer Symphony
Orchestra's website. Built with Jekyll + Bootstrap 5, hosted on GitHub Pages.

## Local development

Requires Ruby + Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Visit `http://127.0.0.1:4000`. The site rebuilds automatically as you edit
files.

## Project structure

```
_config.yml         Site settings (title, email, social links, contact form URL)
_layouts/default.html   Base page template (head + navbar + content + footer)
_includes/           Shared partials: head.html, navbar.html, footer.html
_data/events.yml     Upcoming events — edit this to add/remove events
assets/css/custom.css   The light blue/white theme (colors, fonts, components)
assets/img/gallery/   Gallery photos shown on the home page
index.html           Home page (hero, about tabs, gallery, contact) — /
events.html          Upcoming Events page — /events/
CNAME                Custom domain for GitHub Pages (lvgso.org)
```

## Things to customize before launch

1. **Contact form.** The "Join Us" nav button and the contact buttons on
   the home/events pages all link straight out to a Google Form.
   Right now they point at a placeholder URL. To wire up your real form:
   - Create a Google Form for intake (name, email, instrument, message, etc).
   - In the Form editor, click **Send**, then the link icon, and copy the
     shareable URL (a `forms.gle/...` link, or the full `docs.google.com/forms/...` URL).
   - Paste it into `contact_form_url` in `_config.yml`.

2. **Gallery photos.** `assets/img/gallery/` currently has six pastel SVG
   placeholders (`gallery-1.svg` … `gallery-6.svg`). Replace them with real
   rehearsal/concert photos (JPG/PNG/WebP work fine), then update the file
   list in the `gallery_images` line in `index.html` to match your new
   filenames.

3. **Events.** Add, edit, or remove entries in `_data/events.yml`. Events
   are sorted by date automatically — no need to keep them in order.

4. **Social links & email.** Update `email`, `location`, and the `social`
   block (facebook/instagram/discord/youtube) in `_config.yml`. Empty
   strings are hidden automatically in the footer.

5. **Favicon.** `assets/img/icons/favicon.svg` is a simple placeholder icon
   — swap it for a real LVGSO logo whenever you have one.

## Deploying to GitHub Pages with the lvgso.org domain

1. Create a GitHub repo (e.g. `lvgso/lvgso.github.io` or any repo name —
   custom domains work either way) and push this code to it:

   ```bash
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

2. In the repo's **Settings → Pages**, set the source to the `main` branch
   (root). GitHub Pages will build the Jekyll site automatically — no
   Actions workflow needed for a standard `github-pages`-gem site.

3. The `CNAME` file already in this repo points GitHub Pages at
   `lvgso.org`. In your domain registrar's DNS settings, add:
   - An `A` record for the apex domain (`lvgso.org`) pointing at GitHub
     Pages' IPs (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`), or
   - A `CNAME` record for `www.lvgso.org` pointing at
     `<your-username>.github.io`, depending on which you want as primary.

   See [GitHub's custom domain docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site)
   for the current recommended records.

4. Once DNS propagates, check "Enforce HTTPS" in the Pages settings.

## Theme notes

The site uses a pastel Windows 98 desktop look — beveled "window" panels,
gradient title bars, and the classic Pixelated MS Sans Serif UI font —
layered on top of Bootstrap 5 (loaded via CDN in `_includes/head.html`).

- Colors and component styles live in `assets/css/custom.css`, defined as
  CSS custom properties at the top of the file (`--win-face`,
  `--win-desktop`, `--win-console-bg`, etc.) if you want to adjust the look.
- The bitmap UI font is self-hosted in `assets/fonts/` (four small woff/woff2
  files) and used for headings, title bars, and buttons; body copy uses a
  system Tahoma/Verdana stack for readability.
- Reusable window-chrome classes: `.win98-window` / `.win98-titlebar` /
  `.win98-controls` / `.win98-body` for a generic bordered "window", plus
  `.card-titlebar` (about page cards) and `.event-titlebar` (event cards,
  color-coded by `type: rehearsal | concert | social` in `_data/events.yml`).
