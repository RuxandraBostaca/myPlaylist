# myPlaylist

This app allows you to manage playlists of Youtube videos.

## Getting Started

These instructions will help you set up the project on your local machine.

### Steps

1. Clone the repository

```
git clone https://github.com/RuxandraBostaca/myPlaylist
```

2. Install Modules

```
npm install
```

3. Configure the Database

```
mysql-ctl start
```

```
mysql -u root
```

```
source sql/database.sql
```

```
exit
```

4. Start the server

```
node server.js
```

## Endpoints

### Users

* Get all users

```
GET https://my-playlist-rux2296.c9users.io/users
```

* Get user by id

```
GET https://my-playlist-rux2296.c9users.io/users/1
```

* Add user

```
POST https://my-playlist-rux2296.c9users.io/users
```

* Update user

``` 
PUT https://my-playlist-rux2296.c9users.io/users/1
```

* Delete user

```
DELETE https://my-playlist-rux2296.c9users.io/users/1
```

### Playlists

* Get all playlists for a specific user

```
GET https://my-playlist-rux2296.c9users.io/users/1/playlists
```

* Get playlist by id

```
GET https://my-playlist-rux2296.c9users.io/playlists/1
```

* Add playlist

```
POST https://my-playlist-rux2296.c9users.io/playlists
```

* Update playlist

``` 
PUT https://my-playlist-rux2296.c9users.io/playlists/1
```

* Delete playlist

```
DELETE https://my-playlist-rux2296.c9users.io/playlists/1
```

### Videos

* Get all videos for a specific playlist

```
GET https://my-playlist-rux2296.c9users.io/playlists/1/videos
```

* Get video by id

```
GET https://my-playlist-rux2296.c9users.io/videos/1
```

* Add video

```
POST https://my-playlist-rux2296.c9users.io/videos
```

* Update video

``` 
PUT https://my-playlist-rux2296.c9users.io/videos/1
```

* Delete video

```
DELETE https://my-playlist-rux2296.c9users.io/videos/1
```

## Components
* Playlists
* Video list in each playlist
* Video search bar - youtube
* Search results
* Navbar (login / username, no. of playlists, logout)

## User features
* View playlists
* View videos in playlist
* Add playlist(s)
* Add video(s) to playlist
* Edit playlist details
* Edit video details
* Search videos and add them to playlists
* Delete video(s)
* Delete playlist(s)