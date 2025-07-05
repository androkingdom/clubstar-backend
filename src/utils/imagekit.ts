import ImageKit from "imagekit";
import envConfig from "../config/env";

const imagekit = new ImageKit({
  publicKey: envConfig.IMAGEKIT_PUBLIC_KEY,
  privateKey: envConfig.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: "https://ik.imagekit.io/andro",
});

export default imagekit;
