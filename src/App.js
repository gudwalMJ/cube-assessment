import React, { useState } from "react";
import { createUseStyles } from "react-jss";
import { useWebcamCapture } from "./useWebcamCapture";
import { Link, Switch, Route, Redirect } from "react-router-dom";
// import stickers
import bravoSticker from "./stickers/bravo.png";
import confettiSticker from "./stickers/confetti.png";
import eyesSticker from "./stickers/eyes.png";
import fireSticker from "./stickers/fire.png";
import hornsSticker from "./stickers/horns.png";
import slapSticker from "./stickers/slap.png";
// import icons
import deleteIcon from "./icons/delete.png";
import downloadIcon from "./icons/download.png";

const useStyles = createUseStyles((theme) => ({
  "@global body": {
    background: theme.palette.background,
    color: theme.palette.text,
    fontFamily: "sans-serif",
  },

  App: {
    padding: "20px",
    background: theme.palette.primary,
    maxWidth: "800px",
    minHeight: "600px",
    margin: "auto",
    "& a": {
      color: theme.palette.text,
    },
  },
  Header: {
    "&  h1": {
      fontFamily: "sans-serif",
      cursor: "pointer",
      fontSize: "4rem",
    },
  },
  Main: {
    background: theme.palette.secondary,

    "& canvas": {
      width: "100%",
      height: "auto",
    },
    "& video": {
      display: "none",
    },
  },
  Stickers: {
    "& img": {
      height: "4rem",
      cursor: "pointer",
      transition: "transform 0.2s ease-in-out",
      "&:hover": {
        transform: "scale(1.1)",
      },
    },
  },
  Gallery: {
    // The gallery itself is a flex container now
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center the title and grid on the cross axis
  },
  GalleryTitle: {
    marginBottom: "20px", // Add some space below the title
    textAlign: "center",
    width: "100%", // Ensure the title stretches across the full width
    // You can add additional styling here for the title
  },
  GalleryGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "10px",
    margin: "auto",
  },
  Picture: {
    background: "white",
    padding: 4,
    position: "relative",
    display: "inline-block",
    borderRadius: "8px",
    "& img": {
      maxWidth: "100%",
      maxHeight: "300px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    "& h3": {
      padding: "4px 8px", // Adjust text padding
      textAlign: "center",
      background: "rgba(0, 0, 0, 0.5)",
      color: "white", // Optional: if you want the title text color to be white
      position: "absolute",
      bottom: "17px",
      left: "0",
      right: "0",
    },
  },
  Actions: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    paddingTop: "10px",
    marginTop: "20px",
    "& img": {
      height: "25px",
      width: "25px",
    },
  },
  ActionButton: {
    border: "1px solid #ccc",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.7,
    },
  },
}));

const defaultStickers = [
  bravoSticker,
  confettiSticker,
  eyesSticker,
  fireSticker,
  hornsSticker,
  slapSticker,
];

const stickers = defaultStickers.map((url) => {
  const img = new Image();
  /*img.onload = () => {
    console.log(`Sticker loaded: ${url}`);
  };*/
  img.src = url;
  return { img, url };
});

function App(props) {
  // css classes from JSS hook
  const classes = useStyles(props);
  // currently active sticker
  const [sticker, setSticker] = useState(stickers[0]);
  // title for the picture that will be captured
  const [title, setTitle] = useState("SLAPPE!");

  // webcam behavior hook
  const [
    handleVideoRef, // callback function to set ref for invisible video element
    handleCanvasRef, // callback function to set ref for main canvas element
    handleCapture, // callback function to trigger taking the picture
    pictures, // latest captured picture data object
    setPictures,
  ] = useWebcamCapture(sticker?.img, title);

  // To download the image
  const handleDownload = (dataUri, title) => {
    const link = document.createElement("a");
    link.download = `${title.replace(/\s+/g, "_")}.png`;
    link.href = dataUri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // To remove the picture from the gallery
  const removePicture = (indexToRemove) => {
    setPictures((currentPictures) =>
      currentPictures.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className={classes.App}>
      <header className={classes.Header}>
        <h1>SlapSticker</h1>
        <p>
          Have you ever said something so dumb, you just wanted to slap
          yourself? Well now you can! But you can also do other things!
        </p>
        <nav>
          <ul>
            <li>
              <Link to="/">home</Link>
            </li>
            <li>
              <Link to="/readme">readme</Link>
            </li>
          </ul>
        </nav>
      </header>
      <Switch>
        <Route path="/" exact>
          <main>
            <section className={classes.Gallery}>
              Step one: Give it a name
              <input
                type="text"
                value={title}
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </section>
            <section className={classes.Stickers}>
              Step 2: select your sticker...
              {stickers.map((stickerItem, index) => (
                <button key={index} onClick={() => setSticker(stickerItem)}>
                  <img src={stickerItem.url} alt={`Sticker ${index}`} />
                </button>
              ))}
            </section>
            <section className={classes.Main}>
              Step three: Slap yourself!
              <video ref={handleVideoRef} />
              <canvas
                ref={handleCanvasRef}
                width={2}
                height={2}
                onClick={handleCapture}
              />
            </section>
            <section className={classes.Gallery}>
              <h2 className={classes.GalleryTitle}>
                Step 4: Cherish this moment forever
              </h2>
              <div className={classes.GalleryGrid}>
                {pictures.map((picture, index) => (
                  <div key={index} className={classes.Picture}>
                    <img
                      src={picture.dataUri}
                      alt={`Captured moment ${index}`}
                    />
                    <h3>{picture.title}</h3>
                    <div className={classes.Actions}>
                      <img
                        src={downloadIcon}
                        className={classes.ActionButton}
                        alt="Download"
                        onClick={() =>
                          handleDownload(picture.dataUri, picture.title)
                        }
                      />
                      <img
                        src={deleteIcon}
                        className={classes.ActionButton}
                        alt="Delete"
                        onClick={() => removePicture(index)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </main>
        </Route>
        /** * Readme route */
        <Route path="/readme">
          <main>
            <h2>Devtest Readme</h2>
            <p>
              Hello candidate, Welcome to our little dev test. The goal of this
              exercise, is to asses your general skill level, and give us
              something to talk about at our next appointment.
            </p>
            <section>
              <h3>What this app should do</h3>
              <p>
                SlapSticker is an app that lets users to slap stickers on their
                face, using their webcam. Functionality wise the app works, but
                the ui needs some love. We'd like for you to extend this
                prototype to make it look and feel it bit better.
              </p>
              <p>These are the basic requirements:</p>
              <ul>
                <li>User can pick a sticker</li>
                <li>User can give the captured image a title</li>
                <li>User can place the sticker over the webcam image</li>
                <li>User can capture the webcam image with sticker</li>
              </ul>
            </section>
            <section>
              <h3>What we want you to do</h3>
              <p>
                Off course we didn't expect you to build a full fledged app in
                such a short time frame. That's why the basic requirements are
                already implemented.
              </p>
              <p>
                However, we would like for you to show off your strengths as a
                developer by improving the app.
              </p>
              <p>Some ideas (no need to do all):</p>
              <ul>
                <li>Make it look really nice</li>
                <li>Let users pick from multiple (custom) stickers</li>
                <li>Improve the workflow and ux</li>
                <li>Show multiple captured images in a gallery</li>
                <li>Let users download or share the captured pics</li>
                <li>Add super cool effects to webcam feed</li>
                <li>Organize, document and test the code</li>
                <li>Integrate with zoom, teams, meet...</li>
              </ul>
            </section>
            <section>
              <h3> quickstart</h3>
              <ul>
                <li>You can clone this repo to get started </li>
                <li>run `$ npm install` to install deps</li>
                <li>run `$ npm run start` to start dev environment</li>
                <li>push it to github or gitlab to share it with us. </li>
              </ul>
            </section>
            <section>
              <p>
                P.s. We've already added some libraries to make your life easier
                (Create React App, Jss, React Router), but feel free to add
                more.
              </p>
            </section>
          </main>
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
