/**
 * GAENR CLOUD STORAGE DIRECT UPLOADER SCRIPT (Google Apps Script)
 * 
 * Target Folder ID: 13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO
 * Direct Webhook for Zero Web Hosting Storage
 * 
 * Deployment Steps (1 minute):
 * 1. Go to https://script.google.com with the account owning the Google Drive folder.
 * 2. Click "New project", paste this entire code.
 * 3. Click "Deploy" > "New deployment".
 * 4. Select type: "Web app".
 * 5. Set "Execute as": "Me".
 * 6. Set "Who has access": "Anyone".
 * 7. Click "Deploy" and authorize permissions.
 * 8. Copy the Web App URL (ends with /exec) into VITE_GOOGLE_DRIVE_WEBHOOK_URL in .env.
 */

var TARGET_FOLDER_ID = "13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO";

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    
    var folderId = data.folderId || TARGET_FOLDER_ID;
    var folder = DriveApp.getFolderById(folderId);
    
    var decoded = Utilities.base64Decode(data.base64);
    var blob = Utilities.newBlob(decoded, data.mimeType || "application/octet-stream", data.fileName || "deliverable");
    
    var file = folder.createFile(blob);
    // Make file viewable with link
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    var fileId = file.getId();
    var viewUrl = "https://drive.google.com/file/d/" + fileId + "/view";
    var previewUrl = "https://drive.google.com/file/d/" + fileId + "/preview";
    var directImageUrl = "https://lh3.googleusercontent.com/d/" + fileId;
    var directDownloadUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
    
    var output = {
      status: "success",
      fileId: fileId,
      fileName: file.getName(),
      fileUrl: viewUrl,
      previewUrl: previewUrl,
      directImageUrl: directImageUrl,
      downloadUrl: directDownloadUrl,
      folderId: folderId
    };
    
    return ContentService.createTextOutput(JSON.stringify(output))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    var errorOutput = {
      status: "error",
      message: error.toString()
    };
    return ContentService.createTextOutput(JSON.stringify(errorOutput))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "active",
    message: "Gaenr Cloud Direct Storage Endpoint is online."
  })).setMimeType(ContentService.MimeType.JSON);
}
