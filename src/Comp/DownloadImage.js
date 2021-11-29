import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import html2canvas from "html2canvas";
import styles from "./Download.module.css";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import DownloadForOfflineIcon from "@mui/icons-material/DownloadForOffline";
import TextField from "@mui/material/TextField";


export default function DownloadImage({ topTracks, playlistData }) {
  useEffect(() => {}, [topTracks]);
  console.log(playlistData);

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
            {topTracks.map((track, index) => {
              return (
                <div className={styles.list}>
                  <AudiotrackIcon />
                  {track.name}
                </div>
              );
            })}
            <br />
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
            <div className={styles.player}>
              <SkipPreviousIcon sx={{ height: 38, width: 38 }} />
              <PlayArrowIcon sx={{ height: 80, width: 80 }} />
              <SkipNextIcon sx={{ height: 38, width: 38 }} />
            </div>
          </div>
          <br />
        </div>
      </div>
      <div className={styles.download}>
        <TextField variant="outlined" style={{color:"white !important", marginBottom: "10px"}} value={playlistData?.external_urls?.spotify} />
        <Button
          className={styles.button}
          variant="contained"
          onClick={exportAsPicture}
          endIcon={<DownloadForOfflineIcon />}
        >
          download
        </Button>
      </div>
    </div>
  );
}
