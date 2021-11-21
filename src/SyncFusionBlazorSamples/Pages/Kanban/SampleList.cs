﻿using System.Collections.Generic;

namespace BlazorDemos
{
    internal partial class SampleConfig
    {
        public List<Sample> Kanban { get; set; } = new List<Sample>{
            new Sample
            {
                Name = "Overview",
                Category = "Kanban",
                Directory = "Kanban/Kanban",
                Url = "kanban/overview",
                FileName = "Overview.razor"
            },
            new Sample
            {
                Name = "Default Functionalities",
                Category = "Kanban",
                Directory = "Kanban/Kanban",
                Url = "kanban/default-functionalities",
                FileName = "DefaultFunctionalities.razor"
            },
            new Sample
            {
                Name = "Swimlane",
                Category = "Kanban",
                Type = SampleType.None,
                Directory = "Kanban/Kanban",
                Url = "kanban/swimlane",
                FileName = "Swimlane.razor"
            },
            new Sample
            {
                Name = "Workflow",
                Category = "Kanban",
                Directory = "Kanban/Kanban",
                Url = "kanban/workflow",
                FileName = "Workflow.razor"
            },
            new Sample
            {
                Name = "Stacked Header",
                Category = "Kanban",
                Directory = "Kanban/Kanban",
                Url = "kanban/stacked-header",
                FileName = "StackedHeader.razor"
            },
            new Sample
            {
                Name = "Dialog Editing",
                Category = "Kanban",
                Directory = "Kanban/Kanban",
                Url = "kanban/dialog-editing",
                FileName = "DialogEditing.razor"
            },
            new Sample
            {
                Name = "Search and Filter Cards",
                Category = "Kanban",
                Directory = "Kanban/Kanban",
                Url = "kanban/search-filter",
                FileName = "SearchFilter.razor"
            },
            new Sample
            {
                Name = "Local Data",
                Category = "Data Binding",
                Directory = "Kanban/Kanban",
                Url = "kanban/local-data",
                FileName = "LocalData.razor"
            },
            new Sample
            {
                Name = "Remote Data",
                Category = "Data Binding",
                Directory = "Kanban/Kanban",
                Url = "kanban/remote-data",
                FileName = "RemoteData.razor"
            },
            new Sample
            {
                Name = "Observable Collection",
                Category = "Data Binding",
                Directory = "Kanban/Kanban",
                Url = "kanban/observable",
                FileName = "KanbanObservable.razor",
                Type = SampleType.New,
                NotificationDescription = new string[] {
                    @"Added a demo to showcase Observable collection data binding of the Kanban component."
                }
            },
            new Sample
            {
                Name = "ExpandoObject Binding",
                Category = "Data Binding",
                Directory = "Kanban/Kanban",
                Url = "kanban/expando-object",
                FileName = "KanbanExpandoObject.razor",
                Type = SampleType.New,
                NotificationDescription = new string[] {
                    @"Added a demo to showcase dynamic data binding (Expando Object) of the Kanban component."
                }
            },
            new Sample
            {
                Name = "DynamicObject Binding",
                Category = "Data Binding",
                Directory = "Kanban/Kanban",
                Url = "kanban/dynamic-object",
                FileName = "KanbanDynamicObject.razor",
                Type = SampleType.New,
                NotificationDescription = new string[] {
                    @"Added a demo to showcase dynamic data binding (Dynamic Object) of the Kanban component."
                }
            },
            new Sample
            {
                Name = "Header Template",
                Category = "Templates",
                Directory = "Kanban/Kanban",
                Url = "kanban/header-template",
                FileName = "HeaderTemplate.razor"
            },
            new Sample
            {
                Name = "Swimlane Template",
                Category = "Templates",
                Directory = "Kanban/Kanban",
                Url = "kanban/swimlane-template",
                FileName = "SwimlaneTemplate.razor"
            },
            new Sample
            {
                Name = "Card Template",
                Category = "Templates",
                Directory = "Kanban/Kanban",
                Url = "kanban/card-template",
                FileName = "CardTemplate.razor"
            },
            new Sample
            {
                Name = "Tooltip Template",
                Category = "Templates",
                Directory = "Kanban/Kanban",
                Url = "kanban/tooltip-template",
                FileName = "TooltipTemplate.razor"
            },
            new Sample
            {
                Name = "Toggle Columns",
                Category = "Columns",
                Directory = "Kanban/Kanban",
                Url = "kanban/toggle-columns",
                FileName = "ToggleColumns.razor"
            },
            new Sample
            {
                Name = "Show/Hide Columns",
                Category = "Columns",
                Directory = "Kanban/Kanban",
                Url = "kanban/showhide-columns",
                FileName = "ShowHideColumns.razor"
            },
            new Sample
            {
                Name = "WIP Validation",
                Category = "Validation",
                Directory = "Kanban/Kanban",
                Url = "kanban/wip-validation",
                FileName = "WipValidation.razor"
            },
            new Sample
            {
                Name = "API",
                Category = "Miscellaneous",
                Directory = "Kanban/Kanban",
                Url = "kanban/api",
                FileName = "Api.razor"
            },
            new Sample
            {
                Name = "Events",
                Category = "Miscellaneous",
                Directory = "Kanban/Kanban",
                Url = "kanban/events",
                FileName = "Events.razor"
            }
        };
    }
}