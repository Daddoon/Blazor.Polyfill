#region Copyright Syncfusion Inc. 2001 - 2019
// Copyright Syncfusion Inc. 2001 - 2019. All rights reserved.
// Use of this code is subject to the terms of our license.
// A copy of the current license can be obtained at any time by e-mailing
// licensing@syncfusion.com. Any infringement will be prosecuted under
// applicable laws. 
#endregion
using Syncfusion.Pdf;
using Syncfusion.Pdf.Graphics;
using Syncfusion.Drawing;
using Syncfusion.Pdf.Lists;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Http;
using Syncfusion.Pdf.Security;
using Syncfusion.Pdf.Parsing;

namespace BlazorDemos.Data.FileFormats.PDF
{
    public class DigitalSignatureService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        public DigitalSignatureService(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Create a simple PDF document
        /// </summary>
        /// <returns>Return the created PDF document as stream</returns>
        public MemoryStream DigitalSignaturePDF(string RadioButtonList2, string NewPDF, string Cryptographic, string Digest_Algorithm)
        {
            MemoryStream stream_Empty = new MemoryStream();

            //Read the PFX file
            FileStream pfxFile = new FileStream(ResolveApplicationPath("pdf.pfx"), FileMode.Open, FileAccess.Read, FileShare.ReadWrite);

            PdfDocument doc = new PdfDocument();
            PdfPage page = doc.Pages.Add();
            PdfSolidBrush brush = new PdfSolidBrush(Color.Black);
            PdfPen pen = new PdfPen(brush, 0.2f);
            PdfFont font = new PdfStandardFont(PdfFontFamily.Courier, 12, PdfFontStyle.Regular);
            PdfCertificate pdfCert = new PdfCertificate(pfxFile, "password123");
            PdfSignature signature = new PdfSignature(page, pdfCert, "Signature");
            FileStream jpgFile = new FileStream(ResolveApplicationImagePath("logo.png"), FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            PdfBitmap bmp = new PdfBitmap(jpgFile);
            signature.Bounds = new RectangleF(new PointF(5, 5), page.GetClientSize());
            signature.ContactInfo = "johndoe@owned.us";
            signature.LocationInfo = "Honolulu, Hawaii";
            signature.Reason = "I am author of this document.";
            SetCryptographicStandard(Cryptographic, signature);
            SetDigest_Algorithm(Digest_Algorithm, signature);
            if (RadioButtonList2 == "Standard")
                signature.Certificated = true;
            else
                signature.Certificated = false;
            PdfGraphics graphics = signature.Appearance.Normal.Graphics;

            string validto = "Valid To: " + signature.Certificate.ValidTo.ToString();
            string validfrom = "Valid From: " + signature.Certificate.ValidFrom.ToString();

            graphics.DrawImage(bmp, 0, 0);

            doc.Pages[0].Graphics.DrawString(validfrom, font, pen, brush, 0, 90);
            doc.Pages[0].Graphics.DrawString(validto, font, pen, brush, 0, 110);

            doc.Pages[0].Graphics.DrawString(" Protected Document. Digitally signed Document.", font, pen, brush, 0, 130);
            doc.Pages[0].Graphics.DrawString("* To validate Signature click on the signature on this page \n * To check Document Status \n click document status icon on the bottom left of the acrobat reader.", font, pen, brush, 0, 150);

            // Save the pdf document to the Stream.
            MemoryStream stream = new MemoryStream();

            doc.Save(stream);

            //Close document
            doc.Close();

            stream.Position = 0;
            return stream;

        }

        private void SetCryptographicStandard(string cryptographic, PdfSignature signature)
        {
            if (cryptographic != null)
            {
                if (cryptographic == "CAdES")
                    signature.Settings.CryptographicStandard = CryptographicStandard.CADES;
                else
                    signature.Settings.CryptographicStandard = CryptographicStandard.CMS;
            }
        }

        private void SetDigest_Algorithm(string digest_Algorithm, PdfSignature signature)
        {
            if (digest_Algorithm != null)
            {
                switch (digest_Algorithm)
                {
                    case "SHA1":
                        signature.Settings.DigestAlgorithm = DigestAlgorithm.SHA1;
                        break;
                    case "SHA384":
                        signature.Settings.DigestAlgorithm = DigestAlgorithm.SHA384;
                        break;
                    case "SHA512":
                        signature.Settings.DigestAlgorithm = DigestAlgorithm.SHA512;
                        break;
                    case "RIPEMD160":
                        signature.Settings.DigestAlgorithm = DigestAlgorithm.RIPEMD160;
                        break;
                    default:
                        signature.Settings.DigestAlgorithm = DigestAlgorithm.SHA256;
                        break;
                }
            }
        }

        #region HelperMethod
        private string ResolveApplicationPath(string fileName)
        {
            return _hostingEnvironment.WebRootPath + "//data//pdf//" + fileName;
        }
        private string ResolveApplicationImagePath(string fileName)
        {
            return _hostingEnvironment.WebRootPath + "//images//pdf//" + fileName;
        }
        #endregion
    }
}
    

