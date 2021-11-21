﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BlazorDemos;
namespace BlazorDemos
{
    internal partial class SampleConfig
    {
        public List<Sample> TreeMap { get; set; } = new List<Sample>{
           new Sample {
                Name = "Default Functionalities",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/default-functionalities",
                FileName = "DefaultFunctionalities.razor",
                Type = SampleType.None
            },
            new Sample {
                Name = "Layout",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/layout",
                FileName = "Layout.razor",
                Type = SampleType.None
            },
            new Sample {
                Name = "Drilldown",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/drill-down",
                FileName = "Drilldown.razor",
                Type = SampleType.None
            },
            new Sample {
                Name = "Customization",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/customization",
                FileName = "Customization.razor",
                Type = SampleType.None
            },
             new Sample {
                Name = "Label",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/label",
                FileName = "TreeMapLabel.razor",
                Type = SampleType.None
            },
              new Sample {
                Name = "Tooltip",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/tooltip",
                FileName = "Tooltip.razor",
                Type = SampleType.None
            },
               new Sample {
                Name = "Legend",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/legend",
                FileName = "Legend.razor",
                Type = SampleType.None
            },
            new Sample {
                Name = "Color Mapping",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/color-mapping",
                FileName = "ColorMapping.razor",
                Type = SampleType.None
            },
            new Sample {
                Name = "Selection & Highlight",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/selection",
                FileName = "Selection.razor",
                Type = SampleType.None
            },
            new Sample {
                Name = "Print & Export",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/print",
                FileName = "Print.razor",
                Type = SampleType.None
            },
                new Sample
            {
                Name = "RTL",
                Category = "TreeMap",
                Directory = "TreeMap/TreeMap",
                Url = "treemap/rtl",
                FileName = "Rtl.razor",
                Type = SampleType.None
            }
        };
    }
}
