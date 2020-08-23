import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, withRouter, Route, Redirect, Link, Switch } from "react-router-dom";

import axios from 'redaxios';
import firebase from './firebase/firebase'
import auth from './firebase/auth';

import { useAppState, useAuthState } from './AppContext'
import { AppProvider, AuthProvider } from './AppContext'

const Profile = () => <b>hi</b>

const SignUp = withRouter(({ history }) => {
  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [userName, setUserName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [runSignUp, setRunSignUp] = useState(false);

  useEffect(() => {
    const runReq = async () => {
      if (runSignUp) {
        try {
          let data = { firstName, lastName, userName, email, password };
          await auth.signUp(data)
          console.log('success signing up')
          history.push('/')
        } catch (error) {
          console.log(error);
        }
      }
    }
    runReq();
  }, [runSignUp])

  const onSubmit = e => {
    e.preventDefault();
  }

  return (
    <div class="wrapper">
    <div class="login">    
      <h1>SIGNUP</h1>
      <form class="" onSubmit={onSubmit}>
        <input type="text" placeholder="first name" value={firstName}
          onInput={(e) => setFirstName(e.target.value)} />
        <input type="text" placeholder="last name" value={lastName}
          onInput={(e) => setLastName(e.target.value)} />
        <input type="text" placeholder="username" value={userName}
          onInput={(e) => setUserName(e.target.value)} />
        <input type="text" placeholder="email" value={email}
          onInput={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password}
          onInput={(e) => setPassword(e.target.value)} />

        <button class={runSignUp && ''}
          onClick={() => setRunSignUp(true)}
          type="submit">Submit</button>
      </form>
    </div>
    </div>
  );
})

const SignIn = withRouter(({ history }) => {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [runSignIn, setRunSignIn] = useState(null);

  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    const runReq = async () => {
      if (runSignIn) {
        try {
          let data = { email, password };
          await auth.signIn(data);
          console.log('sucess signing in');
          history.push('/')
        } catch (error) {
          console.log(error);
        }
      }
    }
    runReq();
  }, [runSignIn])

  const onSubmit = e => {
    e.preventDefault();
    setRunSignIn(true);
  }

  return (
    <div class={''}>
      <h1>SIGNUP</h1>
      <form class={''} onSubmit={onSubmit}>
        <input type="text" placeholder="email" value={email}
          onInput={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" value={password}
          onInput={(e) => setPassword(e.target.value)} />
        <button class={btnDisabled && ''} type="submit">Submit</button>
      </form>
    </div>
  );

})

const Routes = () => (
  <Router>
    <Switch>
      <Route exact path="/signin" render={() => <SignIn />} />
      <Route exact path="/signup" render={() => <SignUp />} />
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
