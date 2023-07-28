import { defineStore } from 'pinia';
import { Return_Posts, Return_Unpublished_Posts } from 'models/return.model';
import { Post, Post_Unpublished, Posts, Posts_Unpublished } from 'models/post.model';

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
          this.posts.posts = Array.from(new Set([...this.posts.posts, ...result.data.posts]))
          this.posts.skip_amount += result.data.skip_amount;
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
          this.unpublished_posts.posts = Array.from(new Set([...this.unpublished_posts.posts, ...result.data.posts]))
          this.unpublished_posts.skip_amount += result.data.skip_amount;
        }
        if (this.unpublished_posts.posts.length < limit) {
          this.unpublished_posts_loading = false;
        }
      } catch(error) {
        handle_error(error)
      }
    },
    async cutUnpublishedPost(post: Post_Unpublished) {
      const index = this.unpublished_posts.posts.indexOf(post);
      if (index !== -1) {
        this.unpublished_posts.posts.splice(index, 1)
        return {
          success: true,
        }
      } else {
        return {
          success: false,
        }
      }
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
