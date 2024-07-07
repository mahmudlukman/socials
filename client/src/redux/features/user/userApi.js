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
    editProfile: builder.mutation({
      query: (data) => ({
        url: 'update-user',
        method: 'PUT',
        body: data,
        credentials: 'include',
      }),
    }),
    updateUserRole: builder.mutation({
      query: (id) => ({
        url: `update-user-status/${id}`,
        method: 'PUT',
        credentials: 'include',
      }),
    }),
    updateProfilePicture: builder.mutation({
      query: (formData) => ({
        url: 'update-profile-picture',
        method: 'PUT',
        body: formData,
        credentials: 'include',
      }),
    }),
    updateCoverPicture: builder.mutation({
      query: ({ coverPicture }) => ({
        url: 'update-cover-picture',
        method: 'PUT',
        body: { coverPicture },
        credentials: 'include',
      }),
    }),
    followUnfollow: builder.mutation({
      query: (id) => ({
        url: `follow-unfollow/${id}`,
        method: 'PUT',
        credentials: 'include',
      }),
    }),
    getNotifications: builder.query({
      query: () => ({
        url: 'get-notifications',
        method: 'GET',
        credentials: 'include',
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `delete-user/${id}`,
        method: 'DELETE',
        credentials: 'include',
      }),
    }),
  }),
});

export const {
  useGetUserQuery,
  useEditProfileMutation,
  useUpdateProfilePictureMutation,
  useUpdateCoverPictureMutation,
  useUpdateUserRoleMutation,
  useFollowUnfollowMutation,
  useGetNotificationsQuery,
  useDeleteUserMutation,
} = userApi;
