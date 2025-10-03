'use client';

import { ApolloProvider } from "@apollo/client/react";
import client from '../lib/apolloClient';

export default function ApolloClientProvider({ children }) {
  return (
    <ApolloProvider client={client}>
        {children}
    </ApolloProvider>
  );
}
