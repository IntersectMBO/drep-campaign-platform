'use client';
import { CardanoProvider } from './walletContext';
import { DRepProvider } from './drepContext';
import QueryProvider from './queryClientProvider';
import { GlobalNotificationsProvider } from './globalNotificationContext';
import { SharedProvider } from './sharedContext';

export function AppContextProvider({ children }) {
  return (
    <QueryProvider>
      <GlobalNotificationsProvider>
        <SharedProvider>
          <CardanoProvider>
            <DRepProvider>{children}</DRepProvider>
          </CardanoProvider>
        </SharedProvider>
      </GlobalNotificationsProvider>
    </QueryProvider>
  );
}
