import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system/legacy"; 
import { Asset } from "expo-asset";

export async function generateIdCard(member) {
  // ✅ Convert local images to Base64 (header, signature, and sun symbol)
  const [headerImage, signatureImage, sunImage] = await Promise.all([
    convertAssetToBase64(require("../../../assets/idcard/nandi2.jpg")),
    convertAssetToBase64(require("../../../assets/idcard/sign.png")),
    convertAssetToBase64(require("../../../assets/idcard/sun.png")),
  ]);

  // ✅ HTML template
  const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          width: 350px;
          height: auto;
          margin: 0;
          padding: 0;
          border: 2px solid #000;
          background-color: #fff;
        }
        .card {
          width: 320px;
          border: 1px solid #000;
          border-radius: 8px;
          overflow: hidden;
          margin: 10px auto;
        }
        .header {
          background-color: #a63b1d;
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
          padding: 15px 12px;
          margin-top: -20px;
        }

        .header-row img {
          width: 250px;
          height: auto;
          object-fit: contain;
          margin-top: 15px; /* moves image down slightly */
        }

        .header-tamil { font-size: 16px; font-weight: bold; margin-top: 5px; }
        .header-hindi { font-size: 20px; margin: 2px 0; }
        .header-eng { font-size: 16px; font-weight: bold; }

        .main {
          text-align: center;
          padding: 10px;
          color: #681414;
        }

        .profile-img {
          width: 100px;
          height: 100px;
          border: 1px solid #000;
          margin: 5px auto;
        }

        .id-text { font-size: 13px; font-weight: bold; margin-bottom: 10px; }

        .info-box { width: 80%; margin: 0 auto; text-align: left; }
        .row { display: flex; margin: 3px 0; }
        .label { width: 90px; font-weight: bold; font-size: 12px; }
        .value { font-size: 12px; font-weight: bold; }

        .reg { font-size: 12px; font-weight: bold;  text-align: left; margin-top: 60px; }

        .signature {
          text-align: right;
          margin-right: 30px;
          margin-top: -10px;
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

        .footer {
          background-color: #a63b1d;
          color: white;
          text-align: center;
          padding: 10px 0;
          margin-top: 10px;
        }

        .footer-details {
          font-size: 12px;
          margin-bottom: 5px;
          line-height: 14px;
        }

        .symbol {
          width: 100px;
          height: 100px;
          margin: 5px auto;
        }

        .footer-title { font-weight: bold; font-size: 15px; }
        .footer-address { font-size: 11px; margin-top: 3px; line-height: 14px; }
        .footer-email { font-size: 11px; margin-top: 3px; }
      </style>
    </head>

    <body>
      <div class="card">
        <!-- Header Section -->
        <div class="header">
          <div class="header-row">
            <img src="${headerImage}" />
          </div>
          <div class="header-tamil">இந்து தர்ம ரக்ஷ சேனா</div>
          <div class="header-hindi">हिन्दू धर्म रक्ष सेवा</div>
          <div class="header-eng">HINDU DHARMA RAKSHA SENA</div>
        </div>

        <!-- Main Section -->
        <div class="main">
          <div class="profile-img">
            ${
              member.image
                ? `<img src="${member.image}" width="100%" height="100%" />`
                : ""
            }
          </div>

          <div class="id-text">ID NO : ${member.id || ""}</div>

          <div class="info-box">
            <div class="row"><div class="label">NAME</div><div class="value">: ${
              member.name || ""
            }</div></div>
            <div class="row"><div class="label">S/O</div><div class="value">: ${
              member.fatherOrHusbandName || ""
            }</div></div>
            <div class="row"><div class="label">DESIGNATION</div><div class="value">: ${
              member.designation || ""
            }</div></div>
            <div class="row"><div class="label">DISTRICT</div><div class="value">: ${
              member.district || ""
            }</div></div>
          </div>

          <div class="reg">Regd. No.: 152 / 2021</div>

          <div class="signature">
            <img src="${signatureImage}" />
            <div class="sign-text">Authorized Signatory</div>
          </div>
        </div>

        <!-- Footer Section -->
        <div class="footer">
          <div class="footer-details">
            <div>Validity : JUNE’25 - JULY’26</div>
            <div>Date of Birth : ${member.dob || "08-12-1986"}</div>
            <div>Blood Group : ${member.bloodGroup || "O+"}</div>
            <div>Contact No : ${member.contactDetails || "9876543210"}</div>
          </div>

          <img src="${sunImage}" class="symbol" />

          <div class="footer-title">HINDU DHARMA RAKSHA SENA</div>

          <div class="footer-address">
            2nd Floor, Sunrise Crystal Building,<br/>
            Kalappanaiken Palayam Pirivu,<br/>
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

  // ✅ Generate and Share PDF
  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    console.log("✅ PDF generated:", uri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Sharing not available on this device");
    }

    return uri;
  } catch (error) {
    console.error("❌ Error generating ID card:", error);
  }
}

// ✅ Converts local bundled assets to Base64
async function convertAssetToBase64(assetModule) {
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();
  const base64 = await FileSystem.readAsStringAsync(asset.localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  return `data:image/jpeg;base64,${base64}`;
}






