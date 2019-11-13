using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using adaptivecards_templates_core.Models;
using System.IO;

namespace adaptivecards_templates_core.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public async Task<IActionResult> GetTemplate()
        {
            try
            {
                // Use Request Path, add .json extension if its not there
                var templateSearchName = Request.Path.Value.EndsWith(".json") ? Request.Path.Value : Request.Path.Value + ".json";

                // Check if file exists
                if (System.IO.File.Exists(templateSearchName))
                {
                    using (StreamReader sr = new StreamReader($".\\templates{templateSearchName}"))
                    {
                        // Read the stream to a string, and write the string to the console.
                        String templateFile = await sr.ReadToEndAsync();
                        return Ok(templateFile);
                    }
                }

                return NotFound();
            }
            catch(Exception ex)
            {
                return BadRequest();
            }
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
