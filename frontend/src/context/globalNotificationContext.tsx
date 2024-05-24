import type { SnackbarOrigin } from '@mui/material/Snackbar';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Snackbar, Alert } from '@mui/material';
import { SnackbarSeverity } from '@/models/snackbar';

interface ProviderProps {
  children: React.ReactNode;
}

interface GlobalNotificationContext {
  addSuccessAlert: (message: string, autoHideDuration?: number) => void;
  addErrorAlert: (message: string, autoHideDuration?: number) => void;
  addWarningAlert: (message: string, autoHideDuration?: number) => void;
  addChangesSavedAlert: () => void;
}

interface GlobalMessage {
  key: number;
  message: string;
  severity: SnackbarSeverity;
  autoHideDuration: number;
}

interface State {
  open: boolean;
  messageInfo?: GlobalMessage;
}

const GlobalNotificationContext = createContext<GlobalNotificationContext>({} as GlobalNotificationContext);
GlobalNotificationContext.displayName = 'GlobalNotificationContext';

const DEFAULT_AUTO_HIDE_DURATION = 2000;
const defaultState: State = {
  open: false,
  messageInfo: undefined,
};
const defaultPosition = {
  vertical: 'bottom',
  horizontal: 'center',
} as SnackbarOrigin;

function GlobalNotificationsProvider({ children }: ProviderProps) {
  const [notifsPack, setNotifsPack] = useState<readonly GlobalMessage[]>([]);
  const [{ messageInfo, open }, setState] = useState(defaultState);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 600);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const addWarningAlert = useCallback(
    (message: string, autoHideDuration = DEFAULT_AUTO_HIDE_DURATION) =>
      setNotifsPack((prev) => [
        ...prev,
        {
          message,
          autoHideDuration,
          severity: 'warning',
          key: new Date().getTime(),
        },
      ]),
    [],
  );

  const addSuccessAlert = useCallback(
    (message: string, autoHideDuration = DEFAULT_AUTO_HIDE_DURATION) =>
      setNotifsPack((prev) => [
        ...prev,
        {
          message,
          autoHideDuration,
          severity: 'success',
          key: new Date().getTime(),
        },
      ]),
    [],
  );

  const addErrorAlert = useCallback(
    (message: string, autoHideDuration = DEFAULT_AUTO_HIDE_DURATION) =>
      setNotifsPack((prev) => [
        ...prev,
        {
          message,
          autoHideDuration,
          severity: 'error',
          key: new Date().getTime(),
        },
      ]),
    [],
  );

  const addChangesSavedAlert = useCallback(
    () => addSuccessAlert('Changes Saved!'),
    [addSuccessAlert],
  );

  const value = useMemo(
    () => ({
      addSuccessAlert,
      addErrorAlert,
      addChangesSavedAlert,
      addWarningAlert,
    }),
    [addSuccessAlert, addErrorAlert, addChangesSavedAlert, addWarningAlert],
  );

  useEffect(() => {
    if (notifsPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setState({ open: true, messageInfo: notifsPack[0] });
      setNotifsPack((prev) => prev.slice(1));
    } else if (notifsPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      // setState((prev) => ({ ...prev, open: false }));
    }
  }, [notifsPack, messageInfo, open]);

  const handleClose = (
    _event: React.SyntheticEvent | Event,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setState((prev) => ({ ...prev, open: false }));
  };

  const handleExited = () => {
    setState((prev) => ({ ...prev, messageInfo: undefined }));
  };

  return (
    <GlobalNotificationContext.Provider value={value}>
      {children}
      {messageInfo && (
        <Snackbar
          key={messageInfo.key}
          open={open}
          autoHideDuration={messageInfo.autoHideDuration}
          onClose={handleClose}
          TransitionProps={{ onExited: handleExited }}
          anchorOrigin={defaultPosition}
          sx={{bottom:8}}
        >
          <Alert
            data-testid={`alert-${messageInfo.severity}`}
            onClose={handleClose}
            severity={messageInfo.severity}
            variant="filled"
            sx={{
              minWidth: isMobile ? '90%' : '30vw',
              backgroundColor:
                messageInfo.severity === 'success'
                  ? '#62BC52'
                  : messageInfo.severity === 'error'
                    ? '#FF3333'
                    : '#DEA029',
            }}
          >
            {messageInfo.message}
          </Alert>
        </Snackbar>
      )}
    </GlobalNotificationContext.Provider>
  );
}

function useGlobalNotifications() {
  const context = useContext(GlobalNotificationContext);
  if (context === undefined) {
    throw new Error('useGlobalNotifications must be used within a GlobalNotificationsProvider');
  }
  return context;
}

export { GlobalNotificationsProvider, useGlobalNotifications };
