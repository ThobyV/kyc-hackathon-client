import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, withRouter, Route, Redirect, Link, Switch } from "react-router-dom";
import axios from 'redaxios';
import firebase from './Firebase/firebaseConfig'

import { useAppState, useAuthState } from './AppContext'
import { AppProvider, AuthProvider } from './AppContext'

const Profile = () => <b>hi</b>

const SignUp = () => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [runAuth, setRunAuth] = useState(false);

  useEffect(() => {
    const runReq = async () => {
      if (runAuth) {
        try {
          const data = { firstName, lastName, userName, email, password };
          const authToken = await axios.post(`${baseUrl}/admin/signup`,
            data,
            defaultHeaders,
          )
        } catch (error) {
          console.log(error);
        }
      }
    }
    runReq();
  }, [runAuth])

  const onSubmit = e => {
    e.preventDefault();
  }

  return (
    <div class={style.wrapper}>
      <h1>SIGNUP</h1>
      <form class={style.form} onSubmit={onSubmit}>
        <input type="text" placeholder="fullname" value={displayName}
          onInput={(e) => setDisplayName(e.target.value)} />
        <input type="text" placeholder="email" value={email}
          onInput={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password}
          onInput={(e) => setPassword(e.target.value)} />
        <input type="text" placeholder="adminCode: 1" value={adminCode}
          onInput={(e) => setAdminCode(e.target.value)} />
        <button class={runAuth && style.disabled}
          onClick={() => setRunAuth(true)}
          type="submit">Submit</button>
      </form>
    </div>
  );
}

const SignIn = () => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    if (authToken) {
      window.localStorage.setItem('uid', authToken)
      route('/dashboard', true);
    }
  }, [authToken])

  const onSubmit = e => {
    e.preventDefault();
    setAuthToken('fssssss');
  }

  return (
    <div class={style.wrapper}>
      <h1>SIGNUP</h1>
      <form class={style.form} onSubmit={onSubmit}>
        <input type="text" placeholder="email" value={email}
          onInput={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password}
          onInput={(e) => setPassword(e.target.value)} />
        <button class={btnDisabled && style.disabled} type="submit">Submit</button>
      </form>
    </div>
  );

}

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/signin" render={() => <SignIn />} />
      <PrivateRoute
        exact
        path="/"
        component={Profile}
      />
    </Switch>
  </Router>
)

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [authUser, initializing] = useAuthState();
  return (
    <Route
      {...rest}
      render={props =>
        !initializing ? (
          authUser.uid ? (
            <Component {...props} />
          ) : (
              <Redirect to={{
                pathname: "/signin",
                state: {
                  from: props.location,
                }
              }} />
            )
        ) : (
            <b>loading...</b>
          )
      }
    />
  );
}


const App = () => (
  <AppProvider>
    <Routes />
  </AppProvider>
);

export default App;
