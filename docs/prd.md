# Spelling Practice App - PRD

## Overview
A simple web app to help kids practice their weekly spelling words through interactive exercises and quizzes.

## Goals
- Help kids learn spelling words through practice and games
- Make it easy for parents to add new word lists each week
- Provide immediate feedback with personalized voice/image responses
- Track progress over time

## Core Features

### 1. Word List Management (Parent View)
- Upload/input weekly spelling words
- Option to OCR from photo (nice-to-have)
- Simple text input as MVP
- Edit/delete word lists
- Mark which list is "active" for the week

### 2. Practice Exercises (Kid View)
- **Word Scramble**: Unscramble letters to form the word
- **Missing Letters**: Fill in the blanks
- **Type the Word**: Hear the word, type it out
- Track which words need more practice

### 3. Pre-Test Mode
- AI voice speaks each word
- Kid types the word
- Immediate grading (correct/incorrect)
- Show correct spelling if wrong
- Final score at the end

### 4. Personalized Feedback
- Parent uploads voice snippets ("Great job!", "Try again!", etc.)
- Parent uploads happy/concerned face photos
- App randomly selects from pool for positive/negative feedback
- Falls back to default messages if no custom content uploaded

### 5. Progress Tracking
- Show which words have been mastered
- Track test scores over time
- Simple dashboard for parents

## Technical Stack
- **Frontend**: Vite + React
- **Hosting**: Netlify
- **Database & Storage**: Supabase (auth, database, file storage)
- **Text-to-Speech**: Web Speech API (browser native)

## User Flows

### Parent Setup Flow
1. Log in (simple password or Supabase auth)
2. Navigate to "Manage Words"
3. Add new word list for the week
4. Optionally upload custom voice/image files
5. Set list as "active"

### Kid Practice Flow
1. Open app (no login needed)
2. See "Practice" and "Take Test" options
3. Choose practice exercise
4. Complete exercises with immediate feedback
5. Return to menu or continue practicing

### Kid Test Flow
1. Click "Take Test"
2. Hear word spoken by AI
3. Type spelling
4. See if correct with custom feedback
5. Move to next word
6. See final score

## Out of Scope (v1)
- Multiple user profiles for different kids
- Adaptive difficulty
- Multiplayer/competitive features
- Mobile app (web-only for now)
- Complex game mechanics

## Success Metrics
- Kids willingly use it weekly
- Parent can add new words in < 2 minutes
- Test completion takes ~5-10 minutes
- Spelling test scores improve over time

## Timeline
- Week 1: Basic word list management + one practice exercise
- Week 2: Pre-test mode with TTS + grading
- Week 3: Custom feedback + progress tracking
- Week 4: Polish + additional practice exercises