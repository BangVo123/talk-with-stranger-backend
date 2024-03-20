"use strict";

const {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} = require("firebase/storage");
const {
  BadRequestError,
  NotFoundError,
  InternalServerError,
} = require("../core/error.response");
const db = require("../db/init.mysql");
const { storage } = require("../firebase");

class UploadService {
  static uploadOne = async ({ file, folderName, fileName }) => {
    const storageRef = ref(storage, `${folderName}/${fileName}`);
    const metadata = {
      contentType: file.mimeType,
    };
    const snapshot = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata
    );
    const url = await getDownloadURL(snapshot.ref);

    return url;
  };
}

module.exports = UploadService;
