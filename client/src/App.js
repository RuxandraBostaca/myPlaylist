import React, { Component } from 'react';
import './App.css';
import defaultThumbnail from './default.jpg'
import YTSearch from 'youtube-api-search';
import ScrollArea from 'react-scrollbar';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { FormGroup } from 'react-bootstrap'
import { p } from 'react-bootstrap'
import axios from 'axios';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';


class Modals extends Component {
  
  constructor(props) {
      super(props)
      
      this.state = {
        showRegisterModal: false,
        showLoginModal: false,
        user: "",
        pass: "",
        emailRegister: "",
        userRegister: "",
        passRegister: "",
        message:"",
        messageRegister: "",
        errorDivClass: "hidden",
        errorDivClassRegister: "hidden"
      }
      
      this.openRegisterModal = this.openRegisterModal.bind(this);
      this.openLoginModal = this.openLoginModal.bind(this);
      this.closeRegisterModal = this.closeRegisterModal.bind(this);
      this.closeLoginModal = this.closeLoginModal.bind(this);
      this.updateUser = this.updateUser.bind(this);
      this.updatePass = this.updatePass.bind(this);
      this.updateEmailRegister = this.updateEmailRegister.bind(this);
      this.updateUserRegister = this.updateUserRegister.bind(this);
      this.updatePassRegister = this.updatePassRegister.bind(this);
      this.switchToRegisterModal = this.switchToRegisterModal.bind(this);
  }
  
  componentDidMount() {
    if(read_cookie('user').length > 0 && read_cookie('userId') > 0) {
      console.log('welcome, ' + read_cookie('user'));
      this.setState({showLoginModal: false});  
    }
    else {
      this.setState({showLoginModal: true});  
    }
  }
  
  checkCredentials(user, pass) {
    this.setState({message: ""});
    this.setState({errorDivClass: "hidden"});
    
    //check if user exists
    axios.get('https://my-playlist-rux2296.c9users.io/users/' + user + '/' + pass)
    .then(response => {
      if(response.status === 200) { 
         bake_cookie('user', user);
         bake_cookie('userId', response.data.id);
         this.closeLoginModal();
         //todo - get data, load it
      } else if(response.status === 204) {
        this.setState({message: "Invalid Credentials"});
        this.setState({errorDivClass: "errorDiv"});
      }
    })
    .catch(error => {
      this.setState({message: error});
      this.setState({errorDivClass: "errorDiv"});
    });
  }
  
  openRegisterModal() {
    this.setState({showRegisterModal: true});
  }
  
  openLoginModal() {
    this.setState({showLoginModal: true});
  }
  
  closeRegisterModal() {
    this.setState({showRegisterModal: false});
    
  }
  
  closeLoginModal() {
    this.setState({showLoginModal: false});
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
  
  switchToRegisterModal() {
      this.closeLoginModal();
      this.openRegisterModal();
  }
  
  newRegistration(email, user, pass) {
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
      //todo - add new user "welcome" data
    })
    .catch(error => {
      console.log(error);
    });
  }
  
  render() {
    return(
        <div className="static-modal">
          <Modal show={this.state.showLoginModal} bsSize="small" onHide={() => this.closeLoginModal()}>
            <Modal.Header closeButton>
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
                <a href="#" onClick={() => this.switchToRegisterModal()}>Register</a> 
                &nbsp;&nbsp;
              </span>
              <Button bsClass="btn btn-default btn-info" onClick={() => this.checkCredentials(this.state.user, this.state.pass)}>Log In</Button>
            </Modal.Footer>
      
          </Modal>
          <Modal show={this.state.showRegisterModal} bsSize="small" onHide={this.closeRegisterModal}>
            <Modal.Header closeButton>
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
              <Button bsClass="btn btn-default btn-info" 
                    onClick={() => this.newRegistration(this.state.emailRegister, this.state.userRegister, this.state.passRegister)}>Register</Button>
            </Modal.Footer>
      
          </Modal>
        </div>
  )}
}

class Video extends Component{
    
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
                    <a href={"https://www.youtube.com/embed/" + video.id.videoId}>
                        <img src={thumbnail} alt="thumbnail"/>
                    </a>
                </div>
                <div className="videoDetails">
                  <div>
                    <a className="videoTitle" href={"https://www.youtube.com/embed/" + video.id.videoId}>{video.snippet.title}</a>
                  </div>
                  <div>
                    <a className="channelTitle" href={"https://www.youtube.com/channel/" + video.snippet.channelId}>{video.snippet.channelTitle}</a>
                  </div>
                </div>
                <div>
                  <button>
                      <i className="fa fa-plus-circle fa-2x blue"/>
                  </button>
                </div>
            </div>
            )
    }
    
}

class List extends Component{
  
    render() {
      return(
        <div>
          <div className="blue_border space_top flex">
              <i className="fa fa-bars fa-2x space_sm space_lr blue"/> 
              <span className="listTitle">Your Playlists</span>
          </div>
          <div className="blue_border flex">
            <ScrollArea speed={0.8}
                  className="area"
                  contentClassName="content"
                  horizontal={false}>
              {
                this.props.playlists.map(playlist => (
                  <a href="#">{playlist.name}</a>)
                )
              }
            </ScrollArea>
          </div>
        </div>
      );
    }
}

class Playlist extends Component{
    render() {
        return( <ScrollArea speed={0.8}
            className="area"
            contentClassName="content"
            horizontal={false}>
        {
            this.props.videos.map(video => (
                <Video key={video.id} video={video}/>)
            )
        }
        </ScrollArea>
        );
    }
    
}

class SearchResults extends Component{
    render() {
          return( <ScrollArea speed={0.8}
            className="searchResults blue_border"
            contentClassName="content"
            horizontal={false}> 
          {
              this.props.results.map(result => (
                  <Video key={result.id.videoId} video={result}/>)
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
      searchTermValue: ""
    }
    
    this.logout = this.logout.bind(this);
  }
  
  componentDidMount() {
    if(read_cookie('user').length > 0 && read_cookie('userId') > 0) {
      //get playlists for user
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
  
  logout() {
      delete_cookie('user');
      delete_cookie('userId');
      this.refs.modals.openLoginModal();
      //todo - erase data from background
  }

  render() {
    return (
      <div>
        <div className="col-md-6">
          <List playlists={this.state.playlists}/>
          
        </div>
        <div className = "col-md-6">
          <div className="searchbar space">
              <input id="searchTerm" className="form-control blue_border" type="text" placeholder = "Search YouTube" 
                  value={this.state.searchTermValue} onChange={evt => this.updateInputValue(evt)}/>
              <button className="btn btn-default btn-info" onClick={() => this.searchYoutube(this.state.searchTermValue)}>
                <i className="fa fa-search"/>
              </button>
          </div>
          <div>
              <SearchResults results={this.state.results} />
          </div>
          <div className="pull-right space">
            <button onClick={this.logout}>
              Logout&nbsp;
              <i className="fa fa-gear fa-2x"/>
            </button>
          </div>
        </div>
        <Modals ref="modals"/>
      </div>
    );
  }
}

export default App;
