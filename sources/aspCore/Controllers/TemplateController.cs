using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using adaptivecards_templates_core.Models;
using System.IO;
using Newtonsoft.Json;
using System.Text.RegularExpressions;
using adaptivecards_templates_core.Services.Interfaces;

namespace adaptivecards_templates_core.Controllers
{
    public class TemplateController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ITemplateResolver _resolver;

        public TemplateController(ILogger<HomeController> logger, ITemplateResolver resolver)
        {
            _logger = logger;
            _resolver = resolver;
        }

        public async Task<IActionResult> GetTemplateAsync()
        {
            return Ok(await _resolver.GetTemplateAsync(Request.Path.Value, false));
        }

        public async Task<IActionResult> ListTemplates()
        {
            try
            {
                return Ok(await _resolver.ListTemplatesAsync(""));
            }
            catch (Exception ex)
            {
                return NotFound();
            }
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
