#region Copyright Syncfusion Inc. 2001 - 2019
// Copyright Syncfusion Inc. 2001 - 2019. All rights reserved.
// Use of this code is subject to the terms of our license.
// A copy of the current license can be obtained at any time by e-mailing
// licensing@syncfusion.com. Any infringement will be prosecuted under
// applicable laws. 
#endregion

using Syncfusion.DocIO;
using Syncfusion.DocIO.DLS;
using Syncfusion.Drawing;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace BlazorDemos.Data.FileFormats.DocIO
{
    public class InsertOLEObjectService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        public InsertOLEObjectService(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        /// <summary>
        /// Insert OLE Object into the Word document
        /// </summary>
        /// <returns>Return the created Word document as stream</returns>
        public MemoryStream InsertOLEObject(string documentType)
        {
            //Data folder path is resolved from requested page physical path.
            string basePath = _hostingEnvironment.WebRootPath;
            FileStream fileStream;
            WordDocument oleSource;
            if (documentType == "DOC")
            {
                fileStream = new FileStream(basePath + @"/data/docio/ole-template.doc", FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                //Open an existing word document                 
                oleSource = new WordDocument(fileStream, FormatType.Doc);
            }
            else
            {
                fileStream = new FileStream(basePath + @"/data/docio/ole-template.docx", FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
                //Open an existing word document 
                oleSource = new WordDocument(fileStream, FormatType.Docx);
            }
            fileStream.Dispose();
            fileStream = null;
            WordDocument dest = new WordDocument();
            dest.EnsureMinimal();
            // Get OLE object from source document
            WOleObject oleObject = oleSource.LastParagraph.Items[0] as WOleObject;
            WPicture pic = oleObject.OlePicture.Clone() as WPicture;
            dest.LastParagraph.AppendText("OLE Object Demo");
            dest.LastParagraph.ApplyStyle(BuiltinStyle.Heading1);
            dest.LastParagraph.ParagraphFormat.HorizontalAlignment = Syncfusion.DocIO.DLS.HorizontalAlignment.Center;
            dest.Sections[0].AddParagraph();
            dest.LastParagraph.AppendText("Adobe PDF object Inserted");
            dest.LastParagraph.ApplyStyle(BuiltinStyle.Heading2);
            dest.Sections[0].AddParagraph();
            //AppendOLE object to the destination document
            dest.LastParagraph.AppendOleObject(oleObject.Container, pic, OleLinkType.Embed);

            FormatType formatType = FormatType.Docx;            
            //Save as .doc format
            if (documentType == "WordDoc")            
                formatType = FormatType.Doc;                
            //Save as .xml format
            else if (documentType == "WordML")
                formatType = FormatType.WordML;            
            //Save the document as a stream and retrun the stream
            using (MemoryStream stream = new MemoryStream())
            {
                //Save the created Word document to MemoryStream
                dest.Save(stream, formatType);
                dest.Close();
                stream.Position = 0;
                return stream;
            }
        }
    }
}