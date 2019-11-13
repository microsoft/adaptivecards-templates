using adaptivecards_templates_core.Models;
using adaptivecards_templates_core.Services.Interfaces;
using Microsoft.Extensions.Caching.Memory;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace adaptivecards_templates_core.Services
{
    public class CachedPathResolver : ITemplateResolver
    {
        public IMemoryCache _cache;

        public CachedPathResolver(IMemoryCache memCache)
        {
            _cache = memCache;
        }

        /// <summary>
        /// Get a template by full name + path
        /// </summary>
        /// <param name="name">template path eg github.com/template.json</param>
        /// <returns></returns>
        public async Task<string> GetTemplateAsync(string name, bool getDataFile = false)
        {
            try
            {
                var findExt = getDataFile ? ".data.json" : ".json";
                var templateSearchName = name.Contains(".json") ? name.Replace(".json",findExt) : $"{name}{findExt}";
                var template = string.Empty;
                var isCached = _cache.TryGetValue(templateSearchName,out template);

                if (string.IsNullOrEmpty(template))
                {
                    using (StreamReader sr = new StreamReader($".\\templates{templateSearchName}"))
                    {
                        template = await sr.ReadToEndAsync();
                        _cache.Set(templateSearchName, template);
                        return template;
                    }
                }
                return template;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> FindTemplateAsync(string data)
        {
            throw new NotImplementedException();
        }

        public async Task<string> ListTemplatesAsync(string filter)
        {
            try
            {
                var templateRoot = ".\\templates";
                var list = await GetChildren(templateRoot);
                return JsonConvert.SerializeObject(list, Formatting.Indented);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> UpdateTemplateAsync(string name, string template)
        {
            throw new NotImplementedException();
        }

        public async Task<List<TemplateList>> GetChildren(string path)
        {
            var list = new List<TemplateList>();
            var children = System.IO.Directory.EnumerateFileSystemEntries(path).ToList();
            children.ForEach(async delegate (String name)
            {
                try
                {
                    var fileName = GrabFileName(name);

                    if (string.IsNullOrEmpty(fileName))
                    {
                        list.Add(new TemplateList()
                        {
                            Path = name.Replace(".\\templates\\", "").Replace(@"\\", @"\"),
                            Templates = name.Contains(".json") ? null : await GetChildren(name)
                        });
                    }
                    else
                    {
                        list.Add(new TemplateList()
                        {
                            Path = name.Replace(".\\templates\\", "").Replace(@"\\", @"\"),
                            Name = fileName
                        });
                    }
                }
                catch (Exception ex)
                {
                    list.Add(new TemplateList()
                    {
                        Path = path.Replace(".\\templates\\", "").Replace(@"\\", @"\"),
                        Name = "Error parsing path"
                    });
                }



            });
            return list;
        }

        public string GrabFileName(string filename)
        {
            string[] temparray = filename.Split('\\');
            var file = temparray[temparray.Length - 1];
            if (file.Contains(".json")) return file;
            return "";
        }
    }
}
