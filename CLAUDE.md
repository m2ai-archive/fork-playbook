# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Dr. Lutfiya Miller's AI Consulting Playbook** - an interactive learning platform with 15 chapters of AI consulting wisdom. Each chapter combines written content, Loom video, exercises, quizzes, reflections, and an AI mentor.

**Status**: All 15 chapters fully integrated with complete content and video URLs.

## Development Commands

```bash
npm install          # Install dependencies
npm run dev          # Start Vite dev server (localhost:3000)
npm run build        # Build for production
npm run preview      # Preview production build (wrangler pages dev)
npm run deploy       # Build and deploy to Cloudflare Pages
```

**Note**: No lint, test, or typecheck commands are configured.

### PM2 Process Management
```bash
pm2 start ecosystem.config.cjs   # Start application
pm2 restart ai-playbook          # Restart
pm2 logs ai-playbook             # View logs
```

## Architecture

### Tech Stack
- **Frontend**: React 19.2.0 + TypeScript/JavaScript (mixed) + Vite 6.4.1
- **Styling**: Tailwind CSS 3.4.18 (navy/silver palette, Inter font, `darkMode: 'class'`)
- **State**: React hooks + LocalStorage + ThemeContext
- **Video**: Loom embedded iframe with player.js API
- **Deployment**: Cloudflare Pages (wrangler 4.4.0) + PM2 local

### Core Data Flow
1. **Chapter metadata** in `src/data/chapters.js` - titles, overviews, exercises, quizzes, video URLs
2. **Full content** in `src/data/fullChapters.js` - detailed sections with markdown-style formatting
3. **Progress tracking** via `src/utils/storage.ts` using LocalStorage
4. **Theme state** via `src/contexts/ThemeContext.jsx`

### Dual-Layer Content System
- **`chapters.js`**: Chapter metadata, brief overviews, exercises, quiz definitions, Loom video URLs
- **`fullChapters.js`**: Complete chapter content with markdown-style formatting

Content rendering supports: `###` headers, `**bold**`, `*italic*`, `- lists`, `- [ ] checklists`, emoji callouts (🎓🔧⚠️💎), `` `code` ``, `*"blockquotes"`, markdown tables

### Key Components
| Component | Purpose |
|-----------|---------|
| `App.jsx` | Main shell with routing, resizable sidebar (200-500px) |
| `Dashboard.jsx` | Chapter overview, progress viz, dynamic Recent Activity |
| `ChapterView.jsx` | Chapter display with video, sections, exercises, quiz |
| `ChapterContent.jsx` | Markdown-style content renderer with table support |
| `ProgressTracker.jsx` | Sidebar progress display and chapter navigation |
| `LoomVideoPlayer.jsx` | Embedded Loom video with completion tracking |
| `AICoach.jsx` | Chat interface with n8n webhook integration |
| `ThemeContext.jsx` | Dark/light theme management |

### AI Coach Integration
The AI Coach connects to an n8n webhook for dynamic responses:
- **Service**: `src/services/aiChatService.js`
- **Webhook**: Configured in `aiChatService.js` (n8n cloud)
- **Payload**: Sends message, chapter context, user progress, conversation history

### Progress Tracking
Storage key pattern: `chapter_${id}_progress`
```typescript
{
  completed: boolean,
  sectionsRead: number[],
  exercisesCompleted: number[],
  quizScore: number,
  videoWatched: boolean
}
```

## Content Integration

### Adding/Updating Chapter Content
1. Extract content from DOCX/PDF in `/content/` directory
2. Format per `CONTENT_UPDATE_GUIDE.md` guidelines
3. Add to `src/data/fullChapters.js`:
```javascript
[chapterId]: {
  sections: [
    { title: "Section Title", content: `Markdown-formatted content...` }
  ]
}
```
4. Ensure section count matches `chapters.js` metadata
5. Test: `npm run dev`, navigate to chapter, verify formatting

### Video Integration
Add Loom URL to `chapters.js`:
```javascript
{ id: 1, videoUrl: "https://www.loom.com/share/...", ... }
```
Player auto-converts share URLs to embed URLs and tracks completion via player.js API.

## Deployment

### Cloudflare Pages
- Config: `wrangler.jsonc`
- Output: `./dist`
- `npm run deploy` runs build + wrangler pages deploy

### Local/Sandbox
- PM2 config: `ecosystem.config.cjs` (port 3000, host 0.0.0.0)
- Vite config includes allowedHosts for sandbox deployment

## Project-Specific Guidelines

### Content Management
- All chapter content in data files, never hardcoded in components
- Keep `chapters.js` metadata aligned with `fullChapters.js` section counts
- Video transcripts available in `/transcripts/` folder

### Component Patterns
- Use Tailwind navy/silver palette for consistency
- Dark mode: use `dark:` variants (already implemented)
- Keep components presentational, business logic in `utils/`

### Git/Changelog
- Log all changes to `CHANGELOG.md`
- Atomic commits: "Add chapter X content", "Fix rendering in section Y"
- Follow git flow best practices

---

**Repository**: https://github.com/Drfiya/Playbook
**Maintainer**: Dr. Lutfiya Miller, Ph.D., DABT
