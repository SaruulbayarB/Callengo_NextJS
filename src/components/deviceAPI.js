import axios from "axios";
import qs from "qs";

const API_URL = "https://www.svnwi.com/api/external/v1";
// "https://www.svnwi.com/zycommoninfodeal/thirdPartyHttpHk/thirdpartyhttpcontrol.php";

export async function sendDeviceCommand({
  deviceuid,
  cmdtype,
  cmdparam,
  channelnum,
  controlnum,
}) {
  try {
    const postData = qs.stringify({
      deviceuid,
      cmdtype,
      cmdparam,
      channelnum,
      controlnum,
    });

    const response = await axios.post(API_URL, postData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (response.data.startsWith("fail:")) {
      throw new Error(response.data);
    }

    return response.data;
  } catch (error) {
    console.error("Device API error:", error.message);
    return null;
  }
}
