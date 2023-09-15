const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
require("dotenv").config({ path: "../env/development.env" });
const postService = require('../service/post-service'); // 테스트할 모듈을 가져옵니다.


describe('Post Service Unit Tests', function () {

  describe('getPosts', function () {
    it('should not throw an error if posts are found', async function () {
      const posts = await postService.getPosts();
      expect(() => {
        if (!posts.length) {
          throw new Error('Posts not found');
        }
      }).to.not.throw();
    });
  });

  describe('getPostById', function () {
    it('should return a post by ID', async function () {
      const post = await postService.getPostById(1);
      expect(post).to.be.an('object');
      expect(post.POST_ID).to.equal(1);
    });
  });
  
  describe('getPostByUserId', function () {
    it('should return a post by USER_ID', async function () {
      const posts = await postService.getPostsByUserId(1);
      expect(posts).to.be.an('array');
      expect(posts[0].USER_ID).to.equal(1);
    });
  });

  describe('addPost', function () {
    let user_id = 1;
    it('should add a new post', async function () {
      const post = {
        POST_TITLE: 'new post',
        POST_CONTENT: 'new post content',
      }

      const addedPost = await postService.addPost(post,user_id);
      expect(addedPost).to.be.an('object');
      expect(addedPost.POST_TITLE).to.equal('new post');
      expect(addedPost.POST_CONTENT).to.equal('new post content');
      expect(addedPost.USER_ID).to.equal(1);
    });
  });

  describe('deletePost', function () {
    let addedPostId;
    before(async function () {
      const post = {
        POST_TITLE: 'new post',
        POST_CONTENT: 'new post content',
      }
      const addedPost = await postService.addPost(post,1);
      addedPostId = addedPost.POST_ID;
    });

    it('should delete a post', async function () {
      const deletedRows = await postService.deletePost(addedPostId);
      expect(deletedRows).to.equal(1);
    });
  });

  describe('updatePost', function () {
    let addedPostId;
    before(async function () {
      const post = {
        POST_TITLE: 'new post',
        POST_CONTENT: 'new post content',
      }
      const addedPost = await postService.addPost(post,1);
      addedPostId = addedPost.POST_ID;
    });
    it('should update a post', async function () {
      const post = {
        POST_TITLE: 'updated post',
        POST_CONTENT: 'updated post content',
      }
      const updatedPost = await postService.updatePost(post,addedPostId);
      expect(updatedPost).to.be.an('object');
      expect(updatedPost.POST_TITLE).to.equal('updated post');
      expect(updatedPost.POST_CONTENT).to.equal('updated post content');
    });
    after(async function () {
      const deletedRows = await postService.deletePost(addedPostId);
      expect(deletedRows).to.equal(1);
    });
  });

});

