var TARGET_FOLDER_ID = "13TfzgSRtRCy2ubOU4fyFEg_NEGZLonDO";

function doPost(e) {
  try {
    var contents = e.postData.contents;
    var data = JSON.parse(contents);
    
    // 1. Email Dispatch Action (Automated Email Delivery)
    if (data.action === "send_email" || data.type === "send_email") {
      var recipient = data.to;
      var subject = data.subject || "GAENR Notification";
      var htmlBody = data.html || data.text || "";
      var plainText = data.text || htmlBody.replace(/<[^>]*>/g, "");
      
      if (!recipient) {
        return ContentService.createTextOutput(JSON.stringify({
          status: "error",
          message: "Recipient 'to' email address is required."
        })).setMimeType(ContentService.MimeType.JSON);
      }
      
      MailApp.sendEmail({
        to: recipient,
        subject: subject,
        body: plainText,
        htmlBody: htmlBody,
        name: "GAENR Operations"
      });
      
      return ContentService.createTextOutput(JSON.stringify({
        status: "success",
        success: true,
        message: "Email sent successfully to " + recipient
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. Google Drive Cloud Storage Upload Action
    var folderId = data.folderId || TARGET_FOLDER_ID;
    var folder = DriveApp.getFolderById(folderId);
    
    var decoded = Utilities.base64Decode(data.base64);
    var blob = Utilities.newBlob(decoded, data.mimeType || "application/octet-stream", data.fileName || "deliverable");
    
    var file = folder.createFile(blob);
    
    // ফাইল শেয়ারিং ট্রাই-ক্যাচে রাখা হয়েছে যাতে ব্যক্তিগত/ওয়ার্কস্পেস ড্রাইভ অ্যাকাউন্টে এক্সেস এরর না দেয়
    try {
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    } catch (shareErr) {
      // ড্রাইভ ফোল্ডার শেয়ারিং পারমিশন স্বয়ংক্রিয়ভাবে ইনহেরিট করে
    }
    
    var fileId = file.getId();
    var viewUrl = "https://drive.google.com/file/d/" + fileId + "/view";
    var previewUrl = "https://drive.google.com/file/d/" + fileId + "/preview";
    var directImageUrl = "https://lh3.googleusercontent.com/d/" + fileId;
    var directDownloadUrl = "https://drive.google.com/uc?export=download&id=" + fileId;
    
    var output = {
      status: "success",
      success: true,
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
    message: "Gaenr Cloud Direct Storage & Email Endpoint is online."
  })).setMimeType(ContentService.MimeType.JSON);
}

// একবার চালান (Run) বাটনে চাপ দিয়ে ড্রাইভ ও মেইল পারমিশন Authorize করুন
function testDriveAccess() {
  var folder = DriveApp.getFolderById(TARGET_FOLDER_ID);
  Logger.log("Drive connected successfully: " + folder.getName());
}
