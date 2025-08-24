import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/",
  }),
  tagTypes: [
    "Users",
    "Addresses",
  ],
  endpoints: (builder) => ({}),
});

export default apiSlice;