# Phase 5: Realtime Collaboration

## Task
Implement realtime collaboration using Liveblocks and Yjs for multi-user canvas editing.

## Files
- apps/web/src/providers/CollaborationProvider.tsx
- apps/web/src/hooks/useCollaboration.ts
- apps/web/src/components/collaboration/PresenceAvatars.tsx
- apps/web/src/components/collaboration/CursorOverlay.tsx
- apps/web/src/components/collaboration/CommentsPanel.tsx
- packages/canvas/src/yjs-utils.ts

## Features
- Live presence (who's viewing/editing)
- Remote cursors with user names
- Real-time canvas sync via Yjs CRDT
- Conflict-free concurrent editing
- Comments and mentions on nodes
- Activity feed showing changes
- Offline support (Yjs document persistence)
- Auto-merge on reconnect
