using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace adaptivecards_templates_core.Models
{
    public class TemplateList
    {
        [JsonProperty("path", NullValueHandling = NullValueHandling.Ignore)]
        public string Path { get; set; }
        [JsonProperty("name", NullValueHandling = NullValueHandling.Ignore)]
        public string Name { get; set; }
        [JsonProperty("templates", NullValueHandling = NullValueHandling.Ignore)]
        public List<TemplateList> Templates { get; set; }
    }
}
