# portfolio arcade

hey! this generates portfolio websites that look like gaming console interfaces. built it because every dev portfolio looks the same these days.

## what it does

makes portfolio sites themed after consoles you actually used. pick from ps3's crossbar menu, ps5's modern ui, or the wii channel grid.

handles the boring setup - copying template files, fetching your github project data, and wiring everything together. you just pick a theme, paste your repo urls, and run `npm install && npm run dev`.

## quick install

install with a single command (works on linux, macos, windows):

```bash
curl -sSfL https://milxzy.github.io/portfolio-arcade/install.sh | bash
```

then create your first portfolio:

```bash
portfolio-arcade init my-portfolio
```

## alternative: build from source

```bash
# grab the code and build it
git clone https://github.com/milxzy/portfolio-arcade.git
cd portfolio-arcade
cargo build --release

# make your portfolio
./target/release/portfolio-arcade init my-portfolio
```

## how it works

run `portfolio-arcade init` and it walks you through everything:

**pick your vibe**
- ps3 xmb - that crossbar thing from 2006, surprisingly clean
- ps5 ui - modern cards and smooth animations
- wii channels - colorful tiles, very nintendo

**basic info**
project name, your name, and your developer title. nothing fancy.

**github projects**
paste in your github repo urls. it fetches metadata, languages, and readme content automatically.

then it copies the template and writes your portfolio data. once done, you run `npm install` and `npm run dev` yourself.

## what you get

a next.js site with your theme applied:

> screenshots and demo GIFs coming soon

each theme feels different:

**ps3**: dark, that sliding navigation everyone remembers. works really well for showcasing code projects.

**ps5**: clean cards, nice typography. modern without being flashy.

**wii**: bright colors, rounded everything. surprisingly good for creative portfolios.

## managing content

edit your portfolio data directly in `public/data/portfolio.json` and the markdown files in `content/projects/`. fastest if you're comfortable with code.

## commands

after installation, you can use these commands:

```bash
# create a new portfolio (starts interactive setup)
portfolio-arcade init my-portfolio

# check for updates
portfolio-arcade update

# get help
portfolio-arcade --help
```

## updating

portfolio-arcade automatically checks for updates when you run it. you can also manually check:

```bash
portfolio-arcade update
```

or reinstall with the latest version:

```bash
curl -sSfL https://milxzy.github.io/portfolio-arcade/install.sh | bash
```

## building from source

need rust and node.js installed.

```bash
git clone https://github.com/milxzy/portfolio-arcade.git
cd portfolio-arcade
cargo build --release
```

the code is pretty straightforward:
- `src/cli.rs` - handles command line parsing
- `src/tui/` - terminal interface with ratatui
- `src/generator/` - copies templates and updates configs
- `src/github/` - github api client for fetching repo data
- `src/models/` - data structures for portfolio config and themes
- `src/update.rs` - auto-update functionality
- `templates/` - the actual portfolio templates

## contributing

fork it, make your changes, send a pr. 

keep things consistent with the existing style - lowercase comments, readable code over clever tricks. check the existing files for examples.

## what's coming

thinking about xbox 360 blades next, maybe some retro console themes. a custom theme builder would be fun too.

## license

mit - do whatever you want with it.

---

made this because portfolios should be more interesting than another bootstrap template.
