import { apiSlice } from '../api/apiSlice';

export const postApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: (data) => ({
        url: 'create',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
    }),
    getPosts: builder.query({
      query: () => ({
        url: 'get-posts',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    getPost: builder.query({
      query: (postId) => ({
        url: `get-post/${postId}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    getUserPosts: builder.query({
      query: () => ({
        url: 'get-user-posts',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    updateLikes: builder.mutation({
      query: ({ postId }) => ({
        url: 'update-likes',
        method: 'PUT',
        body: { postId },
        credentials: 'include',
      }),
    }),
    addReplies: builder.mutation({
      query: () => ({
        url: 'add-replies',
        method: 'PUT',
        credentials: 'include',
      }),
    }),
    addReply: builder.mutation({
      query: () => ({
        url: 'add-reply',
        method: 'PUT',
        credentials: 'include',
      }),
    }),
    updateRepliesReact: builder.mutation({
      query: () => ({
        url: 'update-replies-react',
        method: 'PUT',
        credentials: 'include',
      }),
    }),
    updateReplyReact: builder.mutation({
      query: () => ({
        url: 'update-reply-react',
        method: 'PUT',
        credentials: 'include',
      }),
    }),
    deletePost: builder.mutation({
      query: (id) => ({
        url: `delete/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsQuery,
  useGetPostQuery,
  useGetUserPostsQuery,
  useAddReplyMutation,
  useAddRepliesMutation,
  useDeletePostMutation,
  useUpdateLikesMutation,
  useUpdateRepliesReactMutation,
  useUpdateReplyReactMutation,
} = postApi;
