# wii channel menu portfolio template

a portfolio website themed after the nintendo wii channel menu. features colorful tiles, smooth transitions, and that fun nintendo vibe.

## features

- authentic wii channel grid
- white flash transitions
- custom wii cursor
- channel detail views
- multiple channel types (projects, tech stack, about, contact, settings)
- bottom bar with system info
- keyboard navigation
- fully responsive

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

edit `lib/channels.ts` to customize all content:

```typescript
// system user (line 6)
export const systemUser = {
  name: "your name",                    // TODO: customize
  title: "software developer",          // TODO: customize
  avatar: "/avatar.jpg"                 // TODO: add your photo
}

// about channel (lines 12-18)
export const aboutData = {
  name: "your name",                    // TODO: customize
  title: "your title",                  // TODO: customize
  bio: "your bio here...",              // TODO: write about yourself
  location: "your city",                // TODO: your location
  email: "you@example.com",             // TODO: your email
  // ...
}
```

**what to change:**
- personal info in `systemUser` and `aboutData`
- social links (github, linkedin, twitter)
- tech stack in `techStackData`
- contact methods in contact channel
- your projects (see below)

### add your projects

in `lib/channels.ts`, find the projects array (lines 150-231):

```typescript
{
  id: "1",
  title: "your project name",           // TODO: customize
  subtitle: "short description",        // TODO: customize
  description: "full description...",   // TODO: customize
  icon: "📱",                           // TODO: pick an emoji
  technologies: ["react", "node"],      // TODO: list tech
  githubUrl: "#",                       // TODO: add github URL
  liveUrl: "#",                         // TODO: add live URL
  featured: true                        // show in main grid
}
```

**tips:**
- use emojis for icons (or add custom icons to `/public`)
- `featured: true` makes projects appear on main channel grid
- non-featured projects only show in projects detail view
- fill in real URLs for github and live demos

### change colors

edit `app/globals.css` for theme colors:

```css
:root {
  --background: 0 0% 100%;           /* white background */
  --foreground: 222.2 84% 4.9%;      /* text color */
  /* ... */
}
```

modify channel colors in `lib/channels.ts` by changing the `bgColor` field.

### customize channels

in `lib/channels.ts`, the main channels array defines what appears on your home screen:

```typescript
export const channels: Channel[] = [
  {
    id: "projects",
    title: "projects",
    subtitle: "my work",
    icon: "💼",
    bgColor: "bg-blue-400",
    row: 1,
    col: 1
  }
  // add your own channels here
]
```

**customize:**
- `icon` - emoji or icon
- `bgColor` - tailwind color class
- `row`/`col` - grid position
- add/remove channels as needed

## project structure

```
wii-template/
├── app/
│   ├── page.tsx           # main entry point
│   ├── layout.tsx         # metadata
│   └── globals.css        # theme variables
├── components/
│   ├── wii/
│   │   ├── wii-menu.tsx            # main container
│   │   ├── wii-startup.tsx         # boot animation
│   │   ├── channel-grid.tsx        # channel layout
│   │   ├── channel-icon.tsx        # channel tile
│   │   ├── channel-detail.tsx      # detail view
│   │   ├── wii-cursor.tsx          # custom cursor
│   │   ├── wii-bottom-bar.tsx      # system bar
│   │   └── channel-views/          # detail screens
│   │       ├── projects-view.tsx
│   │       ├── tech-stack-view.tsx
│   │       ├── about-view.tsx
│   │       ├── contact-view.tsx
│   │       └── settings-view.tsx
│   └── ui/                # shadcn components
├── lib/
│   ├── channels.ts        # YOUR CONTENT HERE
│   └── utils.ts           # helper functions
└── public/
    └── avatar.jpg         # TODO: add your photo
```

## keyboard shortcuts

- `arrow keys` - navigate channels
- `enter` - select channel
- `esc` or `b` - go back to grid
- `mouse` - point and click (cursor follows)
- works on mobile with touch

## deployment

### vercel (recommended)

```bash
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
   - `/public/avatar.jpg` - your photo
   - `/public/projects/` - project images
   
2. reference in code:
   ```typescript
   image: "/projects/project.jpg"
   ```

## browser support

- chrome/edge 90+
- firefox 88+
- safari 14+
- mobile browsers

## troubleshooting

**cursor not showing:**
- check if you're on mobile (cursor is hidden on touch devices)

**channels overlapping:**
- adjust `row` and `col` values in channels array
- ensure no duplicate positions

**build errors:**
- run `npm install`
- delete `.next` and rebuild

## customization examples

### add a new channel

in `lib/channels.ts`:

```typescript
{
  id: "blog",
  title: "blog",
  subtitle: "my writings",
  icon: "📝",
  bgColor: "bg-green-400",
  row: 2,
  col: 3
}
```

then create `/components/wii/channel-views/blog-view.tsx`.

### change grid layout

modify `row` and `col` values to rearrange channels. grid is flexible - use any layout you want.

### disable startup animation

in `components/wii/wii-menu.tsx`, set initial `showStartup` to `false`.

## license

MIT - do whatever you want with it.

---

need help? check the [main repo](../../README.md) or open an issue.
