# myPlaylist
# Ruxandra Bostaca
This app allows you to manage playlists of Youtube videos.

##Components:
1. List of Video playlists
2. Selected Video playlist - details
3. Video Search
4. Search results + add to playlist button
5. New playlist button
6. Remove playlist(s) button

##User components:
View list of playlists
View specific playlist + Edit playlist (remove videos, reorder)
Search videos by name
Search results - add to playlist(s)
New playlist
Delete playlist(s)

##Endpoints:
POST /playlists
GET /playlists
GET /playlists/:id
PUT /playlists/:id
PUT /playlists/:id/:videoId
GET /search.list (API)
DELETE /playlists/:id
...