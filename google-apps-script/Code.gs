/**
 * GAENR GOOGLE DRIVE DIRECT UPLOADER SCRIPT (Google Apps Script)
 * 
 * Folder ID: 13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO
 * Folder URL: https://drive.google.com/drive/folders/13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO?usp=sharing
 * 
 * Instructions to deploy in 1 minute:
 * 1. Go to https://script.google.com with the Google account that owns the Drive folder.
 * 2. Click "New project" and paste all the code below.
 * 3. Click "Deploy" > "New deployment".
 * 4. Select type: "Web app".
 * 5. Set "Execute as": "Me".
 * 6. Set "Who has access": "Anyone" (crucial for receiving uploads from website).
 * 7. Click "Deploy", authorize permissions, and copy the Web App URL (ends with /exec).
 * 8. Paste that Web App URL in Gaenr Website (VITE_GOOGLE_DRIVE_WEBHOOK_URL in .env or in the Portal Drive Settings).
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
    var directUrl = "https://drive.google.com/uc?export=view&id=" + fileId;
    
    var output = {
      status: "success",
      fileId: fileId,
      fileName: file.getName(),
      fileUrl: viewUrl,
      downloadUrl: directUrl,
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
    message: "Gaenr Google Drive Direct Uploader Webhook is online and connected to folder " + TARGET_FOLDER_ID
  })).setMimeType(ContentService.MimeType.JSON);
}
