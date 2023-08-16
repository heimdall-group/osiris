import { useProfileStore } from '~/stores/profile';
import { useStore } from '~/stores/main';
import { Return_Posts, Return_Posts_Comments, Return_Posts_Likes, Return_Posts_Replies, Return_Unpublished_Posts } from 'models/return.model';
import { Post, Comment, Post_Unpublished, Posts, Posts_Unpublished, Like } from 'models/post.model';

export const usePostsStore = defineStore('posts', {
  state: () => {
    return {
      posts: {
        posts: [] as Array<Post>,
        skip_amount: 0,
      } as Posts,
      posts_loading: true as boolean,
      posts_false: true as boolean,
      unpublished_posts: {
        posts: [] as Array<Post_Unpublished>,
        skip_amount: 0,
      } as Posts_Unpublished,
      unpublished_posts_loading: true as boolean,
      unpublished_posts_false: true as boolean,
    };
  },
  getters: {
    getPosts(): Posts {
      return this.posts;
    },
    getPosts_loading():boolean {
      return this.posts_loading;
    },
    getPosts_false():boolean {
      return this.posts_false;
    },
    getUnpublished_Posts(): Posts_Unpublished {
      return this.unpublished_posts;
    },
    getUnpublished_Posts_loading():boolean {
      return this.unpublished_posts_loading;
    },
    getUnpublished_Posts_false():boolean {
      return this.unpublished_posts_false;
    },
  },
  actions: {
    pushPosts(result:Return_Posts, limit: number) {
      try {
        if (result.data === 'completed') {
          this.posts_loading = false;
        } else if (result.data === 'no-posts') {
          this.posts_loading = false;
          this.posts_false = false;
        } else if (result.data) {
          const arr = [...this.posts.posts, ...result.data.posts]
          this.posts.posts = [
            ...new Map(arr.map((item) => [item["post_id"], item])).values(),
          ];
          if (result.data.skip_amount) {
            this.posts.skip_amount += result.data.skip_amount;
          }
          
        }
        if (this.posts.posts.length === limit) {
          this.posts_loading = false;
        }
      } catch(error) {
        handle_error(error)
      }
    },
    pushUnpublishedPosts(result:Return_Unpublished_Posts, limit: number) {
      try {
        if (result.data === 'completed') {
          this.unpublished_posts_loading = false;
        } else if (result.data === 'no-posts') {
          this.unpublished_posts_loading = false;
          this.unpublished_posts_false = false;
        } else if (result.data) {
          const arr = [...this.unpublished_posts.posts, ...result.data.posts]
          this.unpublished_posts.posts = [
            ...new Map(arr.map((item) => [item["post_id"], item])).values(),
          ];
          this.unpublished_posts.skip_amount += result.data.skip_amount;
        }
        if (this.unpublished_posts.posts.length === limit) {
          this.unpublished_posts_loading = false;
        }
      } catch(error) {
        handle_error(error)
      }
    },

    pushComments(result: Return_Posts_Comments, post_id: string, limit: number) {
      try {
        const index = this.posts.posts.findIndex((post) => post.post_id === post_id);
        if (index === -1) {
          throw {
            message: 'Couldnt find post to add comments to',
            code: 'posts/couldnt-find-post-to-add-comments-to',
            severity: 4,
            type: 'client',
          }
        }
        const post = this.posts.posts[index];
        const { comments } = post;
        if (result.data === 'completed') {
          comments.comments_loading = false;
        } else if (result.data === 'no-comments') {
          comments.comments_loading = false;
          comments.comments_false = false;
        } else if (result.data) {
          const arr = [...comments.comments, ...result.data.comments]
          comments.comments = [
            ...new Map(arr.map((item) => [item["comment_id"], item])).values(),
          ];
          if (result.data.skip_amount) {
            comments.skip_amount += result.data.skip_amount;
          }
        }
        if (comments.comments.length === limit) {
          comments.comments_loading = false;
        }
      } catch(error) {
        handle_error(error)
      }
    },
    pushReplies(result: Return_Posts_Replies, post_id: string, comment_id: string, limit: number) {
      try {
        const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
        if (post_index === -1) {
          throw {
            message: 'Couldnt find post where comment is',
            code: 'posts/couldnt-find-post-where-comment-is',
            severity: 4,
            type: 'client',
          }
        }
        const post = this.posts.posts[post_index];
        const comment_index = post.comments.comments.findIndex((comment) => comment.comment_id === comment_id)
        if (comment_index === -1) {
          throw {
            message: 'Couldnt find comment to add reply to',
            code: 'posts/couldnt-find-comment-to-add-reply-to',
            severity: 4,
            type: 'client',
          }
        }
        const comment = post.comments.comments[comment_index]
        const { replies } = comment; 
        if (result.data === 'completed') {
          replies.replies_loading = false;
        } else if (result.data === 'no-replies') {
          replies.replies_loading = false;
          replies.replies_false = false;
        } else if (result.data) {
          const arr = [...replies.replies, ...result.data.replies]
          replies.replies = [
            ...new Map(arr.map((item) => [item["reply_id"], item])).values(),
          ];
          
          if (result.data.skip_amount) {
            replies.skip_amount += result.data.skip_amount;
          }
        }
        if (replies.replies.length === limit) {
          replies.replies_loading = false;
        }
      } catch(error) {
        handle_error(error)
      }
    },
    pushLikes(result: Return_Posts_Likes, post_id: string, limit: number) {
      try {
        const index = this.posts.posts.findIndex((post) => post.post_id === post_id);
        if (index === -1) {
          throw {
            message: 'Couldnt find post to add likes to',
            code: 'posts/couldnt-find-post-to-add-likes-to',
            severity: 4,
            type: 'client',
          }
        }
        const post = this.posts.posts[index];
        const { likes } = post; 
        if (result.data === 'completed') {
          likes.likes_false = false;
        } else if (result.data === 'no-likes') {
          likes.likes_loading = false;
          likes.likes_false = false;
        } else if (result.data) {
          const arr = [...likes.likes, ...result.data.likes]
          likes.likes = [
            ...new Map(arr.map((item) => [item["user_handle"], item])).values(),
          ];
          if (result.data.skip_amount) {
            likes.skip_amount += result.data.skip_amount;
          }
        }
        if (likes.likes.length === limit) {
          likes.likes_loading = false;
        }
      } catch(error) {
        handle_error(error)
      }
    },

    spliceRemoveUnpublishedPost(post_id: string) {
      try {
        const post_index = this.unpublished_posts.posts.findIndex((post) => post.post_id === post_id);
        if (post_index === -1) {
          throw {
            message: 'Couldnt find unpublished post to remove',
            code: 'posts/couldnt-find-unpublished-post-to-remove',
            severity: 4,
            type: 'client',
          }
        } 

        const profileStore = useProfileStore();
        profileStore.decrementProfilePostsCount()
        this.unpublished_posts.posts.splice(post_index, 1)

        if (this.unpublished_posts.posts.length === 0) {
          this.unpublished_posts_false = false;
        }
      } catch(error: any) {
        handle_error(error);
      }
    },
    spliceRemovePost(post_id: string) {
      try {
        const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
        if (post_index === -1) {
          throw {
            message: 'Couldnt find post to remove',
            code: 'posts/couldnt-find-post-to-remove',
            severity: 4,
            type: 'client',
          }
        } 

        this.posts.posts.splice(post_index, 1);
        if (this.posts.posts.length === 0) {
          this.posts_false = false;
        }
      } catch(error: any) {
        handle_error(error);
      }
    },
    spliceRemovePostLike(post_id: string) {
      try {
        const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
        if (post_index === -1) {
          throw {
            message: 'Couldnt find post to remove comment from',
            code: 'posts/couldnt-find-post-to-remove-comment-from',
            severity: 4,
            type: 'client',
          }
        } 

        const store = useStore();
        const user = store.getUser;
        const user_db = store.getUser_db;
        const post = this.posts.posts[post_index];
        const { likes } = post
        const likes_index = likes.likes.findIndex((like) => like.user_handle === user_db.user_handle);
        if (likes_index === -1) {
          throw {
            message: 'Couldnt find like to remove from post',
            code: 'posts/couldnt-find-like-to-remove-from-post',
            severity: 4,
            type: 'client',
          }
        } 

        likes.likes.splice(likes_index, 1)
        if (likes.likes.length === 0) {
          likes.likes_false = false;
        }
      } catch(error: any) {
        handle_error(error);
      }
    }, 
    spliceRemoveComment(post_id: string, comment_id: string) {
      try {
        const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
        if (post_index === -1) {
          throw {
            message: 'Couldnt find post to remove comment from',
            code: 'posts/couldnt-find-post-to-remove-comment-from',
            severity: 4,
            type: 'client',
          }
        }
        const post = this.posts.posts[post_index];
        const { comments } = post;

        const comment_index = comments.comments.findIndex((comment) => comment.comment_id === comment_id)
        if (comment_index === -1) {
          throw {
            message: 'Couldnt find comment to remove from post',
            code: 'posts/couldnt-find-comment-to-remove-from-post',
            severity: 4,
            type: 'client',
          }
        }
        comments.comments.splice(comment_index, 1);
        if (comments.comments.length === 0) {
          comments.comments_false = false;
        }
      } catch(error: any) {
        handle_error(error);
      }
    },
    spliceRemoveReply(post_id: string, comment_id: string, reply_id: string) {
      try {
        const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
        if (post_index === -1) {
          throw {
            message: 'Couldnt find post to remove comment from',
            code: 'posts/couldnt-find-post-to-remove-comment-from',
            severity: 4,
            type: 'client',
          }
        } 

        const { comments } = this.posts.posts[post_index];
        const comment_index = comments.comments.findIndex((comment) => comment.comment_id === comment_id)
        if (comment_index === -1) {
          throw {
            message: 'Couldnt find comment to remove from post',
            code: 'posts/couldnt-find-comment-to-remove-from-post',
            severity: 4,
            type: 'client',
          }
        }

        const { replies } = comments.comments[comment_index];
        const replies_index = replies.replies.findIndex((reply) => reply.reply_id === reply_id)
        if (replies_index === -1) {
          throw {
            message: 'Couldnt find reply to remove from comment',
            code: 'posts/couldnt-find-reply-to-remove-from-comment',
            severity: 4,
            type: 'client',
          }
        }
        replies.replies.splice(replies_index, 1);
        if (replies.replies.length === 0) {
          replies.replies_false = false;
        }
      } catch(error: any) {
        handle_error(error);
      }
    },

    incrementPostLikeCount(post_id: string) {
      const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
      if (post_index === -1) {
        throw {
          message: 'Couldnt find post to increment like count on',
          code: 'posts/couldnt-find-post-to-increment-like-count-on',
          severity: 4,
          type: 'client',
        }
      }
      const post = this.posts.posts[post_index];
      post.likes_count++
    },
    incrementPostCommentCount(post_id: string) {
      const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
      if (post_index === -1) {
        throw {
          message: 'Couldnt find post to increment comment count on',
          code: 'posts/couldnt-find-post-to-increment-comment-count-on',
          severity: 4,
          type: 'client',
        }
      }
      const post = this.posts.posts[post_index];
      post.comments_count++
    },
    incrementCommentReplyCount(post_id: string, comment_id: string) {
      const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
      if (post_index === -1) {
        throw {
          message: 'Couldnt find post to increment reply count on',
          code: 'posts/couldnt-find-post-to-increment-reply-count-on',
          severity: 4,
          type: 'client',
        }
      }
      const post = this.posts.posts[post_index];
      const comment_index = post.comments.comments.findIndex((comment) => comment.comment_id === comment_id )
      if (comment_index === -1) {
        throw {
          message: 'Couldnt find comment to increment reply count on',
          code: 'posts/couldnt-find-comment-to-increment-reply-count-on',
          severity: 4,
          type: 'client',
        }
      }
      const comment = post.comments.comments[comment_index];
      comment.reply_count++
    },

    decrementPostLikeCount(post_id: string) {
      const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
      if (post_index === -1) {
        throw {
          message: 'Couldnt find post to decrement like count on',
          code: 'posts/couldnt-find-post-to-decrement-like-count-on',
          severity: 4,
          type: 'client',
        }
      }
      const post = this.posts.posts[post_index];
      post.likes_count--
    },
    decrementPostCommentCount(post_id: string) {
      const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
      if (post_index === -1) {
        throw {
          message: 'Couldnt find post to decrement comment count on',
          code: 'posts/couldnt-find-post-to-decrement-comment-count-on',
          severity: 4,
          type: 'client',
        }
      }
      const post = this.posts.posts[post_index];
      post.comments_count--
    },
    decrementCommentReplyCount(post_id: string, comment_id: string) {
      const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
      if (post_index === -1) {
        throw {
          message: 'Couldnt find post to decrement reply count on',
          code: 'posts/couldnt-find-post-to-decrement-reply-count-on',
          severity: 4,
          type: 'client',
        }
      }
      const post = this.posts.posts[post_index];
      const comment_index = post.comments.comments.findIndex((comment) => comment.comment_id === comment_id )
      if (comment_index === -1) {
        throw {
          message: 'Couldnt find comment to decrement reply count on',
          code: 'posts/couldnt-find-comment-to-decrement-reply-count-on',
          severity: 4,
          type: 'client',
        }
      }
      const comment = post.comments.comments[comment_index];
      comment.reply_count--
    },

    setLikesFalse(post_id: string) {
      const index = this.posts.posts.findIndex((post) => post.post_id === post_id);
      if (index === -1) {
        throw {
          message: 'Couldnt find post to enable likes fetch on',
          code: 'posts/couldnt-find-post-to-enable-likes-fetch-on',
          severity: 4,
          type: 'client',
        }
      }
      this.posts.posts[index].likes.likes_false = true;
    },
    setCommentsFalse(post_id: string) {
      const index = this.posts.posts.findIndex((post) => post.post_id === post_id);
      if (index === -1) {
        throw {
          message: 'Couldnt find post to enable comments fetch on',
          code: 'posts/couldnt-find-post-to-enable-comments-fetch-on',
          severity: 4,
          type: 'client',
        }
      }
      this.posts.posts[index].comments.comments_false = true;
    },
    setRepliesFalse(post_id: string, comment_id: string) {
      const post_index = this.posts.posts.findIndex((post) => post.post_id === post_id);
      if (post_index === -1) {
        throw {
          message: 'Couldnt find post with comment to enable replies fetch on',
          code: 'posts/couldnt-find-post-with-comment-to-enable-replies-fetch-on',
          severity: 4,
          type: 'client',
        }
      }

      const { comments } = this.posts.posts[post_index] 
      const comment_index = comments.comments.findIndex((comment) => comment.comment_id === comment_id);
      if (comment_index === -1) {
        throw {
          message: 'Couldnt find comment to enable replies fetch on',
          code: 'posts/couldnt-find-comment-to-enable-replies-fetch-on',
          severity: 4,
          type: 'client',
        }
      };
      comments.comments[comment_index].replies.replies_false = true;
    },


    resetPosts() {
      this.posts = {
        posts: [] as Array<Post>,
        skip_amount: 0,
      } as Posts;
      this.posts_loading = true as boolean;
      this.posts_false = true as boolean;
    },
    resetUnpublishedPosts() {
      this.unpublished_posts = {
        posts: [] as Array<Post_Unpublished>,
        skip_amount: 0,
      } as Posts_Unpublished;
      this.unpublished_posts_loading = true as boolean;
      this.unpublished_posts_false = true as boolean;
    },
  },
});
