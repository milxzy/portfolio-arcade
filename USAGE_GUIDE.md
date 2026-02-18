# usage guide

## setup

you'll need rust and node.js. any package manager works fine.

## quick start

```bash
# build the thing
cargo build --release

# use it
./target/release/portfolio-arcade init my-portfolio
```

it walks you through four steps:

**theme selection**
```
select your console theme:
  > ps5 modern ui
    ps3 xmb interface  
    wii channel menu
```
arrow keys to navigate, enter to pick.

**project details**
```
project details:
  name: my-portfolio
  author: [your name]
  title: [software developer]
  port: [3000]
```
basic info - name, title, dev server port.

**github projects**
```
add your github project urls:
  > https://github.com/you/project-one
    https://github.com/you/project-two
```
paste in the github repos you want featured. at least one is required.

**confirmation**
```
theme: ps5 modern ui
project: my-portfolio
author: your name
port: 3000

ready to generate your portfolio?
```
review everything, hit enter to generate.

## what happens next

copies files, updates configs, runs npm install, starts a dev server. takes about 30-60 seconds depending on internet speed.

when it's done:

```
your portfolio is ready!

  local:   http://localhost:3000
  admin:   http://localhost:3000/admin

next steps:
  1. open the local url in your browser
  2. edit projects in content/projects/ or use the cms
  3. customize colors and styling
```

## project structure

```
my-portfolio/
├── app/                    # next.js app
├── components/            # react components
├── content/              # markdown files
│   └── projects/         # your projects
├── data/                # portfolio config
│   └── portfolio.json   # main config
├── public/              # static files
│   ├── admin/           # cms admin (if using decap)
│   └── projects/        # project images
└── package.json         # dependencies
```

## adding content

**with a cms**: visit `/admin` and use the web interface.

**editing files**: add markdown files to `content/projects/` or edit `data/portfolio.json` directly.

**changing colors**: edit `tailwind.config.ts`
**changing fonts**: modify `app/layout.tsx`

### updating your info

edit `data/portfolio.json`:
```json
{
  "user": {
    "name": "your name",
    "title": "your title", 
    "bio": "tell people about yourself"
  }
}
```

## common problems

**port 3000 in use**: kill what's using it (`lsof -i :3000` then `kill -9 <pid>`) or pick a different port.

**can't find node.js**: install from nodejs.org or your package manager.

**permission denied**: run from a directory you own, like home or desktop.

## other stuff

**package managers**: detects npm, pnpm, or yarn automatically.

**multiple portfolios**: generate as many as you want with different themes.

**keyboard shortcuts**: arrow keys, tab between fields, q to quit.

## after setup

1. add your real projects and content
2. tweak colors and styling to match your vibe
3. deploy wherever (vercel, netlify, github pages)

that's it. check `readme.md` if you need more details.