import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import html2canvas from "html2canvas";
import styles from "./Download.module.css";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import HeadphonesIcon from "@mui/icons-material/Headphones";

export default function DownloadImage({ topTracks, playlistData }) {
  useEffect(() => {}, [topTracks]);

  //export as picture
  const exportAsPicture = () => {
    var html = document.getElementsByTagName("HTML")[0];
    var body = document.getElementsByTagName("BODY")[0];
    var htmlWidth = html.clientWidth;
    var bodyWidth = body.clientWidth;

    var data = document.getElementById("exportContainer");
    var newWidth = data.scrollWidth - data.clientWidth;

    if (newWidth > data.clientWidth) {
      htmlWidth += newWidth;
      bodyWidth += newWidth;
    }

    html.style.width = htmlWidth + "px";
    body.style.width = bodyWidth + "px";

    html2canvas(data)
      .then((canvas) => {
        var image = canvas.toDataURL("image/png", 1.0);
        return image;
      })
      .then((image) => {
        saveAs(image, "exported-vis.png");
        html.style.width = null;
        body.style.width = null;
      });
  };

  // download Image
  const saveAs = (blob, fileName) => {
    var elem = window.document.createElement("a");
    elem.href = blob;
    elem.download = fileName;
    elem.style = "display:none;";
    (document.body || document.documentElement).appendChild(elem);
    if (typeof elem.click === "function") {
      elem.click();
    } else {
      elem.target = "_blank";
      elem.dispatchEvent(
        new MouseEvent("click", {
          view: window,
          bubbles: true,
          cancelable: true,
        })
      );
    }
    URL.revokeObjectURL(elem.href);
    elem.remove();
  };

  return (
    <div>
      <div className="parent">
        <div className={styles.exportC} id="exportContainer">
          <div className={styles.content}>
            <span className={styles.header}>
              My Top &nbsp; <HeadphonesIcon /> &nbsp; Spotify :
            </span>

            {topTracks.map((track, index) => {
              return (
                <div className={styles.list}>
                  <AudiotrackIcon />
                  {track.name}
                </div>
              );
            })}
          </div>
          <br/>
        </div>
      </div>
      <br />
      <br />
      <Button variant="contained" onClick={exportAsPicture}>
        screenshot
      </Button>
    </div>
  );
}
