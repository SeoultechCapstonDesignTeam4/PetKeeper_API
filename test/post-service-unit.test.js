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
      console.log(posts);
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
    let addedPost;
    let user_id = 1;
    it('should add a new post', async function () {
      const post = {
        POST_TITLE: 'new post',
        POST_CONTENT: 'new post content',
      }
      addedPost = await postService.addPost(post,user_id);
      expect(addedPost).to.be.an('object');
      expect(addedPost.POST_TITLE).to.equal('new post');
      expect(addedPost.POST_CONTENT).to.equal('new post content');
      expect(addedPost.USER_ID).to.equal(1);
    });
    after(async function () {
      const deletedRows = await postService.deletePost(addedPost.POST_ID);
      expect(deletedRows).to.equal(1);
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

describe('Like Service Unit Tests', function () {
  describe('addLike', function () {
    let user_id = 1;
    let post_id = 2;
    it('should add a new like', async function () {
      const addedLike = await postService.addLike(post_id, user_id);
      expect(addedLike).to.be.an('object');
      expect(addedLike.USER_ID).to.equal(user_id);
      expect(addedLike.POST_ID).to.equal(post_id);
    });
    after(async function () {
      const deletedRows = await postService.deleteLike(post_id, user_id);
      expect(deletedRows).to.equal(1);
    });
  });

  describe('getLikesByPostId', function () {
    it('should return likes by POST_ID', async function () {
      const likes = await postService.getLikesByPostId(1);
      expect(likes).to.be.an('array');
      expect(likes[0].POST_ID).to.equal(1);
      console.log(likes);
    });
  });

  describe('getLikesByUserId', function () {
    it('should return likes by USER_ID', async function () {
      const likes = await postService.getLikesByUserId(1);
      expect(likes).to.be.an('array');
      expect(likes[0].USER_ID).to.equal(1);
      console.log(likes);
    });
  });
  describe('deleteLike', function () {
    let addedLike
    before(async function () {
      addedLike = await postService.addLike(2, 1);
    });
    it('should delete a like', async function () {
      const deletedRows = await postService.deleteLike(2, 1);
      expect(deletedRows).to.equal(1);
    });
  });
});

// describe('Comment Service Unit Tests', function () {

// });

describe('Post Photo Service Unit Tests', function () {
  let user_id = 1;
  let post_id = 2;
  let key = 'test.jpg';
  const photo ={
    POST_ID: post_id,
    PHOTO_PATH: key
  }
  describe('addPostPhoto', function () {
    let addedPostPhoto
    it('should add a new post photo', async function () {
      addedPostPhoto = await postService.addPostPhoto(photo,user_id);
      expect(addedPostPhoto).to.be.an('object');
      expect(addedPostPhoto.POST_ID).to.equal(2);
      expect(addedPostPhoto.PHOTO_PATH).to.equal('test.jpg');

    });
    after(async function () {
      const deletedRows = await postService.deletePostPhoto(addedPostPhoto.PHOTO_ID);
      expect(deletedRows).to.equal(1);
    });
  });

  describe('getPhotosByPostId', function () {
    it('should return photos by POST_ID', async function () {
      const photos = await postService.getPostPhotosByPostId(1);
      expect(photos).to.be.an('array');
      expect(photos[0].POST_ID).to.equal(1);
      console.log(photos);
    });
  })
  describe('getPhotosByUserId', function () {
    it('should return photos by USER_ID', async function () {
      const photos = await postService.getPostPhotosByUserId(1);
      expect(photos).to.be.an('array');
      expect(photos[0].USER_ID).to.equal(1);
      console.log(photos);
    });
  });
  describe('updatePhoto', function () {
    let addedPhoto;
    let user_id = 1;
    let photo = {
      POST_ID: 1,
      PHOTO_PATH: 'test.jpg',
    };
    before(async function () {
      addedPhoto = await postService.addPostPhoto(photo, user_id);
    });
    it('should update a photo', async function () {
      const UpdatedPhoto = {
        PHOTO_ID: addedPhoto.PHOTO_ID,
        POST_ID: addedPhoto.POST_ID,
        PHOTO_PATH: 'updated.jpg',
      };
      const updatedPhoto = await postService.updatePostPhoto(
        UpdatedPhoto,
        UpdatedPhoto.PHOTO_ID
      );
      expect(updatedPhoto).to.be.an('object');
      expect(updatedPhoto.PHOTO_PATH).to.equal('updated.jpg');
    });
    after(async function () {
      const deletedRows = await postService.deletePostPhoto(addedPhoto.PHOTO_ID);
      expect(deletedRows).to.equal(1);
    });
  });
  describe('deletePostPhoto', function () {
    let addedPhoto
    before(async function () {
      addedPhoto = await postService.addPostPhoto(photo);
    });
    it('should delete a photo', async function () {
      const deletedPhoto={
        POST_ID: addedPhoto.POST_ID,
        USER_ID: addedPhoto.USER_ID,
      }
      const deletedRows = await postService.deletePostPhoto(addedPhoto.PHOTO_ID);
      expect(deletedRows).to.equal(1);
    });
  });
});

describe('Post Comment Service Unit Tests', function () {
  let user_id = 3;
  let post_id = 1;

  describe('addComment', function () {
    let addedComment;
    it('should add a new comment', async function () {
      const comment = {
        POST_ID: post_id,
        USER_ID: user_id,
        COMMENT_TEXT: 'new comment',
      }
      addedComment = await postService.addComment(comment);
      expect(addedComment).to.be.an('object');
      expect(addedComment.COMMENT_TEXT).to.equal('new comment');
    });
    after(async function () {
      const deletedRows = await postService.deleteComment(addedComment.COMMENT_ID);
      expect(deletedRows).to.equal(1);
    });
  });
  
  describe('getCommentsByPostId', function () {
    it('should return comments by POST_ID', async function () {
      const comments = await postService.getCommentsByPostId(1);
      expect(comments).to.be.an('array');
      expect(comments[0].POST_ID).to.equal(1);
      console.log(comments);
    });
  });
  describe('getCommentsByUserId', function () {
    it('should return comments by USER_ID', async function () {
      const comments = await postService.getCommentsByUserId(1);
      expect(comments).to.be.an('array');
      expect(comments[0].USER_ID).to.equal(1);
      console.log(comments);
    });
  });
  describe('updateComment', function () {
    let addedComment
    before(async function () {
      const comment = {
        POST_ID: post_id,
        USER_ID: user_id,
        COMMENT_TEXT: 'new comment',
      }
      addedComment = await postService.addComment(comment);
    });
    it('should update a comment', async function () {
      const comment = {
        COMMENT_ID: addedComment.COMMENT_ID,
        POST_ID: addedComment.POST_ID,
        USER_ID: addedComment.USER_ID,
        COMMENT_TEXT: 'updated comment',
      }
      const updatedComment = await postService.updateComment(comment,comment.COMMENT_ID);
      expect(updatedComment).to.be.an('object');
      expect(updatedComment.COMMENT_TEXT).to.equal('updated comment');
    });
    after(async function () {
      const deletedRows = await postService.deleteComment(addedComment.COMMENT_ID);
      expect(deletedRows).to.equal(1);
    });
  });
  describe('deleteComment', function () {
    let addedComment
    before(async function () {
      const comment = {
        POST_ID: post_id,
        USER_ID: user_id,
        COMMENT_TEXT: 'new comment',
      }
      addedComment = await postService.addComment(comment);
    });
    it('should delete a comment', async function () {
      const deletedRows = await postService.deleteComment(addedComment.COMMENT_ID);
      expect(deletedRows).to.equal(1);
    });
  });

});