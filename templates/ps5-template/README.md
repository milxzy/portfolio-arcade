# ps5 modern ui portfolio template

a portfolio website themed after the playstation 5 user interface. features smooth card animations, user profiles, and that clean modern design.

## features

- authentic ps5-style interface
- user selection screen
- game library grid layout
- detailed project modals
- profile-based filtering
- smooth animations
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

edit `lib/projects.ts` to customize all content:

```typescript
// lines 5-26: user profiles
export const users = [
  {
    id: "dev",
    name: "your name",                    // TODO: customize
    title: "full stack developer",         // TODO: customize
    avatar: "/avatars/dev.jpg",           // TODO: add your photo
    color: "from-blue-500 to-purple-600"  // gradient colors
  }
]
```

**what to change:**
- `name` - your actual name
- `title` - your job title
- `avatar` - path to your photo (add to `/public/avatars`)
- `color` - tailwind gradient colors
- create multiple users for different personas

### add your projects

in `lib/projects.ts`, find the projects array (lines 29-219):

```typescript
{
  id: 1,
  title: "your project name",           // TODO: customize
  subtitle: "short tagline",            // TODO: customize
  description: "detailed description",   // TODO: customize
  coverImage: "/projects/cover.jpg",    // TODO: add cover image
  screenshots: [                        // TODO: add screenshots
    "/projects/screen1.jpg",
    "/projects/screen2.jpg"
  ],
  technologies: ["react", "node.js"],   // TODO: list tech stack
  githubUrl: "#",                       // TODO: add github URL
  liveUrl: "#",                         // TODO: add live URL
  userId: "dev"                         // matches user id above
}
```

**tips:**
- add images to `/public/projects/` and `/public/avatars/`
- use high-res cover images (1920x1080)
- screenshots show in the modal gallery
- assign projects to users with `userId`

### change colors and styling

edit `app/globals.css` for theme colors:

```css
:root {
  --background: 222.2 84% 4.9%;      /* main background */
  --foreground: 210 40% 98%;         /* text color */
  --primary: 217.2 91.2% 59.8%;      /* accent color */
  /* ... */
}
```

modify `components/ps5/user-selection.tsx` for user card styles.

## project structure

```
ps5-template/
├── app/
│   ├── page.tsx           # main entry point
│   ├── layout.tsx         # metadata and fonts
│   └── globals.css        # theme variables
├── components/
│   ├── ps5/
│   │   ├── user-selection.tsx  # user picker screen
│   │   ├── game-library.tsx    # project grid
│   │   └── project-modal.tsx   # detailed view
│   └── ui/                # shadcn components
├── lib/
│   ├── projects.ts        # YOUR CONTENT HERE
│   └── utils.ts           # helper functions
└── public/
    ├── avatars/           # TODO: add user photos
    └── projects/          # TODO: add project images
```

## keyboard shortcuts

- `arrow keys` - navigate grid
- `enter` - select project
- `esc` - close modal/go back
- `tab` - switch between sections
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

## adding images

1. add files to `/public` folder:
   - `/public/avatars/user.jpg` - user photos (400x400px)
   - `/public/projects/cover.jpg` - cover images (1920x1080px)
   - `/public/projects/screen1.jpg` - screenshots (any size)
   
2. reference in code:
   ```typescript
   coverImage: "/projects/cover.jpg"  // no /public prefix
   ```

## browser support

- chrome/edge 90+
- firefox 88+
- safari 14+
- mobile browsers

## troubleshooting

**projects not showing:**
- check `userId` matches user `id` in projects.ts
- verify image paths are correct

**build errors:**
- run `npm install` again
- delete `.next` and rebuild

**slow performance:**
- optimize image sizes
- reduce number of screenshots per project

## license

MIT - do whatever you want with it.

---

need help? check the [main repo](../../README.md) or open an issue.
