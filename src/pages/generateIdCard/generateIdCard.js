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

const formatDOB = (dob) => {
  if (!dob) return "";

  const [year, month, day] = dob.split("-");
  return `${day}-${month}-${year}`;
};

const formattedDOB = formatDOB(member.dob);
const sonOf= member.sonOf;



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

        .header-tamil { font-family: 'Impact'; font-size: 18px; font-weight: bold; margin-top:5px; }
        .header-hindi { font-family: 'Impact'; font-size: 27px; word-spacing:5px;}
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
          display: inline-block;
          font-family: 'Impact'; 
          color: #000000ff; 
          text-align: left;
        }

        .row { 
          display: flex; 
          align-items: flex-start;
        }

        .label { 
          width: 82px;
          min-width: 82px;
          font-size: 12px;
          text-align: left;
        }

        .colon {
          width: 14px;
          font-size: 12px;
          text-align: center;
        }
    

        .value { 
          font-size: 12px;
          text-align: left;
          word-wrap: break-word;
          white-space: pre-wrap;
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
      top: -30px;            /* move image above text */
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
        text-align: left;
        width: 220px;
        margin-left: auto;
        margin-right: auto;
      }

        .symbol {
          width: 150px;
          height: 150px;
          margin-left:42;
          margin-right: auto;
        }
       .footer-address-value {
          flex: 1;
          white-space: normal;
          word-wrap: break-word;
          line-height: 14px;
          font-size: 12px;
          color: #ffffff;
        }

        .footer-title { font-family: 'Impact'; font-size: 16px;margin-right:15px; }

        .footer-address {
        font-size: 11px;
        line-height: 14px;
        width: 210px;
        text-align: center;

        display: -webkit-box;
        -webkit-line-clamp: 3;     /* limit to 3 lines */
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
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

          <div class="main" style="text-align:center;">
          <div class="info-box">
            <div class="row"><div class="label">NAME</div><div class="colon">:</div><div class="value">${member.name}</div></div>
            <div class="row"><div class="label">${member.sonOf}</div><div class="colon">:</div><div class="value">${member.fatherOrHusbandName}</div></div>
            <div class="row"><div class="label">DESIGNATION</div><div class="colon">:</div><div class="value">${member.designation}</div></div>
            <div class="row"><div class="label">DISTRICT</div><div class="colon">:</div><div class="value">${member.district.toUpperCase()}</div></div>
          </div>
        </div>


          <div class="reg">Regd. No.: 152 / 2021</div>

          <div class="signature">
            <img src="${signatureImage}" />
            <div class="sign-text">Authorized Signatory</div>
          </div>
        </div>

        <div class="underline-bar"></div>

        <div class="footer">
          <div  class="extra-info">
          <div class="row">
            <div class="label" style="color:white; width:82px; min-width:82px;">Validity</div>
            <div class="colon" style="color:white;">:</div>
            <div class="value" style="color:white;">${validity}</div>
          </div>
          <div class="row">
            <div class="label" style="color:white; width:82px; min-width:82px;">Date of Birth</div>
            <div class="colon" style="color:white;">:</div>
            <div class="value" style="color:white;">${formattedDOB}</div>
          </div>
          <div class="row">
            <div class="label" style="color:white; width:82px; min-width:82px;">Blood Group</div>
            <div class="colon" style="color:white;">:</div>
            <div class="value" style="color:white;">${member.bloodGroup}</div>
          </div>
          <div class="row">
            <div class="label" style="color:white; width:82px; min-width:82px;">Contact No</div>
            <div class="colon" style="color:white;">:</div>
            <div class="value" style="color:white;">${member.contactDetails}</div>
          </div>
          <div class="row">
            <div class="label" style="color:white; width:82px; min-width:82px;">Res. Address</div>
            <div class="colon" style="color:white;">:</div>
            <div class="value footer-address-value">${member.residentialAddress}</div>
          </div>
        </div>

          <img src="${sunImage}" class="symbol" />

          <div class="footer-title">HINDU DHARMA RAKSHA SENA</div>

          <div class="footer-address">
            2nd Floor,Louisons & Sunrise Crystal Complex,
            Kalappanaicken Palayam Pirivu
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





