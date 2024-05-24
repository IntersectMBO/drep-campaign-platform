'use client';
import { CardanoProvider } from './walletContext';
import { DRepProvider } from './drepContext';
import QueryProvider from './queryClientProvider';
import { GlobalNotificationsProvider } from './globalNotificationContext';
import { SharedProvider } from './sharedContext';

export function AppContextProvider({ children }) {
  return (
    <QueryProvider>
      <SharedProvider>
        <CardanoProvider>
          <DRepProvider>
            <GlobalNotificationsProvider>
              {children}
            </GlobalNotificationsProvider>
          </DRepProvider>
        </CardanoProvider>
      </SharedProvider>
    </QueryProvider>
  );
}
