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
      .save(`${localProcessedVideoPath}/${processedVideoName}`);
    }) 
}

export async function downloadRawVideo(fileName: string) {

  await storage.bucket(rawVideoBucketName)
  .file(fileName)
  .download({ destination:`${localRawVideoPath}/${fileName}`});

  console.log(`gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}.`);
}

export async function uploadProcessedVideo(fileName: string) {
  const bucket = storage.bucket(processedVideoBucketName);
  
  await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
    destination: fileName
  });

  console.log(`gs://${localProcessedVideoPath}/${fileName} uploaded to ${processedVideoBucketName}/${fileName}.`);

  await bucket.file(fileName).makePublic();
  
}

function deleteFile(filePath: string): Promise<void> {
  return new Promise((resolve,reject)=> {
    if(fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if(err) {
          console.log(`Failed to delete file at ${filePath}`);
          console.log(JSON.stringify(err));
          reject(err);
        } else {
          console.log(`File deleted at ${filePath}`);
        }
      })
    } else {
      console.log(`File was not found at ${filePath}, skipping the  delete`);
      resolve();
    }
  });
}