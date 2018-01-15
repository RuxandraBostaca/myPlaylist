import React, { Component } from 'react';
import './App.css';
import defaultThumbnail from './default.jpg'
import YTSearch from 'youtube-api-search';
import ScrollArea from 'react-scrollbar';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap'
import { ListGroup } from 'react-bootstrap'
import { ListGroupItem } from 'react-bootstrap'
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';
import axios from 'axios';

class Modals extends Component {
  
  constructor(props) {
      super(props)
      
      this.state = {
        showRegisterModal: false,
        showLoginModal: false,
        showAddPlaylistModal: false,
        showEditPlaylistModal: false,
        showAddToPlaylistModal: false,
        showRemoveVideoModal: false, 
        showLogoutModal: false,
        showPlayVideo: false, 
        user: "",
        pass: "",
        emailRegister: "",
        userRegister: "",
        passRegister: "",
        message:"",
        messageRegister: "",
        messageAddPlaylist:"",
        messageEditPlaylist:"",
        errorDivClass: "hidden",
        errorDivClassRegister: "hidden",
        errorDivClassAddPlaylist: "hidden",
        errorDivClassEditPlaylist: "hidden",
        addPlaylistName: "",
        editPlaylistName: "",
        editPlaylistId: 0,
        removePlaylistId: 0,
        removeVideoId: 0,
        removeVideoPlaylistId: 0,
        playlists: [],
        toAddVideo: {},
        playVideoName: "",
        playVideoUrl: ""
      }
      
      this.openRegisterModal = this.openRegisterModal.bind(this);
      this.openLoginModal = this.openLoginModal.bind(this);
      this.openAddPlaylistModal = this.openAddPlaylistModal.bind(this);
      this.openEditPlaylistModal = this.openEditPlaylistModal.bind(this);
      this.openRemovePlaylistModal = this.openRemovePlaylistModal.bind(this);
      this.openRemoveVideoModal = this.openRemoveVideoModal.bind(this);
      this.openAddToPlaylistModal = this.openAddToPlaylistModal.bind(this);
      this.openLogoutModal = this.openLogoutModal.bind(this);
      this.openPlayVideoModal = this.openPlayVideoModal.bind(this);
      this.closeRegisterModal = this.closeRegisterModal.bind(this);
      this.closeLoginModal = this.closeLoginModal.bind(this);
      this.closeAddPlaylistModal = this.closeAddPlaylistModal.bind(this);
      this.closeEditPlaylistModal = this.closeEditPlaylistModal.bind(this);
      this.closeRemovePlaylistModal = this.closeRemovePlaylistModal.bind(this);
      this.closeRemoveVideoModal = this.closeRemoveVideoModal.bind(this);
      this.closeAddToPlaylistModal = this.closeAddToPlaylistModal.bind(this);
      this.closeLogoutModal = this.closeLogoutModal.bind(this);
      this.closePlayVideoModal = this.closePlayVideoModal.bind(this);
      this.updateUser = this.updateUser.bind(this);
      this.updatePass = this.updatePass.bind(this);
      this.updateEmailRegister = this.updateEmailRegister.bind(this);
      this.updateUserRegister = this.updateUserRegister.bind(this);
      this.updatePassRegister = this.updatePassRegister.bind(this);
      this.updateAddPlaylistName = this.updateAddPlaylistName.bind(this);
      this.updateEditPlaylistName = this.updateEditPlaylistName.bind(this);
      this.switchToRegisterModal = this.switchToRegisterModal.bind(this);
      this.switchToLoginModal = this.switchToLoginModal.bind(this);
      this.loadListData = this.loadListData.bind(this);
      this.newPlaylist = this.newPlaylist.bind(this);
      this.editPlaylistNameF = this.editPlaylistNameF.bind(this);
      this.setEditPlaylistName = this.setEditPlaylistName.bind(this);
      this.setAddVideo = this.setAddVideo.bind(this);
      this.loadList = this.loadList.bind(this);
      this.addVideoToPlaylist = this.addVideoToPlaylist.bind(this);
  }
  
  componentDidMount() {
    if(read_cookie('user').length > 0 && read_cookie('userId') > 0) {
      this.setState({showLoginModal: false});  
    }
    else {
      this.setState({showLoginModal: true});  
    }
  }
  
  sendToPlay(video){
    this.openPlayVideoModal();
    this.setState({playVideoName: video.title});
    this.setState({playVideoUrl: "https://www.youtube.com/embed/" + video.url});
  }
  
  sendToPlayYT(video){
    this.openPlayVideoModal();
    this.setState({playVideoName: video.snippet.title});
    this.setState({playVideoUrl: "https://www.youtube.com/embed/" + video.id.videoId});
  }
  
  editPlaylistNameF() {
    this.setState({messageEditPlaylist: ""});
    this.setState({errorDivClassEditPlaylist: "hidden"});
    
    if(this.state.editPlaylistId > 0) {
      if(this.state.editPlaylistName.length > 0) {
         axios.put('https://my-playlist-rux2296.c9users.io/playlists/' + this.state.editPlaylistId, {
          name: this.state.editPlaylistName
        })
        .then(response => {
          this.closeEditPlaylistModal();
          this.loadListData();
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        this.setState({messageEditPlaylist: "Please complete the name field."});
        this.setState({errorDivClassEditPlaylist: "errorDiv"});
      }
    }
  }
  
  removePlaylistF() {
    if(this.state.removePlaylistId > 0) {
        axios.put('https://my-playlist-rux2296.c9users.io/playlists/' + this.state.removePlaylistId, {
          status: 0
        })
        .then(response => {
          this.closeRemovePlaylistModal();
          this.loadListData();
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  
  removeVideoF() {
    if(this.state.removeVideoId > 0) {
       axios.put('https://my-playlist-rux2296.c9users.io/videos/' + this.state.removeVideoId, {
          status: 0
        })
        .then(response => {
          this.closeRemoveVideoModal();
          this.props.setVideos(this.state.removeVideoPlaylistId);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
  
  addRemoveVideoModal(videoId, playlistId) {
    this.setState({removeVideoId: videoId});
    this.setState({removeVideoPlaylistId: playlistId});
    this.openRemoveVideoModal();
  }
  
  setEditPlaylistName(id, name) {
    this.setState({editPlaylistId: id});
    this.setState({editPlaylistName: name});
    this.openEditPlaylistModal();
  }
  
  setRemovePlaylist(id) {
    this.setState({removePlaylistId: id});
    this.openRemovePlaylistModal();
  }
  
  setAddVideo(video) {
    if(video !== null) {
      this.setState({toAddVideo: video});
      this.openAddToPlaylistModal();
    }
  }
  
  newPlaylist() {
    this.setState({messageAddPlaylist: ""});
    this.setState({errorDivClassAddPlaylist: "hidden"});
    
    if(read_cookie('userId') > 0) {
      if(this.state.addPlaylistName.length > 0) {
         axios.post('https://my-playlist-rux2296.c9users.io/playlists', {
          userId: read_cookie('userId'),
          name: this.state.addPlaylistName,
          status: 1
        })
        .then(response => {
          this.closeAddPlaylistModal();
          this.loadListData();
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        this.setState({messageAddPlaylist: "Please complete the name field."});
        this.setState({errorDivClassAddPlaylist: "errorDiv"});
      }
    }
  }
  
  loadListData() {
    this.props.loadData();
  }
  
  checkCredentials(user, pass) {
    this.setState({message: ""});
    this.setState({errorDivClass: "hidden"});
    
    if(user.length > 0 && pass.length > 0) {
      //check if user exists
      axios.get('https://my-playlist-rux2296.c9users.io/users/' + user + '/' + pass)
      .then(response => {
        if(response.status === 200) { 
           bake_cookie('user', user);
           bake_cookie('userId', response.data.id);
           this.closeLoginModal();
           this.loadListData();
        } else if(response.status === 204) {
          this.setState({message: "Invalid Credentials"});
          this.setState({errorDivClass: "errorDiv"});
        }
      })
      .catch(error => {
        this.setState({message: error});
        this.setState({errorDivClass: "errorDiv"});
      });
    } else {
      this.setState({message: "Please complete all the fields."});
      this.setState({errorDivClass: "errorDiv"});
    }
  }
  
  openRegisterModal() {
    this.setState({showRegisterModal: true});
  }
  
  openLoginModal() {
    this.setState({showLoginModal: true});
  }
  
  openAddPlaylistModal() {
    this.setState({showAddPlaylistModal: true});
  }
  
  openEditPlaylistModal() {
    this.setState({showEditPlaylistModal: true});
  }
  
  openRemovePlaylistModal() {
     this.setState({showRemovePlaylistModal: true});
  }
  
  openRemoveVideoModal() {
     this.setState({showRemoveVideoModal: true});
  }
  
  openAddToPlaylistModal() {
    this.loadList();
    this.setState({showAddToPlaylistModal: true});
  }
  
  openLogoutModal() {
     this.setState({showLogoutModal: true});
  }
  
  openPlayVideoModal() {
    this.setState({showPlayVideo: true});
  }
  
  closeRegisterModal() {
    this.setState({showRegisterModal: false});
  }
  
  closeLoginModal() {
    this.setState({showLoginModal: false});
  }
  
  closeAddPlaylistModal() {
    this.setState({showAddPlaylistModal: false});
  }
  
  closeEditPlaylistModal() {
    this.setState({showEditPlaylistModal: false});
  }
  
  closeRemovePlaylistModal() {
    this.setState({showRemovePlaylistModal: false});
  }
  
  closeRemoveVideoModal() {
    this.setState({showRemoveVideoModal: false});
  }
  
  closeAddToPlaylistModal() {
    this.setState({showAddToPlaylistModal: false});
  }
  
  closeLogoutModal() {
     this.setState({showLogoutModal: false});
  }
  
  closePlayVideoModal() {
    this.setState({showPlayVideo: false});
  }
  
  updateUser(evt) {
    this.setState({
      user: evt.target.value
    })
  }
  
  updatePass(evt) {
    this.setState({
      pass: evt.target.value
    })
  }
  
  updateEmailRegister(evt) {
    this.setState({
      emailRegister: evt.target.value
    })
  }
  
  updateUserRegister(evt) {
    this.setState({
      userRegister: evt.target.value
    })
  }
  
  updatePassRegister(evt) {
    this.setState({
      passRegister: evt.target.value
    })
  }
  
  updateAddPlaylistName(evt) {
      this.setState({
      addPlaylistName: evt.target.value
    })
  }
  
  updateEditPlaylistName(evt) {
    this.setState({
      editPlaylistName: evt.target.value
    })
  }
  
  switchToRegisterModal() {
      this.closeLoginModal();
      this.openRegisterModal();
  }
  
  switchToLoginModal() {
      this.closeRegisterModal();
      this.openLoginModal();
  }
  
  newRegistration(email, user, pass) {
    this.setState({messageRegister: ""});
    this.setState({errorDivClassRegister: "hidden"});
    
    if(email.length > 0 && user.length > 0 && pass.length > 0) {
      //check if email is valid
      if(/^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(email)) {
        //create new user
        axios.post('https://my-playlist-rux2296.c9users.io/users', {
          username: user,
          password: pass,
          email: email,
          status: 1
        })
        .then(response => {
          //make cookies for login
          bake_cookie('user', user);
          bake_cookie('userId', response.data.id);
          this.closeRegisterModal();
          this.props.setTitle(user);
          //todo - add new user "welcome" data
        })
        .catch(error => {
          console.log(error);
        });
      } else {
        this.setState({messageRegister: "Email is invalid."});
        this.setState({errorDivClassRegister: "errorDiv"});
      }
    } else {
      this.setState({messageRegister: "Please complete all the fields."});
      this.setState({errorDivClassRegister: "errorDiv"});
    }
  }
  
  loadList() {
    axios.get('https://my-playlist-rux2296.c9users.io/users/' + read_cookie('userId') + '/playlists/all')
      .then(response => {
        if(response.status === 200) {
          this.setState({playlists: response.data});
        } else if(response.status === 204) {
          //todo - add an "empty" paragraph
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  addVideoToPlaylist(id) {
    if(id !== null && this.state.toAddVideo !== null) {
      let thumbnail;
      if(this.state.toAddVideo.snippet.thumbnails.medium !== undefined) {
          thumbnail = this.state.toAddVideo.snippet.thumbnails.medium.url;
      } else {
          thumbnail = defaultThumbnail;
      }
      axios.post('https://my-playlist-rux2296.c9users.io/videos', {
        playlistId: id,
        title: this.state.toAddVideo.snippet.title,
        url: this.state.toAddVideo.id.videoId,
        thumbnail: thumbnail,
        channelTitle: this.state.toAddVideo.snippet.channelTitle,
        channelUrl: this.state.toAddVideo.snippet.channelId,
        status: 1
      })
      .then(response => {
        this.props.setVideos(id);
        this.closeAddToPlaylistModal();
      })
      .catch(error => {
        console.log(error);
      });
    }
  }
  
  showLogoutModal() {
    this.openLogoutModal();
  }
  
  logout() {
    this.props.logout();
    this.closeLogoutModal();
  }
  
  render() {
    return(
        <div className="static-modal">
          <Modal show={this.state.showLoginModal} bsSize="small" keyboard={false}>
            <Modal.Header>
              <Modal.Title>Log In</Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
              <div className={this.state.errorDivClass}>{this.state.message}</div>
              <form>
                <FormGroup>
                  <input onChange={this.updateUser} value={this.state.user} className="form-control" placeholder="Username"/>  
                </FormGroup>
                <FormGroup>
                  <input type="password" onChange={this.updatePass} value={this.state.pass} className="form-control" placeholder="Password"/>  
                </FormGroup>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <span>
                Not a member yet?&nbsp;
                <a href="#" onClick={this.switchToRegisterModal}>Register</a> 
                &nbsp;&nbsp;
              </span>
              <Button bsClass="btn btn-default btn-warning" onClick={() => this.checkCredentials(this.state.user, this.state.pass)}>Log In</Button>
            </Modal.Footer>
          </Modal>
          
          <Modal show={this.state.showRegisterModal} bsSize="small" keyboard={false}>
            <Modal.Header>
              <Modal.Title>Register</Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
              <div className={this.state.errorDivClassRegister}>{this.state.messageRegister}</div>
              <form>
                <FormGroup>
                  <input onChange={this.updateEmailRegister} value={this.state.emailRegister} className="form-control" placeholder="email"/>  
                </FormGroup>
                <FormGroup>
                  <input onChange={this.updateUserRegister} value={this.state.userRegister} className="form-control" placeholder="username"/>  
                </FormGroup>
                <FormGroup>
                  <input type="password" onChange={this.updatePassRegister} value={this.state.passRegister} className="form-control" placeholder="password"/>  
                </FormGroup>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <span>
                Have an account?&nbsp;
                <a href="#" onClick={this.switchToLoginModal}>Log In</a> 
                &nbsp;&nbsp;
              </span>
              <Button bsClass="btn btn-default btn-warning" 
                    onClick={() => this.newRegistration(this.state.emailRegister, this.state.userRegister, this.state.passRegister)}>Register</Button>
            </Modal.Footer>
          </Modal>
          
          <Modal show={this.state.showAddPlaylistModal} bsSize="small" keyboard={false} onHide={this.closeAddPlaylistModal}>
            <Modal.Header closeButton>
              <Modal.Title>Add Playlist</Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
              <div className={this.state.errorDivClassAddPlaylist}>{this.state.messageAddPlaylist}</div>
              <form>
                <FormGroup>
                  <input onChange={this.updateAddPlaylistName} value={this.state.addPlaylistName} className="form-control" placeholder="name"/>  
                </FormGroup>
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button bsClass="btn"
                  onClick={() => this.closeAddPlaylistModal()}>Cancel</Button>
              <Button bsClass="btn btn-default btn-warning" 
                    onClick={() => this.newPlaylist(this.state.newPlaylistName)}>Add</Button>
            </Modal.Footer>
          </Modal>
          
          <Modal show={this.state.showEditPlaylistModal} bsSize="small" keyboard={false} onHide={this.closeEditPlaylistModal}>
            <Modal.Header closeButton>
              <Modal.Title>Playlist name</Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
              <div className={this.state.errorDivClassEditPlaylist}>{this.state.messageEditPlaylist}</div>
              <form>
                <FormGroup>
                  <input onChange={this.updateEditPlaylistName} value={this.state.editPlaylistName} className="form-control"/>  
                </FormGroup>
              </form>
            </Modal.Body>
            <Modal.Footer>
             <Button bsClass="btn"
                  onClick={() => this.closeEditPlaylistModal()}>Cancel</Button>
              <Button bsClass="btn btn-default btn-warning" 
                  onClick={() => this.editPlaylistNameF(this.state.editPlaylistName)}>Edit</Button>
            </Modal.Footer>
          </Modal>
          
          <Modal show={this.state.showRemovePlaylistModal} bsSize="small" keyboard={false} onHide={this.closeRemovePlaylistModal}>
            <Modal.Header closeButton>
              <Modal.Title>Remove playlist</Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
              <div>
                Are you sure?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button bsClass="btn"
                  onClick={() => this.closeRemovePlaylistModal()}>Cancel</Button>
              <Button bsClass="btn btn-default btn-warning" 
                  onClick={() => this.removePlaylistF(this.state.removePlaylistId)}>Remove</Button>
            </Modal.Footer>
          </Modal>
          
          <Modal show={this.state.showRemoveVideoModal} bsSize="small" keyboard={false} onHide={this.closeRemoveVideoModal}>
            <Modal.Header closeButton>
              <Modal.Title>Remove video</Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
              <div>
                Are you sure?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button bsClass="btn"
                  onClick={() => this.closeRemoveVideoModal()}>Cancel</Button>
              <Button bsClass="btn btn-default btn-warning" 
                  onClick={() => this.removeVideoF(this.state.removeVideoId)}>Remove</Button>
            </Modal.Footer>
          </Modal>
          
          <Modal show={this.state.showLogoutModal} bsSize="small" keyboard={false} onHide={this.closeLogoutModal}>
            <Modal.Header closeButton>
              <Modal.Title>Logout</Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
              <div>
                Are you sure?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button bsClass="btn"
                  onClick={() => this.closeLogoutModal()}>Cancel</Button>
              <Button bsClass="btn btn-default btn-warning" 
                  onClick={() => this.logout()}>Logout</Button>
            </Modal.Footer>
          </Modal>
          
          <Modal show={this.state.showAddToPlaylistModal} bsSize="small" keyboard={false} onHide={this.closeAddToPlaylistModal}>
            <Modal.Header closeButton>
              <Modal.Title>Choose playlist</Modal.Title>
            </Modal.Header>
      
            <Modal.Body className="text-center">
              <div>
                 <PlaylistGroup playlists = {this.state.playlists} addVideoToPlaylist = {this.addVideoToPlaylist}/>
              </div>
            </Modal.Body>
          </Modal>
          
          <Modal dialogClassName="custom-modal" show={this.state.showPlayVideo} keyboard={false} onHide={this.closePlayVideoModal}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.playVideoName}</Modal.Title>
            </Modal.Header>
            
            <Modal.Body className="text-center">
             <iframe src={this.state.playVideoUrl}/>
            </Modal.Body>
          </Modal>
                  
        </div>
  )}
}

class PlaylistGroup extends Component{ 
 
 addVideoToPlaylist(id) {
   this.props.addVideoToPlaylist(id);
 }
 
  render() {
        return(
              <ListGroup>
                {
                  this.props.playlists.map(playlist => (
                      <ListGroupItem href="#" key={playlist.id} onClick={() => this.addVideoToPlaylist(playlist.id)}>{playlist.name}</ListGroupItem>
                  ))
                }
              </ListGroup>
        );
    }
}

class Video extends Component{
  
    sendAddToPlaylist() {
      this.props.addVideoModal();
    }
    
    sendToPlay() {
      this.props.sendToPlay();
    }
    
    render() {
        let video = this.props.video;
        
        let thumbnail;
        if(video.snippet.thumbnails.medium !== undefined) {
            thumbnail = video.snippet.thumbnails.medium.url;
        } else {
            thumbnail = defaultThumbnail;
        }
        
        return(
            <div className="video">
                <div className="thumbnail">
                    <a onClick={() => this.sendToPlay()} href="#">
                        <img src={thumbnail} alt="thumbnail"/>
                    </a>
                </div>
                <div className="videoDetails">
                  <div>
                    <a className="videoTitle orange" href={"https://www.youtube.com/embed/" + video.id.videoId}>{video.snippet.title}</a>
                  </div>
                  <div>
                    <a className="channelTitle blue" href={"https://www.youtube.com/channel/" + video.snippet.channelId}>{video.snippet.channelTitle}</a>
                  </div>
                </div>
                  <button className="button_right space_bottom space_right" onClick={() => this.sendAddToPlaylist()}>
                      <i className="fa fa-plus-circle fa-2x blue "/>
                  </button>
            </div>
            )
    }
    
}

class PlaylistVideo extends Component{
    sendRemoveFromPlaylist() {
      this.props.addRemoveVideoModal();
    }
    
    sendToPlay() {
      this.props.sendToPlay();
    }
    
    render() {
        let video = this.props.video;
        
        let thumbnail;
        if(video.thumbnail !== undefined) {
            thumbnail = video.thumbnail;
        } else {
            thumbnail = defaultThumbnail;
        }
        
        return(
            <div className="video">
                <div className="thumbnail">
                    <a onClick={() => this.sendToPlay()} href="#">
                        <img src={thumbnail} alt="thumbnail"/>
                    </a>
                </div>
                <div className="videoDetails">
                  <div>
                    <a className="videoTitle orange" href={"https://www.youtube.com/embed/" + video.url}>{video.title}</a>
                  </div>
                  <div>
                    <a className="channelTitle blue" href={"https://www.youtube.com/channel/" + video.channelUrl}>{video.channelTitle}</a>
                  </div>
                </div>
                <div className="button_right space_right_small">
                  <button onClick={() => this.sendRemoveFromPlaylist()} >
                      <i className="fa fa-trash fa-lg blue"/>
                  </button>
                </div>
            </div>
            )
    }
    
}

class List extends Component{
  
  sendPlaylistId(data) {
    this.props.setPlaylistId(data);
  }
  
  openAddPlaylistModal() {
    this.props.openAddPlaylistModalT();
  }
  
  sendEditPlaylistName(id, name) {
    this.props.setEditPlaylistName(id, name);
  }
  
  sendRemovePlaylist(id) {
    this.props.setRemovePlaylist(id);
  }
  
  render() {
    return(
      <div className="playlists_container">
        <div className="no_border space_top flex" id="playlistTab">
            <i className="fa fa-bars fa-2x space_sm space_lr white"/> 
            <span className="listTitle">Your Playlists</span>
            <button className="button_right space_right_medium" onClick = {() => this.openAddPlaylistModal()}>
              <i className="fa fa-plus-circle fa-2x white"/>
            </button>
        </div>
        <div>
          <ScrollArea speed={0.8}
                className="list border"
                contentClassName="content"
                horizontal={false}>
            {
              this.props.playlists.map(playlist => (
                <div className="playlistTitle" key={playlist.id}>
                  <i className="fa fa-music fa-2x blue space_lr space_sm"/>
                  <a className="playlistName blue" href="#" onClick={() => this.sendPlaylistId(playlist.id)}>{playlist.name}</a>
                  <button className="button_right" onClick={() => this.sendEditPlaylistName(playlist.id, playlist.name)}>
                    <i className="fa fa-edit fa-lg blue"/>
                  </button>
                  <button className="button_right_remove space_right" onClick={() => this.sendRemovePlaylist(playlist.id)}>
                    <i className="fa fa-trash fa-lg blue"/>
                  </button>
                </div>)
              )
            }
          </ScrollArea>
        </div>
      </div>
    );
  }
}

class Playlist extends Component{
    addRemoveVideoModal(id) {
      this.props.addRemoveVideoModal(id);
    }
    
    sendToPlay(video) {
      this.props.sendToPlay(video);
    }
    
    render() {
        let name = this.props.name;
        return( 
        <div className="videos_container">
          <div className="no_border space_top flex" id="videoTab">
              <i className="fa fa-video-camera fa-2x space_sm space_lr white"/> 
              <span className="listTitle">Videos {name}</span>
          </div>
          <div>
            <ScrollArea speed={0.8}
                className="playlist border"
                contentClassName="content"
                horizontal={false}>
            {
                this.props.videos.map(video => (
                    <PlaylistVideo key={video.id} video={video} addRemoveVideoModal={() => this.addRemoveVideoModal(video.id)} sendToPlay = {() => this.sendToPlay(video)}/>)
                )
            }
            </ScrollArea>
          </div>
        </div>
        );
    }
    
}

class SearchResults extends Component{
  
  addVideoModal(video) {
    this.props.addVideoModalT(video);
  }
  
  sendToPlay(video) {
    this.props.sendToPlay(video);
  }
  
    render() {
          return( <ScrollArea speed={0.8}
            className="searchResults border"
            contentClassName="content"
            horizontal={false}> 
          {
              this.props.results.map(result => (
                  <Video key={result.id.videoId} video={result} addVideoModal = {() => this.addVideoModal(result)} sendToPlay = {() => this.sendToPlay(result)}/>)
              )
          }
          </ScrollArea>
          );
      }
}

class App extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      playlists: [],
      videos: [],
      results: [],
      searchTermValue: "",
      playlistId: 0,
      usernameTitle: "",
      playlistName: ""
    }
    
    this.logout = this.logout.bind(this);
    this.setVideos = this.setVideos.bind(this);
    this.loadList = this.loadList.bind(this);
    this.eraseDataFromBg = this.eraseDataFromBg.bind(this);
    this.openAddPlaylistModalF = this.openAddPlaylistModalF.bind(this);
    this.setEditPlaylistNameF = this.setEditPlaylistNameF.bind(this);
    this.setRemovePlaylistF = this.setRemovePlaylistF.bind(this);
    this.addVideoModalF = this.addVideoModalF.bind(this);
    this.addRemoveVideoModal = this.addRemoveVideoModal.bind(this);
    this.logoutF = this.logoutF.bind(this);
    this.setTitle = this.setTitle.bind(this);
    this.sendToPlay = this.sendToPlay.bind(this);
    this.sendToPlayYT = this.sendToPlayYT.bind(this);
  }
  
  componentDidMount() {
    if(read_cookie('user').length > 0 && read_cookie('userId') > 0) {
      //get playlists for user
      this.loadList();
    }
  }
  
  loadList() {
    axios.get('https://my-playlist-rux2296.c9users.io/users/' + read_cookie('userId') + '/playlists/all')
      .then(response => {
        if(response.status === 200) {
          this.setState({playlists: response.data});
        } else if(response.status === 204) {
          //todo - add an "empty" paragraph
        }
      })
      .catch(error => {
        console.log(error);
      });
      
    this.setState({usernameTitle: read_cookie('user')});
  }
  
  setVideos(playlistId) {
    this.setState({playlistId: playlistId});
    var playlistName = this.state.playlists.find((playlist) => {
      return playlist.id === playlistId;
    });
    if(playlistName !== null)
      this.setState({playlistName: playlistName.name});
      
    //fetch videos for selected playlist
    axios.get('https://my-playlist-rux2296.c9users.io/playlists/' + playlistId + '/videos')
      .then(response => {
        if(response.status === 200) {
          this.setState({videos: response.data});
        } else if(response.status === 204) {
          //todo - add an "empty" paragraph
        }
      })
      .catch(error => {
        console.log(error);
      });
  }
  
  updateInputValue(evt) {
    this.setState({
      searchTermValue: evt.target.value
    })
  }
  
  searchYoutube(searchKey) {
    YTSearch({ key: 'AIzaSyBJ1j_qBcTaB1-yKR3Za03mBPlCLLCTQz8', term: searchKey }, result => {
      this.setState({results: result});
    });
    
  }  
  
  eraseDataFromBg() {
    this.setState({
      playlists: [],
      videos: [],
      results: [],
      usernameTitle: "",
      playlistName: ""
    });
  }
  
  logout() {
      delete_cookie('user');
      delete_cookie('userId');
      this.refs.modals.openLoginModal();
      this.eraseDataFromBg();
  }
  
  setTitle(title) {
    this.setState({usernameTitle: title});
  }

  openAddPlaylistModalF() {
      this.refs.modals.openAddPlaylistModal();
  }
  
  setEditPlaylistNameF(playlistId, playlistName) {
    this.refs.modals.setEditPlaylistName(playlistId, playlistName);
  }
  
  setRemovePlaylistF(playlistId) {
    this.refs.modals.setRemovePlaylist(playlistId);
  }
  
  addVideoModalF(video) {
    this.refs.modals.setAddVideo(video);
  }
  
  addRemoveVideoModal(videoId) {
    this.refs.modals.addRemoveVideoModal(videoId, this.state.playlistId);
  }
  
  logoutF() {
    this.refs.modals.showLogoutModal();
  }
  
  sendToPlay(video) {
    this.refs.modals.sendToPlay(video);
  }
  
  sendToPlayYT(video) {
    this.refs.modals.sendToPlayYT(video);
  }
  
  render() {
    return (
      <div>
        <div className="col-md-6">
          <div className="name_container space">
            <div className="flex justify">
                <span className="appLogo"><img className="appLogoImg" src="app_fullname.svg" alt="logo"/></span>
                <span className="welcomeTitle orange" id="welcome">Welcome, {this.state.usernameTitle}</span>
                <button className="orange logout_btn" onClick={this.logoutF}>
                  Logout&nbsp;
                <i className="fa fa-gear fa-2x vertical_center blue"/>
              </button>
            </div>
          </div>
          <List playlists={this.state.playlists} setPlaylistId={this.setVideos} openAddPlaylistModalT={this.openAddPlaylistModalF}
                      setEditPlaylistName={this.setEditPlaylistNameF} setRemovePlaylist = {this.setRemovePlaylistF}/>
          <Playlist name={this.state.playlistName} videos={this.state.videos} addRemoveVideoModal = {this.addRemoveVideoModal} sendToPlay = {this.sendToPlay}/>
        </div>
        <div className = "col-md-6">
          <div className="searchbar space">
              <input id="searchTerm" className="form-control border blue space_bottom" type="text" placeholder = "Search YouTube" 
                  value={this.state.searchTermValue} onChange={evt => this.updateInputValue(evt)}/>
              <button onClick={() => this.searchYoutube(this.state.searchTermValue)}>
                <i className="fa fa-search fa-lg blue space_bottom"/>
              </button>
          </div>
          <div>
              <SearchResults results={this.state.results} addVideoModalT={this.addVideoModalF} sendToPlay = {this.sendToPlayYT}/>
          </div>
        </div>
        <Modals ref="modals" loadData={this.loadList} setVideos={this.setVideos} setTitle={this.setTitle} logout={this.logout}/>
      </div>
    );
  }
}

export default App;
