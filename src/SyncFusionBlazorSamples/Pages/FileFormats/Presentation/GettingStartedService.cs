#region Copyright Syncfusion Inc. 2001 - 2019
// Copyright Syncfusion Inc. 2001 - 2019. All rights reserved.
// Use of this code is subject to the terms of our license.
// A copy of the current license can be obtained at any time by e-mailing
// licensing@syncfusion.com. Any infringement will be prosecuted under
// applicable laws. 
#endregion

using System.IO;
using Microsoft.AspNetCore.Hosting;
using Syncfusion.Presentation;

namespace BlazorDemos.Data.FileFormats.Presentation
{
    public class GettingStartedService
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        public GettingStartedService(IWebHostEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        /// <summary>
        /// Create a simple Presentation document
        /// </summary>
        /// <returns>Return the created Presentation document as stream</returns>
        public MemoryStream CreatePresentation()
        {
            //Open the existing presentation            
            FileStream fileStreamInput = new FileStream(ResolveApplicationPath("hello-world.pptx"), FileMode.Open, FileAccess.Read);
            IPresentation presentation = Syncfusion.Presentation.Presentation.Open(fileStreamInput);           
            
            //Method call to create slides
            CreateDefaultSlide(presentation);
			
            //Save the document as a stream and retrun the stream
            using (MemoryStream stream = new MemoryStream())
            {
                //Save the created PowerPoint document to MemoryStream
                presentation.Save(stream);
                return stream;
            }
        }
		
        #region HelperMethod
        private string ResolveApplicationPath(string fileName)
        {
            return _hostingEnvironment.WebRootPath + "//data//presentation//" + fileName;
        }
        #endregion
		
        # region Slide
        private void CreateDefaultSlide(IPresentation presentation)
        {
            //Retrieve the first slide of the presentation.
            ISlide slide1 = presentation.Slides[0];
            //Retrieve the first shape of the slide.
            IShape titleShape = slide1.Shapes[0] as IShape;
            //Set the size and position of the shape.
            titleShape.Left = 0.33 * 72;
            titleShape.Top = 0.58 * 72;
            titleShape.Width = 12.5 * 72;
            titleShape.Height = 1.75 * 72;

            //Retrieve the text body of the shape.
            ITextBody textFrame1 = (slide1.Shapes[0] as IShape).TextBody;
            IParagraphs paragraphs1 = textFrame1.Paragraphs;
            //Add a new paragraph.
            IParagraph paragraph = paragraphs1.Add();
            //Set the horizontal alignment type for the paragraph.
            paragraph.HorizontalAlignment = HorizontalAlignmentType.Center;
            //Add a text part.
            ITextPart textPart1 = paragraph.AddTextPart();
            //Add text to the text part.
            textPart1.Text = "Essential Presentation";
            //Set the font properties for the text part.
            textPart1.Font.CapsType = TextCapsType.All;
            textPart1.Font.FontName = "Adobe Garamond Pro";
            textPart1.Font.Bold = true;
            textPart1.Font.FontSize = 40;

            //Retrieve the second shape of the slide.
            IShape subtitle = slide1.Shapes[1] as IShape;
            //Set the size and position of the shape.
            subtitle.Left = 1.33 * 72;
            subtitle.Top = 2.67 * 72;
            subtitle.Width = 10 * 72;
            subtitle.Height = 1.7 * 72;

            //Retrieve the text body of the shape.
            ITextBody textFrame2 = (slide1.Shapes[1] as IShape).TextBody;
            textFrame2.VerticalAlignment = VerticalAlignmentType.Top;
            IParagraphs paragraphs2 = textFrame2.Paragraphs;
            //Add a new paragraph.
            IParagraph para = paragraphs2.Add();
            //Set the horizontal alignment type for the paragraph.
            para.HorizontalAlignment = HorizontalAlignmentType.Left;
            //Add a text part.
            ITextPart textPart2 = para.AddTextPart();
            //Add text to the text part.
            textPart2.Text = "Lorem ipsum dolor sit amet, lacus amet amet ultricies. Quisque mi venenatis morbi libero, orci dis, mi ut et class porta, massa ligula magna enim, aliquam orci vestibulum tempus.Turpis facilisis vitae consequat, cum a a, turpis dui consequat massa in dolor per, felis non amet.";
            textPart2.Font.FontName = "Adobe Garamond Pro";
            textPart2.Font.FontSize = 21;

            //Add a new paragraph.
            para = paragraphs2.Add();
            //Set the horizontal alignment type for the paragraph.
            para.HorizontalAlignment = HorizontalAlignmentType.Left;
            //Add a text part.
            textPart2 = para.AddTextPart();
            //Add text to the text part.
            textPart2.Text = "Turpis facilisis vitae consequat, cum a a, turpis dui consequat massa in dolor per, felis non amet. Auctor eleifend in omnis elit vestibulum, donec non elementum tellus est mauris, id aliquam, at lacus, arcu pretium proin lacus dolor et. Eu tortor, vel ultrices amet dignissim mauris vehicula.";
            //Set the font properties.
            textPart2.Font.FontName = "Adobe Garamond Pro";
            textPart2.Font.FontSize = 21;

        }
        #endregion
    }
}