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
