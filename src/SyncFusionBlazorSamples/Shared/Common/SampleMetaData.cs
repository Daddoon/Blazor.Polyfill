﻿using System;
using System.Text;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Rendering;

namespace BlazorDemos.Shared
{
    /// <summary>
    /// A component to render the application's meta data based on current component and sample information.
    /// </summary>
    public class SampleMetaData : ComponentBase, IDisposable
    {
        [Inject]
        protected NavigationManager UriHelper { get; set; }

        [Inject]
        protected SampleService SampleService { get; set; }

        protected override void BuildRenderTree(RenderTreeBuilder builder)
        {
            builder.AddMarkupContent(0, GetContent());
        }

        private string GetContent()
        {
            SampleService.Update(UriHelper);
            StringBuilder sb = new StringBuilder();
            sb.Append(Environment.NewLine);
            // Meta data content generation for component demos.
            if (SampleService.ComponentName != null)
            {
                var componentName = SampleService.SampleInfo.Directory == "Buttons/Button" ? "Button" : SampleService.ComponentName;
                var sampleInfo = SampleService.SampleInfo;
                var sampleName = sampleInfo.MappingSampleName != null && !UriHelper.Uri.Contains(sampleInfo.Url) ? sampleInfo.MappingSampleName : sampleInfo.Name;
                sb.Append($"<title>");
                var metaTitle = string.IsNullOrEmpty(sampleInfo.MetaTitle) ? "Blazor " + componentName + SampleUtils.SPACE + sampleName + " Example - Syncfusion Demos" : sampleInfo.MetaTitle ;
                sb.Append(metaTitle);
                sb.Append($"</title>");
                sb.Append(Environment.NewLine);
                sb.Append($"<meta");
                sb.Append($" name =\"description\"");
                var metaDescription = string.IsNullOrEmpty(sampleInfo.MetaDescription) ? "This example demonstrates the " + sampleName + " in Blazor " + componentName + " Component. Explore here for more details." : sampleInfo.MetaDescription;
                sb.Append($" content =\"{metaDescription}\"");
                sb.Append(">");
                sb.Append(Environment.NewLine);
            }
            // Meta data content generation for home page.
            else
            {
                sb.Append($"<title>");
                sb.Append("Blazor Components Examples & Demos | Syncfusion");
                sb.Append($"</title>");
                sb.Append(Environment.NewLine);
                sb.Append($"<meta");
                sb.Append($" name =\"description\"");
                sb.Append($" content =\"{"Explore and learn Syncfusion Blazor components using large collection of demos, example applications and tutorial samples."}\"");
                sb.Append(">");
                sb.Append(Environment.NewLine);
            }
            return sb.ToString();
        }

        /// <summary>
        /// Re-rendering the component with current sample's meta data.
        /// </summary>
        public void Refresh()
        {
            StateHasChanged();
        }

        protected override void OnAfterRender(bool firstRender)
        {
            base.OnAfterRender(firstRender);
            
            // Assign meta data ref to sample service for outside usage.
            if (firstRender)
            {
                SampleService.MetaData = this;
            }
        }

        public void Dispose()
        {
            SampleService.MetaData = null;
        }
    }
}
