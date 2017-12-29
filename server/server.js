var express = require("express")
var Sequelize = require("sequelize")
var app = express()
app.set('view engine', 'hjs');

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
}); 

//connect to mysql database
var sequelize = new Sequelize('myplaylist', 'root', '', {
    dialect:'mysql',
    host:'localhost'
})

sequelize.authenticate().then(function(){
    console.log('Connected to database')
})

// define vars for tables
var Users = sequelize.define('users', {
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    email: Sequelize.STRING,
    status: Sequelize.INTEGER
})

var Playlists = sequelize.define('playlists', {
    userId: Sequelize.INTEGER,
    name: Sequelize.STRING,
    status: Sequelize.INTEGER
})

var Videos = sequelize.define('videos', {
    playlistId: Sequelize.INTEGER,
    title: Sequelize.STRING,
    url: Sequelize.TEXT,
    thumbnail: Sequelize.TEXT,
    channelTitle: Sequelize.STRING,
    channelUrl: Sequelize.TEXT,
    status: Sequelize.INTEGER
})

/*var MapVideo = sequelize.define('map_video', {
    playlistId: Sequelize.INTEGER,
    videoId: Sequelize.INTEGER
})*/

Playlists.belongsTo(Users, {foreignKey: "userId", targetKey: "id"})
Videos.belongsTo(Playlists, {foreignKey: "playlistId", targetKey: "id"})

/*Playlist.belongsToMany(Video, {through: "MapVideo", foreignKey: "playlistId", targetKey: "id"})
Video.belongsToMany(Playlist, {through: "MapVideo", foreignKey: "videoId", targetKey: "id"})
*/

app.use(express.static('public'))
app.use('/public', express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))

//users
app.get('/users', function(request, response) {
    Users.findAll().then(
        function(users) {
            response.status(200).send(users)
        })
})

//user by id
app.get('/users/:id', function(request, response) {
    Users.findById(request.params.id).then(function(user) {
        if(user) {
            response.status(200).send(user)
        } else {
            response.status(404).send()
        }
    })
})

//user by username and password
app.get('/users/:user/:pass', function(request, response) {
    Users.findOne({where: {username: request.params.user, password: request.params.pass, status: 1}}).then(function(user) {
        if(user) {
            response.status(200).send(user)
        } else {
            response.status(204).send()
        }
    })
})

app.post('/users', function(request, response) {
    Users.create(request.body).then(function(user) {
        response.status(201).send(user)
    })
})

app.put('/users/:id', function(request, response) {
    Users.findById(request.params.id).then(function(user) {
        if(user) {
            user.update(request.body).then(function(user) {
                response.status(201).send(user)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/users/:id', function(request, response) {
    //TODO: cascade erase playlists & videos when user is deleted
     Users.findById(request.params.id).then(function(user) { 
         if(user) {
            user.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
     })
})

//TODO: status becomes 0 when deleted, don't erase from db -> PUT status 0 + cascade

//playlists
/*app.get('/playlists', function(request, response) {
    Playlists.findAll(
        {
            include: [{
                model: Users,
                where: { id: Sequelize.col('playlists.userId') }
            }]
        }
            
    ).then(
        function(playlists) {
            if(playlists) {
                response.status(200).send(playlists)
            } else {
                response.status(404).send()
            }
        }
    )
})*/

//playlists by userId
app.get('/users/:id/playlists/all', function(request, response) {
    Playlists.findAll({where: {userId: request.params.id, status: 1}}).then(function(playlists) {
        if(playlists) {
            response.status(200).send(playlists)
        } else {
            response.status(404).send()
        }
    })
})

//playlist by id
app.get('/playlists/:id', function(request, response) {
    Playlists.findById(request.params.id).then(function(playlist) {
        if(playlist) {
            response.status(200).send(playlist)
        } else {
            response.status(404)
        }
    })
})

app.post('/playlists', function(request, response) {
  Playlists.create(request.body).then(function(playlist) {
      response.status(201).send(playlist)
  })  
})

app.put('/playlists/:id', function(request, response) {
    Playlists.findById(request.params.id).then(function(playlist) {
        if(playlist) {
            playlist.update(request.body).then(function(playlist) {
                response.status(201).send(playlist)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/playlists/:id', function(request, response) {
    //TODO: cascade delete videos
    Playlists.findById(request.params.id).then(function(playlist) {
        if(playlist) {
            playlist.destroy().then(function() {
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

//TODO: status becomes 0 when deleted, don't erase from db -> PUT status 0 + cascade

// videos
/*app.get('/videos', function(request, response) {
    Videos.findAll(
        {
            include: [{
                model: Playlists,
                where: { id: Sequelize.col('videos.playlistId') }
            }]
        }
            
    ).then(
        function(videos) {
            if(videos) {
                response.status(200).send(videos)
            } else {
                response.status(404).send()
            }
        }
    )
})*/

//videos by playlistId
app.get('/playlists/:id/videos', function(request, response) {
    Videos.findAll({where: {playlistId: request.params.id, status: 1}}).then(function(videos) {
        if(videos) {
            response.status(200).send(videos)
        } else {
            response.status(204).send()
        }
    })
})

//video by id
app.get('/videos/:id', function(request, response) {
    Videos.findById(request.params.id).then(function(video) {
        if(video) {
            response.status(200).send(video)
        } else {
            response.status(404)
        }
    })
})

app.post('/videos', function(request, response) {
    Videos.create(request.body).then(function(video) {
      response.status(201).send(video)
    }) 
})

app.put('/videos/:id', function(request, response) {
    Videos.findById(request.params.id).then(function(video) {
        if(video) {
            video.update(request.body).then(function(video) {
                response.status(201).send(video)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

app.delete('/videos/:id', function(request, response) {
    Videos.findById(request.params.id).then(function(video) {
        if(video) {
            video.destroy().then(function() {
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})

//TODO: status becomes 0 when deleted, don't erase from db -> PUT status 0

app.listen(8080)