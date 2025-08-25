import apiSlice from "../../app/apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: () => ({
        url: `users`,
        method: 'GET',
      }),
      providesTags: ['Users'],
    }),

    getUserById: build.query({
      query: (id) => ({
        url: `users/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    createUser: build.mutation({
      query: (body) => ({
        url: `users`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Users'],
    }),

    updateUser: build.mutation({
      query: ({ id, ...body }) => ({
        url: `users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Users', id }],
    }),

    deleteUser: build.mutation({
      query: (id) => ({
        url: `users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Addresses'],
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;