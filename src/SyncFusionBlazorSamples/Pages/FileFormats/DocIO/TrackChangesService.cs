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
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Xml;

namespace BlazorDemos.Data.FileFormats.DocIO
{
    public class TrackChangesService
    {
        /// <summary>
        /// Update fields in the Word document
        /// </summary>
        /// <returns>Return the created Word document as stream</returns>
        public MemoryStream CreateWordDocument(int AuthorName, string RevisionBtn, string button)
        {
            string basePath = @"wwwroot/";
            string dataPath = basePath + @"data/docio/track-changes-template.docx";
            FileStream fileStream = new FileStream(dataPath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            if (button == "View Template")
            {
                MemoryStream ms = new MemoryStream();
                fileStream.Position = 0;
                fileStream.CopyTo(ms);
                fileStream.Close();
                return ms;
            }

            // Create a new document
            WordDocument document = new WordDocument();
            // Load the template.
            document.Open(fileStream, FormatType.Automatic);
            fileStream.Dispose();
            fileStream = null;
            string author = GetAuthorName(AuthorName);

            //Accepts the all changes made by the author
            if (RevisionBtn == "AcceptBtn")
                AcceptRevisionsOfAuthor(document, author);
            //Rejects the all the changes made by the author
            else if (RevisionBtn == "RejectBtn")
                RejectRevisionsOfAuthor(document, author);
            //Rejects all the tracked changes revisions in the Word document
            else if (RevisionBtn == "RejectAllBtn")
                document.Revisions.RejectAll();
            //Accepts all the tracked changes revisions in the Word document
            else
                document.Revisions.AcceptAll();

            FormatType formatType = FormatType.Docx;            
            //Save the document as a stream and retrun the stream
            using (MemoryStream stream = new MemoryStream())
            {
                //Save the created Word document to MemoryStream
                document.Save(stream, formatType);
                document.Close();
                stream.Position = 0;
                return stream;
            }
        }

        #region Helper Methods
        /// <summary>
        ///  Rejects the all changes made by the author
        /// </summary>
        private void RejectRevisionsOfAuthor(WordDocument document, string author)
        {
            //Iterate into all the revisions in Word document
            for (int i = document.Revisions.Count - 1; i >= 0; i--)
            {
                //Checks the author of current revision and rejects it.
                if (document.Revisions[i].Author == author)
                    document.Revisions[i].Reject();

                //Reset to last item when reject the moving related revisions.
                if (i > document.Revisions.Count - 1)
                    i = document.Revisions.Count;
            }
        }
        /// <summary>
        ///  Accepts the all changes made by the author
        /// </summary>
        private void AcceptRevisionsOfAuthor(WordDocument document, string author)
        {
            //Iterate into all the revisions in Word document
            for (int i = document.Revisions.Count - 1; i >= 0; i--)
            {
                //Checks the author of current revision and rejects it.
                if (document.Revisions[i].Author == author)
                    document.Revisions[i].Accept();

                //Reset to last item when accept the moving related revisions.
                if (i > document.Revisions.Count - 1)
                    i = document.Revisions.Count;
            }
        }
            /// <summary>
            /// Gets the author name
            /// </summary>
            private string GetAuthorName(int selectedIndex)
            {
                switch (selectedIndex)
                {
                    case 1:
                        return "Nancy Davolio";
                    case 2:
                        return "Steven Buchanan";
                    case 3:
                        return "Stanley Hudson";
                    case 4:
                        return "Andrew Fuller";
                }
                return string.Empty;
            }
            #endregion

        }
    }