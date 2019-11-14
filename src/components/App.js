import React, { Component } from 'react';
import axios from 'axios'

import './App.css';

import Header from './Header/Header';
import Compose from './Compose/Compose';
import Post from './Post/Post'

axios.defaults.headers.common['Content-Type'] = 'application/json';

class App extends Component {
  constructor() {
    super();

    this.state = {
      posts: [],
    };

    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
    this.createPost = this.createPost.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
  }

  componentDidMount() {
    axios
      .get('http://localhost:9090/posts')
      .then(response => {
        this.setState({
          posts: [...response.data]
        })
      })
      .catch(err => console.log(err))
  }

  updatePost(id, text) {
    axios
      .patch(`http://localhost:9090/posts/${id}`, { text })
      .then(response => {
        this.setState({
          post: response.data
        })
      })
      .catch(err => console.log(err))
  }

  deletePost(id) {
    axios
      .delete(`http://localhost:9090/posts/${id}`)
      .then(response => {
        this.setState({
          post: this.state.posts.filter(post => post.id !== id)
        });
      })
      .catch(err => console.log(err))
  }

  createPost(text) {
    axios
      .post(`http://localhost:9090/posts`, { text })
      .then(results => {
        console.log(results.data);
        this.setState({
          posts: results.data
        })
      })
      .catch(err => console.log(err))
  }

  handleSearch(e) {
    axios
      .get(`http://localhost:9090/posts`)
      .then(res => {
        var val = res.data.filter(item => {
          return item.text.match(e)
        })
        this.setState({
          posts: val
        })
      })
      .catch(err => console.log(err))
  }

  render() {
    const { posts } = this.state;

    return (
      <div className="App__parent">
        <Header searchText={this.handleSearch} />

        <section className="App__content">
          <Compose
            createPostFn={this.createPost} />
          {posts.map(post => (
            <Post
              key={post.id}
              id={post.id}
              text={post.text}
              date={post.date}
              updatePostFn={this.updatePost}
              deletePostFn={this.deletePost} />
          ))}
        </section>
      </div>
    );
  }
}

export default App;
