using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace adaptivecards_templates_core.Services.Interfaces
{
    public interface ITemplateResolver
    {
        Task<string> GetTemplateAsync(string name,bool getDataFile);
        Task<string> ListTemplatesAsync(string filter);
        Task<string> FindTemplateAsync(string data);
        Task<bool> UpdateTemplateAsync(string name, string template);

    }
}
