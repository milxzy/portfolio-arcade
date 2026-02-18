# portfolio arcade

hey! this generates portfolio websites that look like gaming console interfaces. built it because every dev portfolio looks the same these days.

## what it does

makes portfolio sites themed after consoles you actually used. pick from ps3's crossbar menu, ps5's modern ui, or the wii channel grid.

handles all the boring setup - copying files, installing dependencies, starting dev servers. you just pick a theme and add your projects.

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

**content management**
- decap cms if you want web editing that commits to git
- payload cms if you need more power (requires a server)
- manual if you like editing files directly

**basic info**
name, title, dev server port. nothing fancy.

then it does its thing - copies the template, runs npm install, starts the dev server. usually takes 30-60 seconds depending on your internet.

## what you get

a next.js site with your theme applied:

> screenshots and demo GIFs coming soon

each theme feels different:

**ps3**: dark, that sliding navigation everyone remembers. works really well for showcasing code projects.

**ps5**: clean cards, nice typography. modern without being flashy.

**wii**: bright colors, rounded everything. surprisingly good for creative portfolios.

## managing content

**with decap**: visit `/admin` after setup, edit through a web interface. changes get committed to your git repo automatically.

**with payload**: more features but you run your own server. good for complex needs.

**manually**: just edit the markdown files in `content/projects/` and `data/portfolio.json`. fastest if you're comfortable with code.

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
