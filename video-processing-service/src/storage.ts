// local and GCS File interactions
import { Storage } from "@google-cloud/storage";
import fs from 'fs';
import ffmpeg from "fluent-ffmpeg";

const storage = new Storage();
const rawVideoBucketName = "archi-raw-yt-videos";
const processedVideoBucketName = "archi-processed-yt-videos";
const localRawVideoPath = "./raw-videos"
const localProcessedVideoPath = "./processed-videos"

// create local directories
export function setupDirectories() {

}

export function convertVideo(rawVideoName: string, processedVideoName: string) {
    return new Promise<void>((resolve, reject) => {
      ffmpeg(`${localRawVideoPath}/${rawVideoName}`).
      outputOptions("-vf","scale=-1:360")
      .on("End",() => {
        console.log("video processed");
        resolve();
      })
      .on("error",(err)=>{
        console.log(`An error occured: ${err.message}`);
        reject(err);
      })
      .save(`${localProcessedVideoPath}`/${processedVideoName});
    }) 
}