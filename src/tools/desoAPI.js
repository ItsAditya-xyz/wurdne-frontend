import axios from "axios";

const DEFAULT_NODE_URL = "https://love4src.com/api";
//const DEFAULT_NODE_URL = "https://api.desodev.com/api"
let client = null;
let Wurdneclient = null;

class DesoApi {
  constructor() {
    this.client = null;
    this.baseUrl = DEFAULT_NODE_URL;
  }

  async getBlogsByPublicKey(publicKey){
    const path = "/get-user-posts"
    const data = {
      publicKey: publicKey
    }
    try {
      const result = await this.getWurdneBackendClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async submitBlog(publicKey, blogTitle, postHashHex, blogTags, timestampNanos, jwtToken){
    const path = "/submit-post"
    const data = {
      publicKey: publicKey,
      blogTitle: blogTitle,
      postHashHex: postHashHex,
      blogTags: blogTags,
      timestampNanos: timestampNanos,
      jwtToken: jwtToken
    }
    try {
      const result = await this.getWurdneBackendClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
  async submitTransaction(signedTransactionHex) {
    if (!signedTransactionHex) {
      console.log("signedTransactionHex is required");
      return;
    }

    const path = "/v0/submit-transaction";
    const data = {
      TransactionHex: signedTransactionHex,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }


  async getProfilesPartialMatch(partialName) {
    if (!partialName) {
      console.log("partialName is required");
      return;
    }

    const path = "/v0/get-profiles";
    const data = {
      ReaderPublicKeyBase58Check: "",
      UsernamePrefix: partialName,
    };
    try {
      const result = await this.getClient().post(path, data);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getClient() {
    client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return client;
  }
  async uploadImage(file, publicKey, JwtToken) {
    if (!publicKey) {
      alert(" logged in public key not found");
    }
    const path = "/v0/upload-image";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("UserPublicKeyBase58Check", publicKey);
    formData.append("JWT", JwtToken);
    //content type multipart/form-data
    try {
      const result = await this.getUploadClient().post(path, formData);
      return result.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  getUploadClient() {
    if (client) return client;
    client = axios.create({
      baseURL: "https://node.deso.org/api",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
    });
    return client;
  }

  getWurdneBackendClient() {
    if (Wurdneclient) return Wurdneclient;
    Wurdneclient = axios.create({
      baseURL: "https://wurdne.cordify.app",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return Wurdneclient;
  }
}

export default DesoApi;
