import React, { useState, useEffect } from 'react';
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import { useWeb3React } from '@web3-react/core'
import { Modal } from '@material-ui/core';
import Button from '@material-ui/core/button';
import { makeStyles } from '@material-ui/core/styles';

import { connectors, connectorLocalStorageKey } from './utils/connectors'
import { useEagerConnect } from "./hooks/useEagerConnect"
import { useInactiveListener } from "./hooks/useInactiveListener"
import { useAxios } from "./hooks/useAxios";
import { getErrorMessage } from "./utils/ethereum";
import { getUser, loginUser, useAuthDispatch, useAuthState } from "./context/authContext";

import Home from './Components/home/home';
import Activity from './Components/activities/activity';

import CreateItem from './Components/create-item/create-item';
import Explore from './Components/explore/explore';
import EditProfile from './Components/edit-profile/edit-profile';
import Profile from './Components/profile/profile';

import ItemDetail from './Components/item-detail/item-detail';

import './App.css';

function App() {

  const [connectModalOpen, setConnectModalOpen] = useState(null);
  const [errorModalOpen, setErrorModalOpen] = useState(null);
  const [networkError, setNetworkError] = useState(null);

  function getModalStyle() {
    const top = 50
    const left = 50
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      width: 300,
      borderRadius: '10px',
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(3, 4, 3),
      textAlign: 'center'
    },
  }));

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  useAxios();

  const { chainId, account, library, activate, active, connector, error } = useWeb3React();
  const connectAccount = () => {
    setConnectModalOpen(true)
  }
  const connectToProvider = (connector) => {
    activate(connector)
  }

  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = React.useState()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // mount only once or face issues :P
  const [triedEager, triedEagerError] = useEagerConnect()
  const { activateError } = useInactiveListener(!triedEager || !!activatingConnector)

  // handling connection error
  if ((triedEagerError || activateError) && errorModalOpen === null) {
    const errorMsg = getErrorMessage(triedEagerError || activateError);
    setNetworkError(errorMsg);
    setErrorModalOpen(true);
  }

  const dispatch = useAuthDispatch();
  const { user, token } = useAuthState();

  const login = async () => {
    if (!account || !library) {
      console.log('not connected to wallet')
      return;
    }
    if (!user) {
      console.log('fetching user')
      await getUser(dispatch, account);
    }
    if (!user?.nonce || token) {
      console.log('nonce is invalid or already logged in')
      return;
    }
    console.log("login 2")
    loginUser(dispatch, account, user?.nonce, library.getSigner())
  }

  useEffect(() => {
    if (active && account && !user) {
      getUser(dispatch, account)
    }
  }, [active, account])

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact render={(props) => (<Home {...props} user={user} connectAccount={connectAccount} />)} />
          <Route path="/home" exact render={(props) => (<Home {...props} user={user} connectAccount={connectAccount} />)} />
          <Route path="/activity" exact render={(props) => (<Activity {...props} user={user} connectAccount={connectAccount} />)} />
          <Route path="/createitem" exact render={(props) => (<CreateItem {...props} user={user} connectAccount={connectAccount} />)} />
          <Route path="/explore" exact render={(props) => (<Explore {...props} user={user} connectAccount={connectAccount} />)} />
          <Route path="/details/:tokenId" exact render={(props) => (<ItemDetail {...props} user={user} connectAccount={connectAccount} />)} />
          <Route path="/profile/:address" exact render={(props) => (<Profile {...props} getUser={getUser} user={user} login={login} connectAccount={connectAccount} />)} />
          <Route path="/editprofile" exact render={(props) => (<EditProfile {...props} getUser={getUser} user={user} login={login} connectAccount={connectAccount} />)} />
        </Switch>
      </Router>
      <Modal
        disableBackdropClick
        disableEscapeKeyDown
        open={!!errorModalOpen && !active}
        onClose={() => { setErrorModalOpen(false) }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={`${classes.paper} modal-div`}>
          <p>{networkError}</p>
          <Button className="" onClick={() => { window.location.reload() }} variant="contained" color="primary">Close</Button>
        </div>

      </Modal>
      <Modal
        disableBackdropClick
        disableEscapeKeyDown
        open={!!connectModalOpen}
        onClose={() => { setConnectModalOpen(false) }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={`${classes.paper} modal-div`}>
          <div className={`connectors-wrapper`} style={{ display: 'grid', margin: '20px' }}>
            {
              connectors.map((entry, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={() => {
                    connectToProvider(entry.connectorId);
                    window.localStorage.setItem(connectorLocalStorageKey, entry.key);
                    setConnectModalOpen(false)
                  }}
                  className="connect-button textPrimary"
                  color="primary"
                  style={{ color: 'red', marginBottom: '10px' }}
                  endIcon={<entry.icon width="30" />}
                  id={`wallet-connect-${entry.title.toLocaleLowerCase()}`}
                >
                  {entry.title}
                </Button>
              ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Button className="mt-3" onClick={() => { setConnectModalOpen(false) }} variant="contained" color="primary">Close</Button>
          </div>

        </div>
      </Modal>
    </div>
  );
}

export default App;
