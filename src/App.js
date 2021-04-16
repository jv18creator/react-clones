import React, { useEffect, useState } from "react";
import "./App.css";
import Post from "./Post";
import { db, auth } from "./firebase";
import { Button, Input, makeStyles, Modal } from "@material-ui/core";
import ImageUpload from "./ImageUpload";

//from Material UI
//Modal is from Material UI

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    minWidth: 350,
    maxWidth: 500,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const [modalStyle] = React.useState(getModalStyle);
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = React.useState(false);
  //is equal to useState(false)
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);

  useEffect(() => {
    const unsubcribe = auth.onAuthStateChanged((authUser) => {
      //This onAuthStateChanged keeps user logged in if they login
      if (authUser) {
        //user hass logged in
        //console.log(authUser);
        setUser(authUser);

        if (authUser.displayName) {
          //don't update username
        } else {
          //if user just created account
          return authUser.updateProfile({
            displayName: username,
          });
        }
      } else {
        //user has logged out
        setUser(null);
      }
    });

    return () => {
      unsubcribe();
    };
  }, [user, username]);

  const signUp = (e) => {
    //  window.location.reload(false);
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      //don't have to use .then because we're doing the exact same thing above in conditional
      //statement, both are true

      .catch((error) => alert(error.message));
    // <div>login</div>
    setOpen(false);
  };

  const signIn = (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message));

    setOpenSignIn(false);
  };

  useEffect(() => {
    db.collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snaps) => {
        //every time a new post is added, this code fires
        setPosts(
          snaps.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }))
        );
      });
  }, []);

  return (
    <div className="App">
      <nav className="app__header">
        <h1>
          <i>LOGO</i>
        </h1>

        <Modal open={open} onClose={() => setOpen(false)}>
          <div style={modalStyle} className={classes.paper}>
            <h1>
              <i> LOGO</i>
            </h1>
            <form className="app__signup">
              <Input
                placeholder="Username"
                required
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                placeholder="Email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signUp}>
                Sign Up
              </Button>
            </form>
          </div>
        </Modal>
        {/* for sign In */}
        <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
          <div style={modalStyle} className={classes.paper}>
            <h1>
              <i> LOGO</i>
            </h1>
            <form className="app__signup">
              <Input
                placeholder="Email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                placeholder="Password"
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit" onClick={signIn}>
                Sign In
              </Button>
            </form>
          </div>
        </Modal>

        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
          <div className="app__logincontainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )}
      </nav>

      {user ? (
        <p className="app__userCard">Hi, {user.displayName}</p>
      ) : (
        <span></span>
      )}
      <section className="app__mainContent">
        {/* Below code iss checking if the user is logged in or not */}
        {user?.displayName ? (
          <ImageUpload username={user.displayName} />
        ) : (
          <h3>Login to Upload</h3>
        )}

        {posts.map(({ id, post }) => (
          <Post
            key={id}
            postId={id}
            user={user}
            username={post.username}
            caption={post.caption}
            imgUrl={post.imgUrl}
          />
          //whenever a post is added react will on rebder the key(post) and will not re-render
          //everything
        ))}

        {/* <Post username="randomeUser" caption="some random caption" imgUrl="https://images.unsplash.com/photo-1542293787938-c9e299b880cc?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxleHBsb3JlLWZlZWR8N3x8fGVufDB8fHw%3D&auto=format&fit=crop&w=600&q=60" />
      <Post username="jeet viramgama"/>
    <Post /> */}
      </section>
    </div>
  );
}

export default App;
