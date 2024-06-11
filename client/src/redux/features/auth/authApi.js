import { apiSlice } from '../api/apiSlice';
import { userLoggedOut, userLoggedIn, userRegistration } from './authSlice';

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: 'register',
        method: 'POST',
        body: data,
        credentials: 'include',
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token }) => ({
        url: `activate-user?token=${activation_token}`,
        method: 'POST',
        body: {
          activation_token
        },
      }),
    }),
    login: builder.mutation({
      query: ({ emailOrUsername, password }) => ({
        url: 'login',
        method: 'POST',
        body: {
          emailOrUsername,
          password,
        },
        credentials: 'include',
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.activationToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.log(error);
        }
      },
    }),
    forgotPassword: builder.mutation({
      query: ({ email }) => ({
        url: 'forgot-password',
        method: 'POST',
        body: {
          email,
        },
        credentials: 'include',
      }),
    }),
    resetPassword: builder.mutation({
      query: ({ userId, token, newPassword }) => ({
        url: `reset-password?token=${token}&id=${userId}`,
        method: 'POST',
        body: {
          newPassword,
        },
        credentials: 'include',
      }),
    }),

    logout: builder.query({
      query: () => ({
        url: 'logout',
        method: 'GET',
        credentials: 'include',
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          dispatch(userLoggedOut());
        } catch (error) {
          console.log(error);
        }
      },
    }),
  }),
});

export const {
  useLogoutQuery,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useActivationMutation
} = authApi;
