# Setup & Architecture Guide

## Project Setup

### 1. Initialize Vite + React
```bash
npm create vite@latest spelling-app -- --template react
cd spelling-app
npm install
```

### 2. Install Dependencies
```bash
# Supabase client
npm install @supabase/supabase-js

# Routing
npm install react-router-dom

# (Optional) UI helpers
npm install lucide-react
```

### 3. Supabase Setup
1. Create account at supabase.com
2. Create new project
3. Copy API URL and anon key
4. Create `.env.local` file:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Database Schema

**Table: word_lists**
- id (uuid, primary key)
- created_at (timestamp)
- name (text) - e.g., "Week of Nov 25"
- is_active (boolean)
- words (jsonb) - array of word objects

**Table: test_results**
- id (uuid, primary key)
- created_at (timestamp)
- word_list_id (uuid, foreign key)
- score (integer)
- total (integer)
- details (jsonb) - which words right/wrong

**Storage Buckets:**
- `voice-clips` - parent voice recordings
- `feedback-images` - happy/concerned face photos

## Architecture

```
src/
├── components/
│   ├── WordListManager.jsx    # Parent: manage word lists
│   ├── PracticeExercise.jsx   # Kid: practice games
│   ├── PreTest.jsx             # Kid: take spelling test
│   └── FeedbackDisplay.jsx    # Show custom feedback
├── services/
│   └── supabase.js             # Supabase client setup
├── hooks/
│   ├── useWordLists.js         # Fetch/manage word lists
│   ├── useSpeech.js            # Web Speech API wrapper
│   └── useFeedback.js          # Get random feedback assets
├── App.jsx                     # Main routing
└── main.jsx                    # Entry point
```

## Key Implementation Notes

### Web Speech API (Text-to-Speech)
```javascript
const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8; // Slower for kids
  window.speechSynthesis.speak(utterance);
};
```

### Supabase Client Setup
```javascript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### Upload Custom Files
```javascript
const uploadVoiceClip = async (file) => {
  const { data, error } = await supabase.storage
    .from('voice-clips')
    .upload(`${Date.now()}-${file.name}`, file);
  return data;
};
```

## Deployment

### Netlify Setup
1. Push code to GitHub
2. Go to netlify.com → "Add new site" → "Import from Git"
3. Select your repo
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables (Supabase URL & key)
6. Deploy!

Your site will be at `your-app-name.netlify.app`

### Updating
Just `git push` to main branch - Netlify auto-deploys.

## Development Workflow
1. Run locally: `npm run dev`
2. Test features
3. Commit and push to GitHub
4. Netlify deploys automatically
5. Test on live URL

## Cost Tracking
- Netlify: Free (100GB bandwidth/month)
- Supabase: Free (500MB storage, 2GB bandwidth)
- No credit card needed for either

Monitor usage in dashboards if you're concerned, but family use should stay well under limits.