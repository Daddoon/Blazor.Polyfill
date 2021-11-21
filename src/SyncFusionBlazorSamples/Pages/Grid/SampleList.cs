using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BlazorDemos;
namespace BlazorDemos
{
    internal partial class SampleConfig
    {
        public List<Sample> DataGrid { get; set; } = new List<Sample>{
             new Sample
            {
                Name = "Overview",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/overview",
                FileName = "Overview.razor",
                MetaTitle = "Blazor DataGrid Example | Grid Overview | Syncfusion Demos",
                HeaderText = "Blazor DataGrid Example - Overview",
                MetaDescription = "This Blazor DataGrid example is an overview of the Blazor DataGrid features with its performance metrics calculated for huge volume of data.",
                Type = SampleType.None,
            },
             
            new Sample
            {
                Name = "Default Functionalities",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/default-functionalities",
                FileName = "DefaultFunctionalities.razor",
                MetaTitle = "Blazor Grid Example | Default Functionalities | Syncfusion Demos",
                HeaderText = "Blazor Grid Example - Default Functionalities",
                MetaDescription = "This Blazor Grid example demonstrates the default rendering of the DataGrid with a minimum configuration.",
                Type = SampleType.None,
            },
            new Sample
            {
                Name = "List Binding",
                Category = "Data Binding",
                Directory = "Grid/DataGrid",
                Url = "datagrid/local-data",
                FileName = "LocalData.razor",
                Type = SampleType.None
            },
             new Sample
            {
                Name = "Remote Data",
                Category = "Data Binding",
                Directory = "Grid/DataGrid",
                Url = "datagrid/remote-data",
                FileName = "RemoteData.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Custom Binding",
                Category = "Data Binding",
                Directory = "Grid/DataGrid",
                Url = "datagrid/custom-binding",
                FileName = "CustomBinding.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Context Menu",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/context-menu",
                FileName = "ContextMenu.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Default Scrolling",
                Category = "Scrolling",
                Directory = "Grid/DataGrid",
                Url = "datagrid/default-scrolling",
                FileName = "DefaultScrolling.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Virtual Scrolling",
                Category = "Scrolling",
                Directory = "Grid/DataGrid",
                Url = "datagrid/virtual-scrolling",
                FileName = "VirtualScrolling.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "AutoWrap Column Cells",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/auto-wrap",
                FileName = "AutoWrap.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Stacked Header",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/stacked-header",
                FileName = "GridStackedHeader.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Column Reorder",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/reorder",
                FileName = "Reorder.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Column Chooser",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/column-chooser",
                FileName = "ColumnChooser.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Column Chooser Template",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/column-chooser-template",
                FileName = "ColumnChooserTemplate.razor",
                Type = SampleType.New,
                NotificationDescription = new string[] {
                    @"Added a demo to customize the column chooser dialog in Grid component.",
                }
            },
            new Sample
            {
                Name = "Column Resize",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/column-resize",
                FileName = "Columnresize.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Column Menu",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/column-menu",
                FileName = "Columnmenu.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Row Hover",
                Category = "Rows",
                Directory = "Grid/DataGrid",
                Url = "datagrid/row-hover",
                FileName = "RowHover.razor",
                Type = SampleType.None
            },
             new Sample
             {
                 Name = "Row Drag and Drop",
                 Category = "Rows",
                 Directory = "Grid/DataGrid",
                 Url = "datagrid/row-drag-and-drop",
                 FileName = "RowDragAndDrop.razor",
                 Type = SampleType.None
             },
            new Sample
            {
               Name = "Row Drag and Drop Within Grid",
               Category = "Rows",
               Directory = "Grid/DataGrid",
               Url = "datagrid/draganddrop-within-grid",
               FileName = "DragAndDropWithinGrid.razor",
               Type = SampleType.None
            },
            new Sample
            {
                Name = "Inline Editing",
                Category = "Editing",
                Directory = "Grid/DataGrid",
                Url = "datagrid/inline-editing",
                FileName = "InlineEditing.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Dialog Editing",
                Category = "Editing",
                Directory = "Grid/DataGrid",
                Url = "datagrid/dialog-editing",
                FileName = "DialogEditing.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Dialog Template",
                Category = "Editing",
                Directory = "Grid/DataGrid",
                Url = "datagrid/grid-dialog-template",
                FileName = "GridDialogTemplate.razor"
            },
            new Sample
            {
                Name = "Batch Editing",
                Category = "Editing",
                Directory = "Grid/DataGrid",
                Url = "datagrid/batch-editing",
                FileName = "BatchEditing.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Command Column",
                Category = "Editing",
                Directory = "Grid/DataGrid",
                Url = "datagrid/command-column",
                FileName = "CommandColumn.razor",
                Type = SampleType.None
            },
            //new Sample
            //{
            //    Name = "Cell Edit Template",
            //    Category = "Editing",
            //    Directory = "Grid/DataGrid",
            //    Url = "datagrid/cell-edit-template",
            //    FileName = "CellEditTemplate.razor",
            //    Type = SampleType.New
            //},
            new Sample
            {
                Name = "Multi Sorting",
                Category = "Sorting",
                Directory = "Grid/DataGrid",
                Url = "datagrid/sorting",
                FileName = "Sorting.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Custom Sorting",
                Category = "Sorting",
                Directory = "Grid/DataGrid",
                Url = "datagrid/customsorting",
                FileName = "CustomSorting.razor",
                Type = SampleType.New,
                NotificationDescription = new string[] {
                    @"Added a demo to customize the default sort action in column-wise manner."
                }
            },
            new Sample
            {
                Name = "Default Filtering",
                Category = "Filtering",
                Directory = "Grid/DataGrid",
                Url = "datagrid/filtering",
                FileName = "Filtering.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Menu Filter",
                Category = "Filtering",
                Directory = "Grid/DataGrid",
                Url = "datagrid/filter-menu",
                FileName = "FilterMenu.razor",
                Type = SampleType.None
            },
             new Sample
            {
                Name = "Checkbox Filter",
                Category = "Filtering",
                Directory = "Grid/DataGrid",
                Url = "datagrid/checkbox-filter",
                FileName = "FilterCheckbox.razor",
                Type = SampleType.None
            },
             new Sample
            {
                Name = "Excel Like Filter",
                Category = "Filtering",
                Directory = "Grid/DataGrid",
                Url = "datagrid/excel-like-filter",
                FileName = "FilterExcel.razor",
                Type = SampleType.None
            },
            new Sample
            {
               Name = "Search",
               Category = "Filtering",
               Directory = "Grid/DataGrid",
               Url = "datagrid/search",
               FileName = "Search.razor",
               Type = SampleType.None
            },
            new Sample
            {
                Name = "Paging",
                Category = "Paging",
                Directory = "Grid/DataGrid",
                Url = "datagrid/paging",
                FileName = "Paging.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Pager Template",
                Category = "Paging",
                Directory = "Grid/DataGrid",
                Url = "datagrid/pager-template",
                FileName = "PagerTemplate.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Default Selection",
                Category = "Selection",
                Directory = "Grid/DataGrid",
                Url = "datagrid/selection",
                FileName = "Selection.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Checkbox Selection",
                Category = "Selection",
                Directory = "Grid/DataGrid",
                Url = "datagrid/checkbox-selection",
                FileName = "CheckboxSelection.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Default Aggregate",
                Category = "Aggregates",
                Directory = "Grid/DataGrid",
                Url = "datagrid/aggregate",
                FileName = "Aggregate.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Group and Caption Aggregate",
                Category = "Aggregates",
                Directory = "Grid/DataGrid",
                Url = "datagrid/group-and-caption-aggregate",
                FileName = "GroupAndCaptionAggregate.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Default Exporting",
                Category = "Exporting",
                Directory = "Grid/DataGrid",
                Url = "datagrid/exporting",
                FileName = "Exporting.razor",
                Type = SampleType.None
            },
             new Sample
            {
                Name = "Advanced Exporting",
                Category = "Exporting",
                Directory = "Grid/DataGrid",
                Url = "datagrid/advanced-exporting",
                FileName = "AdvancedExporting.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Print",
                Category = "Exporting",
                Directory = "Grid/DataGrid",
                Url = "datagrid/print",
                FileName = "Print.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Grouping",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/grouping",
                FileName = "Grouping.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Column Template",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/column-template",
                FileName = "ColumnTemplate.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Row Template",
                Category = "Rows",
                Directory = "Grid/DataGrid",
                Url = "datagrid/row-template",
                FileName = "GridRowTemplate.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Detail Template",
                Category = "Rows",
                Directory = "Grid/DataGrid",
                Url = "datagrid/detail-template",
                FileName = "GridDetailTemplate.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Header Template",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/header-template",
                FileName = "GridHeaderTemplate.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Clipboard",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/clipboard",
                FileName = "Clipboard.razor",
                Type = SampleType.None
            },

            new Sample
            {
                Name = "Row Height",
                Category = "Rows",
                Directory = "Grid/DataGrid",
                Url = "datagrid/row-height",
                FileName = "RowHeight.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Data Annotation",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/data-annotation",
                FileName = "DataAnnotation.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Frozen Rows and Columns",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/frozen-rows",
                FileName = "FrozenRowsAndColumns.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Show or Hide Column",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/show-or-hide-column",
                FileName = "ShoworHideColumn.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Foreign Key Column",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/foreign-key-column",
                FileName = "ForeignKeyColumn.razor",
                Type = SampleType.Updated,
                NotificationDescription = new string[] {
                    @"Updated a sample with sorting the foreign-key column based on text values instead of the field.",
                }
            },
            new Sample
            {
                Name = "Observable Collection",
                Category = "Data Binding",
                Directory = "Grid/DataGrid",
                Url = "datagrid/observable-binding",
                FileName="ObservableBinding.razor",
				Type = SampleType.None
            },
            new Sample
            {
                Name = "Hierarchy Grid",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/hierarchy-grid",
                FileName = "HierarchyGrid.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Master Detail",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/master-details",
                FileName = "MasterDetails.razor",
                MetaTitle = "Blazor Master Detail Grid Example - Syncfusion Demos",
                HeaderText = "Blazor Master Detail Grid Example",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "ExpandoObject Binding",
                Category = "Data Binding",
                Directory = "Grid/DataGrid",
                Url = "datagrid/expandoobject",
                FileName = "GridExpandoObject.razor",
                Type = SampleType.None
            },
             new Sample
            {
                Name = "DynamicObject Binding",
                Category = "Data Binding",
                Directory = "Grid/DataGrid",
                Url = "datagrid/dynamicobject",
                FileName = "GridDynamicObject.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Keyboard Navigation",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/keyboard-navigation",
                FileName = "KeyboardNavigation.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Adaptive",
                Category = "DataGrid",
                Directory = "Grid/DataGrid",
                Url = "datagrid/adaptive-rendering",
                FileName = "AdaptiveRendering.razor",
                Type = SampleType.New,
                NotificationDescription = new string[] {
                    @"Added a demo to showcase adaptive view of the DataGrid component that provides optimal viewing experience in all devices.",
                }
            },
             new Sample
            {
                Name = "Cell Formatting",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/cell-formatting",
                FileName = "Cellformatting.razor",
                Type = SampleType.None
            },
              new Sample
            {
                Name = "External Form Editing",
                Category = "Editing",
                Directory = "Grid/DataGrid",
                Url = "datagrid/external-form-editing",
                FileName = "ExternalFormEditing.razor",
                Type = SampleType.None
            },
              new Sample
            {
                Name = "Custom Validation",
                Category = "Editing",
                Directory = "Grid/DataGrid",
                Url = "datagrid/custom-validation",
                FileName = "CustomValidation.razor",
                Type = SampleType.None
            },

              new Sample
            {
                Name = "Virtual Mask Row",
                Category = "Scrolling",
                Directory = "Grid/DataGrid",
                Url = "datagrid/virtual-mask-row",
                FileName = "VirtualMaskRow.razor",
                Type = SampleType.None
            },
            new Sample
            {
                Name = "Custom Command",
                Category = "Columns",
                Directory = "Grid/DataGrid",
                Url = "datagrid/custom-command",
                FileName = "CustomCommand.razor",
                Type = SampleType.None
            },


        };
    }
}
