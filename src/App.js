import React from "react";
import SigmaSnackbarProvider from "./components/Snackbar/SigmaSnackbarProvider";
import SigmaOnboardProvider from "./context/WalletConnector/SigmaOnboardProvider";
import Transact from "./pages/Transact";

function App() {
  return (
    <SigmaOnboardProvider>
      <SigmaSnackbarProvider>
        <Transact />
      </SigmaSnackbarProvider>
    </SigmaOnboardProvider>
  );
}

export default App;
