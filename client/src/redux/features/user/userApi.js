import { apiSlice } from '../api/apiSlice';

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query({
      query: ({ userId }) => ({
        url: `get-user/${userId}`,
        method: 'GET',
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

export const { useGetUserQuery } = userApi;
