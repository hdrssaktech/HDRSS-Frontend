// my code 
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy";
// import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";

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
    convertAssetToBase64(require("../../../assets/idcard/sun.png")),
    convertAssetToBase64(require("../../../assets/fonts/impact.ttf")),
  ]);

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
          padding: 40 160px;
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
          background-color: #e73200ff;
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
          padding: 1px 17px;
          margin-top: -20px;
        }

        .header-row img {
          width: 250px;
          height: auto;
          object-fit: contain;
          margin-top: 15px;
        }

        .header-tamil { font-family: 'Impact'; font-size: 18px; font-weight: bold; margin-top: 5px; }
        .header-hindi { font-family: 'Impact'; font-size: 27px; word-spacing: 10px;}
        .header-eng { font-family: 'Impact'; font-size: 20px; font-weight: bold; }

        .main {
          text-align: center;
          padding: 10px;
          color: #681414;
        }

        .profile-img {
          width: 100px;        /* Passport width */
          height: 130px;       /* Passport height */
          border: 2px solid #e73200;
          margin: 5px auto;
          overflow: hidden;
          object-fit: cover;   /* Makes image fit perfectly */
        }
        .profile-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .id-text { font-size: 13px;margin-bottom: 10px;font-family: 'Impact';color: #000000ff;  }

        .info-box { 
          width: 90%; 
          margin-left:55px;
          font-family:'Impact'; 
          text-align:left; 
          color: #000000ff; 
        }

        .row { 
          display: flex; 
          margin: 3px 0; 
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

        .reg { font-size: 12px;font-family: 'Impact'; color: #000000ff; text-align: left; margin-right: 10px; margin-top: 30px; }

        .signature {
          text-align: right;
          margin-right: 10px;
          margin-top: -47px;
        }

        .signature img {
          width: 80px;
          height: 35px;
        }

        .sign-text {
          font-size: 10px;
          color: #e72828;
          font-weight: bold;
        }

       .underline-bar {
          width: 100%;
          height:8px;
          background-color: #e72828;
        }

        .footer {
          background-color: #e73200ff;
          color: white;
          text-align: center;
          padding: 25px 10px;
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
          margin-left: 40;
          margin-right: auto;
        }
          .footer-address-value {
          width: 140px;
          white-space: normal;
          line-height: 13px;
          font-size: 12px;
          color: #ffffff;
        }

        .footer-title { font-family: 'Impact'; font-size: 16px; }
        .footer-address { font-size: 11px; margin-top: 3px; line-height: 14px; }
        .footer-email { font-size: 11px; margin-top: 3px; }

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
            ${
              member.image
                ? `<img src="${member.image}" width="100%" height="100%" />`
                : ""
            }
          </div>

          <div class="id-text">ID NO : ${member.uniqueId || ""}</div>
          <div class="info-box">
            <div class="row"><div class="label">NAME</div><div class="value">: ${member.name}</div></div>
            <div class="row"><div class="label">S/O</div><div class="value">: ${member.fatherOrHusbandName}</div></div>
            <div class="row"><div class="label">DESIGNATION</div><div class="value">: ${member.designation}</div></div>
            <div class="row"><div class="label">DISTRICT</div><div class="value">: ${member.district}</div></div>
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

            <div class="row"><div class="label">Validity</div><div class="value">: JUNE’25 - JULY’26</div></div>
            <div class="row"><div class="label">Date of Birth</div><div class="value">: ${member.dob}</div></div>
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
    console.log("PDF generated:", newUri);
    return newUri;
  } catch (error) {
    console.error("Error generating ID:", error);
  }
}

async function convertAssetToBase64(assetModule) {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();
  const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/jpeg;base64,${base64}`;
}

