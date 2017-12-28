import React, { Component } from 'react';
import './App.css';
import defaultThumbnail from './default.jpg'
import YTSearch from 'youtube-api-search';
import ScrollArea from 'react-scrollbar';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import axios from 'axios';
import { bake_cookie, read_cookie, delete_cookie } from 'sfcookies';


class Modals extends Component {
  
  constructor(prop) {
      super(prop)
      
      this.prop = {
        showRegisterModal: false,
        showLoginModal: false
      }
  }
  
  checkCredentials(user, pass) {
    let api = 'https://my-playlist-rux2296.c9users.io/users/' + user + '/' + pass;
    axios.get(api).then((results) => {
      console.log(results.data);
      if(results.data !== undefined) {
          bake_cookie('user', user);
          bake_cookie('pass', pass);
          //todo - get data; read_cookie('user')
      }
      else {
        console.log('wrong creds');
        //todo - errors
      }
    });
  }
  
  logout() {
      delete_cookie('user');
      delete_cookie('pass');
      //todo - erase data, show modal
  }
  
  render() {
    return(
        <div className="static-modal hidden">
          <Modal.Dialog>
            <Modal.Header>
              <Modal.Title>Modal title</Modal.Title>
            </Modal.Header>
      
            <Modal.Body>
              One fine body...
            </Modal.Body>
      
            <Modal.Footer>
              <Button>Close</Button>
              <Button bsStyle="info">Save changes</Button>
            </Modal.Footer>
      
          </Modal.Dialog>
        </div>
  )}
}

class Video extends Component{
    
    render() {
        let video = this.props.video; console.log(video);
        
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

  render() {
    return (
      <div>
        <div className="col-md-6">
          Test
          <Modals/>
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
            <button>
              <i className="fa fa-gear fa-2x"/>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
