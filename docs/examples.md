# portfolio-arcade examples

## installation examples

### basic installation
```bash
curl -sSfL https://milxzy.github.io/portfolio-arcade/install.sh | bash
```

### install specific version
```bash
curl -sSfL https://milxzy.github.io/portfolio-arcade/install.sh | bash -s -- --version v1.0.0
```

### manual installation
1. download the binary for your platform from [releases](https://github.com/milxzy/portfolio-arcade/releases)
2. extract the archive
3. move the binary to a directory in your PATH
4. make it executable: `chmod +x portfolio-arcade`

## usage examples

### create a basic portfolio
```bash
portfolio-arcade init my-portfolio
```

### create portfolio with specific theme (via interactive selection)
```bash
portfolio-arcade init gaming-portfolio
# then select ps3, ps5, or wii theme in the interactive menu
```

### check current version
```bash
portfolio-arcade --version
```

### check for updates
```bash
portfolio-arcade update
```

### get help
```bash
portfolio-arcade --help
portfolio-arcade init --help
```

## post-installation workflow

after creating your portfolio:

1. **development**:
   ```bash
   cd my-portfolio
   npm run dev
   # visit http://localhost:3000
   ```

2. **edit content**:
   - manually: edit files in `content/` and `data/portfolio.json`
   - with cms: visit `http://localhost:3000/admin` (if enabled)

3. **build for production**:
   ```bash
   npm run build
   npm start  # or deploy the built files
   ```

## deployment examples

### vercel
```bash
npm install -g vercel
vercel
```

### netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir .next
```

### static hosting
```bash
npm run build
npm run export  # if using static export
# upload the out/ directory to your static host
```

## customization examples

### update project info
edit `data/portfolio.json`:
```json
{
  "name": "your name",
  "title": "software engineer",
  "bio": "i build things with code",
  "projects": [
    {
      "title": "cool project",
      "description": "does awesome things",
      "url": "https://github.com/user/project",
      "tags": ["react", "typescript"]
    }
  ]
}
```

### add new projects
create files in `content/projects/`:
```markdown
---
title: "awesome project"
date: "2024-01-15"
tags: ["react", "next.js"]
featured: true
---

this project does amazing things...
```

### customize theme colors
edit the theme variables in `tailwind.config.ts` or the css custom properties in your chosen theme.

## troubleshooting

### installation issues
- **permission denied**: the script tries to install to `~/.local/bin` first, then `/usr/local/bin`
- **command not found**: restart your terminal or run `source ~/.profile`
- **curl not found**: install curl or use wget

### build issues
- **node version**: make sure you're using node 16 or later
- **dependency errors**: try `rm -rf node_modules package-lock.json && npm install`
- **port conflicts**: change the port in the interactive setup or package.json

### update issues
- **behind firewall**: download releases manually from github
- **version check fails**: update will work but you won't get automatic notifications

## platform support

- **linux**: x86_64, aarch64 (arm64)
- **macos**: intel, apple silicon
- **windows**: x86_64

all platforms get the same features and templates.