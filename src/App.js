import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, withRouter, Route, Redirect, Link, Switch } from "react-router-dom";

import axios from 'redaxios';
import firebase from './firebase/firebase'
import auth from './firebase/auth';
import { authHeaders, baseUrl } from './api'

import { useAppState, AppProvider } from './AppContext'

import photo from './photo.svg'
import link from './link.svg'
import building from './building.svg'
import idcard from './idcard.svg'

let useConsole = (state) => {
  useEffect(() => {
    console.log(state)
  }, [state]);
}


const authenticateUser = async (data, authRoute) => {
  try {
    let customToken = await auth.requestCustomToken(data, authRoute);
    await auth.signInWithCustomToken(customToken.data);
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
    console.log(error);
  }
}

const getUser = async (token, data) => {
  try {
    let profile = await axios.get(`${baseUrl}/profile/${data.uid}`,
      authHeaders(token),
    )
    return Promise.resolve(profile);
  } catch (error) {
    return Promise.reject(error);
  }
}


const Modal = ({ children, show, handleModal }) => {
  const showVal = show ? "display" : "hidden";

  return (
    <div className={`modal ${showVal}`}>
      <div className={`modalBody scale-in-center`}>
        <span className={`close right`} onClick={() => handleModal()}>&times;</span>
        {children}
      </div>
    </div>
  )
}


const VerifyBVNForm = withRouter(({ handleModal, history }) => {
  const [bankVerificationNumber, setBankVerificationNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [loading, setLoading] = useState(false);

  const [state, dispatch] = useAppState();

  useEffect(() => {
    const runReq = async () => {
      try {
        if (loading) {
          const data = { bankVerificationNumber, dateOfBirth }
          let token = state.idToken;
          console.log(data);
          const retrievedData = await axios.post(`${baseUrl}/verifybvn`,
            data,
            authHeaders(token),
          )
          if (retrievedData.valid) {
            dispatch({
              type: "SET_BVN_DETAILS",
              payload: retrievedData,
            })
            history.push('/verifyotp');
          }
          handleModal();
        }
      } catch (error) {
        setLoading(false);
        console.log(error)
      }
    }
    runReq();
  }, [loading])

  useConsole(state);

  const onSubmit = e => {
    e.preventDefault();
    setLoading(true);
  }


  return (
    <>
      <div className="flex-auth">
        <h1>BVN Verification</h1>
      </div>
      <form onSubmit={onSubmit}>
        <h6>BVN Number</h6>
        <input className="full-input" type="text" placeholder="bvn"
          value={bankVerificationNumber}
          onChange={(e) => setBankVerificationNumber(e.target.value)} />

        <h6>Date Of Birth</h6>
        <input className="full-input" type="text" placeholder="date of birth" value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)} />
        <button className={''}
          type="submit">Submit</button>
      </form>
    </>
  );
})

const VerifyOTP = withRouter(({ history }) => {
  const [OTP, setOTP] = useState(null);
  const [runOTP, setRunOTP] = useState(null);

  const [state, dispatch] = useAppState();

  useEffect(() => {
    const runReq = async () => {
      if (runOTP) {
        try {
          //auth.phoneAuthTriggger()
          const data = { uid: state.userProfile.uid, bvnData: state.bvnData }
          let token = state.idToken;
          const retrievedData = await axios.post(`${baseUrl}/updatebvn`,
            data,
            authHeaders(token),
          )
          dispatch({
            type: 'SET_USER_PROFILE',
            payload: { ...state.bvnData },
          })
          history.push('/');
        } catch (error) {
          setRunOTP(false)
          console.log(error)
        }
      }
    }
    runReq();
  }, [runOTP])

  useConsole(state)

  const onSubmit = e => {
    e.preventDefault();
    setRunOTP(true);
  }

  return (
    <div className="wrapper">
      <div className="flex-auth">
        <p className="pad-t center bold">Verify your OTP</p>
        <form className={''} onSubmit={onSubmit}>
          <input type="text" placeholder="email" value={OTP}
            onChange={(e) => setOTP(e.target.value)} />
          <button className="" type="submit">Verify</button>
        </form>
      </div>
    </div >
  );

})


const Profile = () => {
  const [state, dispatch] = useAppState();
  const [loading, setLoading] = useState(true);
  const [local, setLocal] = useState(null);

  const [mobileSideNav, setMobileSideNav] = useState(false);
  const [show, setShow] = useState(false);


  const toggleSideNav = (value) => {
    setMobileSideNav(value);
  }

  const handleModal = () => {
    setShow(!show);
  }

  useEffect(() => {
    if (loading) {
      const runReq = async () => {
        let token = state.idToken;
        let profile = await getUser(token, { uid: state.userProfile.uid });
        dispatch({
          type: 'SET_USER_PROFILE',
          payload: profile.data,
        })
        setLocal(profile);
        setLoading(false);
      }
      runReq()
    }
  }, [loading])

  useConsole(local);

  return (
    <>
      {loading && 'loading'}
      {
        !loading &&
        <>
          <div className="content">

            <div className={`sidenav ${mobileSideNav ? "mobile" : "hide"}`}>
              <span className="mobileBtn" onClick={() => toggleSideNav(!mobileSideNav)}>&#9776; open</span>
              <p className="closebtn" onClick={() => toggleSideNav(false)}>&times;</p>
              <a href="#">dashboard</a>
              <a href="#">profile</a>
            </div>


            <div className="flex-blue">
              <div className="col1">
                <p className="pad-b"> KYC </p>
                <div className="flex">
                  <div>
                    <p className="pad-r"> profile </p>
                  </div>
                  <div>
                    <p> kyc </p>
                  </div>
                </div>
              </div>
              <div className="col1">
                <img src={photo} />
              </div>
            </div>

            <div className="profile-details">
              <div className="col1">
                <img width="50px" height="50px" className="pad-b" src={photo} />
              </div>
              <div className="col1">
                <p className="pad-b"> {state.userProfile.userName} </p>
                <p className="pad-b"> {`${state.userProfile.firstName} ${state.userProfile.lastName} `} </p>
                <div className="flex">
                  <div>
                    <p className="pad-r"> {state.userProfile.email} </p>
                  </div>
                  <div>
                    <button className="pad-r"> KYC LV 0 </button>
                  </div>
                  <div>
                    <p> upgrade to level 1 </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="wrapper-2">
              <div className="contain-home">
                <img width="50px" height="50px" className="pad-b" src={photo} />

                <p className="pad-b"> complete steps below to get verified </p>

                <div className="flex-home">
                  <img width="50px" height="50px" className="pad-b" src={building} />
                  <div className="pad-r">
                    <p> BVN verification </p>
                  </div>
                  <div className="pad-r">
                    <img width="50px" height="50px" className="pad-b" src={idcard} />

                    <p> KYC LV 0 </p>
                  </div>
                  <div className="pad-b">
                    <img width="50px" height="50px" className="pad-b" src={link} />
                    <p> upgrade to level 1 </p>
                  </div>
                  <div className="container">
                    <Modal show={show} handleModal={handleModal}>
                      <VerifyBVNForm handleModal={handleModal} />
                    </Modal>
                  </div>
                </div>
                <div className="flex-home-btn">
                  <button onClick={handleModal}>Begin verification</button>
                </div>
              </div>
            </div>
          </div>


        </>
      }
    </>
  )
}

const SignUp = withRouter(({ history }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [runSignUp, setRunSignUp] = useState(false);

  const [state, dispatch] = useAppState();

  useEffect(() => {
    const runReq = async () => {
      try {
        if (runSignUp) {
          let data = { firstName, lastName, userName, email, password };
          await authenticateUser(data, 'signup');
          history.push('/');
        }
      } catch (error) {
        setRunSignUp(false);
        console.log(error)
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
        <h1>Hackathon</h1>
        <p className="pad-t">Create your Hackathon account</p>
        <form onSubmit={onSubmit}>
          <div className="flex">
            <div>
              <input type="text" placeholder="first name" value={firstName}
                onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <input type="text" placeholder="last name" value={lastName}
                onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <input type="text" placeholder="username" value={userName}
            onChange={(e) => setUserName(e.target.value)} />
          <div className="flex">
            <div>
              <input type="text" placeholder="email" value={email}
                onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <input type="password" placeholder="password" value={password}
                onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          <button className="" type="submit">Submit</button>
        </form >
      </div >
    </div >
  );
})

const SignIn = withRouter(({ history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [runSignIn, setRunSignIn] = useState(false);

  const [btnDisabled, setBtnDisabled] = useState(false);

  const [state, dispatch] = useAppState();

  useEffect(() => {
    const runReq = async () => {
      if (runSignIn) {
        try {
          let data = { email, password };
          await authenticateUser(data, 'signin');
          history.push('/');
        } catch (error) {
          setRunSignIn(false)
          console.log(error)
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
        <p className="center bold">Welcome Back</p>
        <p className="pad-t center">Please Sign in</p>
        <form className={''} onSubmit={onSubmit}>
          <input type="text" placeholder="email" value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="password" value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button className="" type="submit">Sign in</button>
          <div className="flex">
            <div>
              <Link to="/signup">
                <p className="bold flex-pad-t">forgot password?</p>
              </Link>
            </div>
            <div>
              <p className="bold flex-pad-t">New here?</p>
              <Link to="/signup">
                <p className="bold flex-pad-t">signup</p>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div >
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
      <PrivateRoute
        exact
        path="/verifyotp"
        component={VerifyOTP}
      />
    </Switch>
  </Router>
)

const PrivateRoute = ({ component: Component, ...rest }) => {
  const [{ userProfile }] = useAppState();
  return (
    <Route
      {...rest}
      render={props =>
        (
          userProfile.uid ? (
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
