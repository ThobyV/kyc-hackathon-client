import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, withRouter, Route, Redirect, Link, Switch } from "react-router-dom";

import axios from 'redaxios';
import firebase from './firebase/firebase'
import auth from './firebase/auth';

import { useAppState, AppProvider } from './AppContext'

const Profile = () => <b>hi</b>

const SignUp = withRouter(({ history }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [runSignUp, setRunSignUp] = useState(false);

  const [, dispatch] = useAppState();  
  

  useEffect(() => {
    const runReq = async () => {
      if (runSignUp) {
        try {
          let data = { firstName, lastName, userName, email, password };
          let userProfile = await auth.signUp(data)
          console.log(userProfile);
          console.log('success signing up')
          dispatch({
            action:'SET_AUTH_USER',
            payload: userProfile, 
          })
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
    setRunSignUp(true);
  }

  return (
    <div className="wrapper">
      <div className="flex-auth">
        <h1>Welcome back</h1>
        <h1 className="pad-t">Please Sign in</h1>        
        <form onSubmit={onSubmit}>
          <input type="text" placeholder="first name" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} />
          <input type="text" placeholder="last name" value={lastName}
            onChange={(e) => setLastName(e.target.value)} />
          <input type="text" placeholder="username" value={userName}
            onChange={(e) => setUserName(e.target.value)} />
          <input type="text" placeholder="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password}
            onChange={(e) => setPassword(e.target.value)} />

          <button className=""
            type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
})

const SignIn = withRouter(({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [runSignIn, setRunSignIn] = useState(false);

  const [btnDisabled, setBtnDisabled] = useState(false);

  const [, dispatch] = useAppState();

  useEffect(() => {
    const runReq = async () => {
      if (runSignIn) {
        try {
          let data = { email, password };
          let userProfile = await auth.signIn(data);
          console.log('sucess signing in');
          dispatch({
            action:'SET_AUTH_USER',
            payload: userProfile, 
          })
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
    <div className="wrapper">
      <div className="flex-auth">
        <h1>Sign In</h1>
        <h1 className="pad-t">Please Sign in</h1>    
        <form className={''} onSubmit={onSubmit}>
          <input type="text" placeholder="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button className="" type="submit">Submit</button>
        </form>
      </div>
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
  const [{userProfile}] = useAppState();
  return (
    <Route
      {...rest}
      render={props =>
        (
          userProfile ? (
            <Component {...props} />
          ) : (
              <Redirect to={{
                pathname: "/signin",
                state: {
                  from: props.location,
                }
              }} />
            )
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
