import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';       // Creates an API slice that handles API requests.   //Simplifies API calls by automatically attaching headers, base URLs, and handling requests.

export const authAPI = createApi({              //Defines the authentication API.
  reducerPath: 'auth', // This key is used in store
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/api' }),                    //Every request will be appended to this base URL.
  endpoints: (builder) => ({
    register: builder.mutation({                              //The endpoints function defines the API requests for registering and logging in users.      //Creates a mutation endpoint for user registration                 
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authAPI;
