import apiSlice from "../../app/apiSlice";

export const addressesApi = apiSlice.injectEndpoints({
  endpoints: (build) => ({
    getAllAddresses: build.query({
      query: () => ({
        url: `addresses`,
        method: 'GET',
      }),
      providesTags: ['Addresses'],
    }),

    getAddressById: build.query({
      query: (id) => ({
        url: `addresses/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Addresses', id }],
    }),

    createAddress: build.mutation({
      query: (body) => ({
        url: `addresses`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Addresses'],
    }),

    updateAddress: build.mutation({
      query: ({ id, ...body }) => ({
        url: `addresses/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Addresses', id }],
    }),

    deleteAddress: build.mutation({
      query: (id) => ({
        url: `addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Addresses'],
    }),
  }),
});

export const {
  useGetAllAddressesQuery,
  useGetAddressByIdQuery,
  useCreateAddressMutation,
  useUpdateAddressMutation,
  useDeleteAddressMutation,
} = addressesApi;