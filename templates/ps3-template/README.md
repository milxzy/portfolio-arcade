# ps3 xmb portfolio template

a portfolio website themed after the iconic ps3 crossbar menu interface. features smooth wave animations, profile switching, and that nostalgic menu navigation everyone remembers.

## features

- authentic xmb crossbar interface
- animated wave background
- profile-based content organization (artist, engineer, stranger)
- boot screen animation
- scanline overlay toggle
- keyboard navigation
- fully responsive
- dark theme optimized

## quick start

```bash
# install dependencies
npm install

# start dev server
npm run dev

# build for production
npm run build
```

open [http://localhost:3000](http://localhost:3000) in your browser.

## customizing your portfolio

### update your info

edit `lib/xmb-data.ts` to customize all content:

```typescript
// lines 7-48: your profile information
export const profiles = {
  artist: {
    name: "your name",          // TODO: customize
    title: "your title",        // TODO: customize
    avatar: "/avatar.jpg",      // TODO: add your photo to /public
    // ...
  }
}
```

**what to change:**
- `name` - your actual name
- `title` - your job title or description
- `avatar` - path to your photo (add to `/public` folder)
- `bio` - short description about you
- `social` links - your github, linkedin, email
- `skills` - your technical skills
- `projects` - your work (see below)

### add your projects

in `lib/xmb-data.ts`, find the projects section (lines 71-230):

```typescript
{
  id: 1,
  title: "your project name",         // TODO: customize
  description: "what it does",        // TODO: customize
  image: "/projects/project.jpg",     // TODO: add image to /public/projects
  tech: ["react", "typescript"],      // TODO: list your tech stack
  githubUrl: "#",                     // TODO: add your github repo URL
  liveUrl: "#",                       // TODO: add your live demo URL
  profile: "engineer"                 // artist | engineer | stranger
}
```

**tips:**
- add project images to `/public/projects/`
- use real github and live URLs (not "#")
- assign projects to profiles: `artist`, `engineer`, or `stranger`
- the `featured` flag highlights important projects

### change colors and styling

edit `app/globals.css` (lines 4-78) for theme colors:

```css
:root {
  --background: 222.2 84% 4.9%;      /* main background */
  --foreground: 210 40% 98%;         /* text color */
  --primary: 217.2 91.2% 59.8%;      /* accent color */
  /* ... */
}
```

modify `components/ps3/wave-background.tsx` for wave colors and animation speed.

### customize the boot screen

edit `components/ps3/boot-screen.tsx`:
- duration: line 11 (`setTimeout` delay)
- text: line 22 (replace "PS3" text)
- sound: add your own audio file

### toggle features

in `lib/xmb-data.ts`:
- disable sound: remove sound effects
- hide profiles: edit `profiles` object
- change menu categories: edit `menuItems` array

## project structure

```
ps3-template/
├── app/
│   ├── page.tsx           # main entry point
│   ├── layout.tsx         # metadata and fonts
│   └── globals.css        # theme variables
├── components/
│   ├── ps3/
│   │   ├── ps3-portfolio.tsx    # main container
│   │   ├── xmb-interface.tsx    # crossbar menu logic
│   │   ├── item-detail.tsx      # project detail view
│   │   ├── wave-background.tsx  # animated background
│   │   ├── boot-screen.tsx      # startup animation
│   │   └── scanline-overlay.tsx # crt effect
│   ├── ui/                # shadcn components
│   └── theme-provider.tsx # dark mode support
├── lib/
│   ├── xmb-data.ts        # YOUR CONTENT HERE
│   └── utils.ts           # helper functions
└── public/
    ├── avatar.jpg         # TODO: add your photo
    └── projects/          # TODO: add project images
```

## keyboard shortcuts

- `arrow keys` - navigate menu
- `enter` - select item
- `esc` or `backspace` - go back
- `s` - toggle scanlines
- works with mouse/touch too

## deployment

### vercel (recommended)

```bash
# install vercel cli
npm i -g vercel

# deploy
vercel
```

### netlify

```bash
# build command
npm run build

# publish directory
.next
```

### static export

for static hosting, update `next.config.mjs`:

```javascript
const nextConfig = {
  output: 'export',
  images: { unoptimized: true }
}
```

then `npm run build` creates a static site in `.next/`.

## adding images

1. add files to `/public` folder:
   - `/public/avatar.jpg` - your photo
   - `/public/projects/project1.jpg` - project screenshots
   
2. reference in code:
   ```typescript
   image: "/projects/project1.jpg"  // no /public prefix needed
   ```

3. recommended sizes:
   - avatar: 400x400px
   - project images: 1200x675px (16:9 ratio)

## browser support

- chrome/edge 90+
- firefox 88+
- safari 14+
- mobile browsers (ios safari, chrome mobile)

older browsers may lack smooth animations but will remain functional.

## troubleshooting

**menu not responding:**
- check console for javascript errors
- ensure you're not missing required fields in xmb-data.ts

**images not loading:**
- verify files are in `/public` folder
- check file paths (case-sensitive on linux/mac)
- use `/` not `\` in paths

**build errors:**
- run `npm install` again
- delete `.next` folder and rebuild
- check node version (16.8+ required)

**slow animations:**
- reduce wave count in wave-background.tsx
- disable scanlines overlay
- check browser hardware acceleration

## customization examples

### minimal setup (just projects, no profiles)

edit `lib/xmb-data.ts`:
```typescript
export const profiles = {
  default: {
    name: "your name",
    title: "developer",
    // single profile
  }
}

// all projects use 'default' profile
```

### different menu categories

in `lib/xmb-data.ts`, modify `menuItems`:
```typescript
{
  id: "custom",
  label: "my work",
  icon: Briefcase,
  content: "your custom content"
}
```

### custom fonts

in `app/layout.tsx`:
```typescript
import { YourFont } from 'next/font/google'

const font = YourFont({ subsets: ['latin'] })
```

## license

MIT - do whatever you want with it.

## credits

- inspired by sony ps3 xmb interface
- built with next.js, react, tailwindcss
- ui components from shadcn/ui

---

need help? check the [main repo](../../README.md) or open an issue.
