import { QueryClient, QueryClientProvider } from 'react-query';

interface Props {
  children: React.ReactNode;
}

function QueryProvider(props: Props) {
  const client = new QueryClient();
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  );
}
export default QueryProvider;
