using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StartFolio.DAL;
using System.IO;
using Microsoft.AspNetCore.Hosting;

namespace StartFolio.Controllers
{
    [Produces("application/json")]
    [Route("api/Page")]
    public class PageController : Controller
    {
        private readonly IPageRepository pageRepository;
        IHostingEnvironment appEnvironment;

        public PageController(IPageRepository repository, IHostingEnvironment appEnvironment)
        {
            pageRepository = repository;
            appEnvironment = appEnvironment;
        }

        // GET: api/Page
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Page/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }
        
        // POST: api/Page
        [HttpPost]
        public void Post([FromBody]string value)
        {
        }

        // POST: api/Page/Images
        [HttpPost]
        public async Task<IActionResult> UploadImagesAsync(IFormFileCollection uploads)
        {
            foreach (var uploadedFile in uploads)
            {
                // путь к папке Files
                string path = "/Files/" + uploadedFile.FileName;
                // сохраняем файл в папку Files в каталоге wwwroot
                using (var fileStream = new FileStream(appEnvironment.WebRootPath + path, FileMode.Create))
                {
                    await uploadedFile.CopyToAsync(fileStream);
                }
            }
            return;
        }

        // GET: api/Page/Images
        [HttpGet]
        public IEnumerable<string> GetImages(int id)
        {
            return new string[] { "image1", "image2" };
        }

        // PUT: api/Page/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody]string value)
        {
        }
        
        // DELETE: api/Page/Delete/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
