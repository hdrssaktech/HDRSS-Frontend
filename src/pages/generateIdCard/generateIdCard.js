// my code 
import * as Print from "expo-print";

import * as FileSystem from "expo-file-system/legacy";

import { Asset } from "expo-asset";
import { Alert } from "react-native";


export async function generateIdCard(member) {
  // Convert all assets (images + font)
  const [
    headerImage,
    signatureImage,
    sunImage,
    impactFont,
  ] = await Promise.all([
    convertAssetToBase64(require("../../../assets/idcard/nandi2.jpg")),
    convertAssetToBase64(require("../../../assets/idcard/sign.png")),
    convertAssetToBase64(require("../../../assets/idcard/logo_hdrss.png")),
    convertAssetToBase64(require("../../../assets/fonts/impact.ttf")),
  ]);
  const date = new Date();

  const monthNames = [
  "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
  "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
];

const currentMonth = monthNames[date.getMonth()];         
const currentYear = date.getFullYear();                   
const nextYear = currentYear + 1;                         

const validity = `${currentMonth} ${currentYear} - ${currentMonth} ${nextYear}`;




const profileBase64 = member.image
  ? await imageUrlToBase64(member.image)
  : null;



  const htmlContent = `
  <html>
    <head>
      <style>

        @font-face {
          font-family: 'Impact';
          src: url(${impactFont});
        }

        body {
          font-family: Arial, sans-serif;
          width: 300px;
          height: auto;
          margin: 0;
          padding: 40 100px;
          background-color: #fff;
        }

        .card {
          width: 260px;
          border: 1px solid #000;
          border-radius: 8px;
          overflow: hidden;
          margin: 10px auto;
        }

        .header {
          background-color: #A01E1E;
          color: white;
          text-align: center;
          padding-top: 10px;
          padding-bottom: 5px;
          position: relative;
        }

        .header-row {
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white;
          padding: 1px 10px;
          margin-top: -15px;
        }

        .header-row img {
          width: 300px;
          height:50px;
          object-fit: contain;
          margin-top: 10px;
        }

        .header-tamil { font-family: 'Impact'; font-size: 18px; font-weight: bold; margin-top:0px; }
        .header-hindi { font-family: 'Impact'; font-size: 27px; word-spacing:20px;}
        .header-eng { font-family: 'Impact'; font-size: 20px;margin-bottom:0px; }

        .main {
          text-align: center;
          padding:7px;
          color: #A01E1E;
        }

        .profile-img {
          width: 100px;        /* Passport width */
          height: 110px;       /* Passport height */
          border: 2px solid #A01E1E;
          margin: 3px auto;
          overflow: hidden;
          background-color: #929292ff;
          object-fit: cover;   /* Makes image fit perfectly */
          background-color: transparent;
        }
        .profile-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .id-text { font-size: 13px;margin-bottom: 10px;font-family: 'Impact';color: #000000ff;}

        .info-box { 
          width: 90%; 
          margin-left:14px;
          font-family:'Impact'; 
          text-align:left; 
          color: #000000ff; 
        }

        .row { 
          display: flex; 
          align-items: flex-start;
        }

        .label { 
          width: 90px; 
          font-size: 12px; 
        }

        /* FIX: Address wraps correctly */
        .value { 
          font-size: 12px;
          flex: 1;
          word-wrap: break-word;
          white-space: pre-wrap;
          display: inline-block;
        }

        .reg { font-size: 12px;font-family: 'Impact'; color: #000000ff; text-align: left; margin-right: 10px; margin-top:20px; }

       .signature {
      text-align: right;
      margin-right: 10px;
      margin-top: -14px;
      position: relative; /* important */
    }

    .signature img {
      width: 80px;
      height: 35px;
      position: absolute;   /* overlap */
      top: -20px;            /* move image above text */
      right: 20;
    }

    .sign-text {
      font-size: 10px;
      color: #A01E1E;
      font-weight: bold;
      position: relative;
      z-index: 1;            /* text stays below image */
    }

       .underline-bar {
          width: 100%;
          height:8px;
          background-color: #A01E1E;
        }

        .footer {
          background-color: #A01E1E;
          color: white;
          text-align: center;
          padding: 25px 0px;
          margin-top: 10px;
          width: 260px;
          height: 350px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .extra-info {
          margin-top: 5px;
          font-family: 'Impact';
          color: white;
          width: 80%;
          text-align:left;
        }

        .symbol {
          width: 150px;
          height: 150px;
          margin-left:42;
          margin-right: auto;
        }
          .footer-address-value {
          width: 140px;
          white-space: normal;
          line-height: 13px;
          font-size: 12px;
          color: #ffffff;
        }

        .footer-title { font-family: 'Impact'; font-size: 16px;margin-right:15px; }
        .footer-address { font-size: 11px; margin-top: 3px; line-height: 14px;margin-right:12px; }
        .footer-email { font-size: 11px; margin-top: 3px;margin-right:12px;}

      </style>
    </head>

    <body>
      <div class="card">

        <div class="header">
          <div class="header-row">
            <img src="${headerImage}" />
          </div>

          <div class="header-tamil">இந்து தர்ம ரக்ஷ சேனா</div>
          <div class="header-hindi">हिन्दू धर्म रक्ष सेवा</div>
          <div class="header-eng">HINDU DHARMA RAKSHA SENA</div>
        </div>

        <div class="main">
          <div class="profile-img">
            ${profileBase64 ? `<img src="${profileBase64}" />` : ""}
          </div>

          <div class="id-text">ID NO : ${member.uniqueId || ""}</div>
          <div class="info-box">
            <div class="row"><div class="label">NAME</div><div class="value">: ${member.name}</div></div>
            <div class="row"><div class="label">S/O</div><div class="value">: ${member.fatherOrHusbandName}</div></div>
            <div class="row"><div class="label">DESIGNATION</div><div class="value">: ${member.designation}</div></div>
            <div class="row"><div class="label">DISTRICT</div><div class="value">: ${member.district.toUpperCase()}</div></div>
          </div>

          <div class="reg">Regd. No.: 152 / 2021</div>

          <div class="signature">
            <img src="${signatureImage}" />
            <div class="sign-text">Authorized Signatory</div>
          </div>
        </div>

        <div class="underline-bar"></div>

        <div class="footer">
          <div class="extra-info">

            <div class="row"><div class="label">Validity</div><div class="value">:${validity}</div></div>
            <div class="row"><div class="label">Date of Birth</div><div class="value">:23-04-1950</div></div>
            <div class="row"><div class="label">Blood Group</div><div class="value">: ${member.bloodGroup}</div></div>
            <div class="row"><div class="label">Contact No</div><div class="value">: ${member.contactDetails}</div></div>

            <!-- UPDATED ADDRESS WRAP SUPPORT -->
          <div class="row footer-address-row">
            <div class="label">Address</div>
            <div class="value footer-address-value">: ${member.residentialAddress}</div>
          </div>

          </div>

          <img src="${sunImage}" class="symbol" />

          <div class="footer-title">HINDU DHARMA RAKSHA SENA</div>

          <div class="footer-address">
            2nd Floor, Sunrise Crystal Avenue,<br/>
             Thadagam Road Somayampalayam,<br/>
            Coimbatore - 641 108.
          </div>

          <div class="footer-email">
            email: hdrss.in@gmail.com | www.hdrss.in
          </div>
        </div>
      </div>
    </body>
  </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    const newUri = `${FileSystem.cacheDirectory}idcard.pdf`;
    await FileSystem.copyAsync({ from: uri, to: newUri });
    return newUri;
  } catch (error) {
    console.error("Error generating ID:", error);
  }
}
function getMimeType(name) {
  if (name.endsWith(".ttf")) return "font/ttf";
  if (name.endsWith(".png")) return "image/png";
  return "image/jpeg";
}

async function imageUrlToBase64(url) {
  try {
  
    const fileUri = FileSystem.cacheDirectory + "profile.jpg";

    await FileSystem.downloadAsync(url, fileUri);

    const base64 = await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    console.error("Profile image base64 error:", err);
    return null;
  }
}

async function convertAssetToBase64(assetModule) {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();

  const cacheUri = FileSystem.cacheDirectory + asset.name;

  await FileSystem.copyAsync({
    from: asset.localUri,
    to: cacheUri,
  });

  const base64 = await FileSystem.readAsStringAsync(cacheUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return `data:${getMimeType(asset.name)};base64,${base64}`;
}

