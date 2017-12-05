using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using StartFolio.DAL;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using StartFolio.Models;

namespace StartFolio.Controllers
{
    [Produces("application/json")]
    [Route("api/Pages")]
    public class PageController : Controller
    {
        private readonly IPageRepository pageRepository;
        IHostingEnvironment appEnvironment;

        public PageController(IPageRepository repository, IHostingEnvironment environment)
        {
            pageRepository = repository;
            appEnvironment = environment;
        }

        // GET: api/Pages
        [HttpGet]
        public async Task<IEnumerable<Page>> GetAsync()
        {
            return await pageRepository.GetPagesAsync();
        }

        // GET: api/Pages/5
        [HttpGet("{id}")]
        public async Task<Page> GetPage(int id)
        {
            return await pageRepository.GetPage(id.ToString());
        }
        
        // POST: api/Pages
        [HttpPost]
        public IActionResult Post([FromBody]Page page)
        {
            if (page == null)
            {
                return BadRequest();
            }         
            pageRepository.AddPage(page);
            return Ok(page);
        }

        // POST: api/Pages/Images
        [HttpPost("/Images")]
        public async Task<IActionResult> UploadImagesAsync(IFormFileCollection uploads)
        {
            foreach (var uploadedFile in uploads)
            {
                // путь к папке Files
                string path = "/Images/" + uploadedFile.FileName;
                // сохраняем файл в папку Files в каталоге wwwroot
                using (var fileStream = new FileStream(appEnvironment.WebRootPath + path, FileMode.Create))
                {
                    await uploadedFile.CopyToAsync(fileStream);
                }
            }
            return Ok();
        }


        // PUT: api/Pages/5/Position
        [HttpPut("{id}/Position")]
        public IActionResult UpdatePosition(int id, int position)
        {
            pageRepository.UpdatePagePosition(id.ToString(), position);
            return Ok();
        }

        // PUT: api/Pages/5/Details
        [HttpPut("{id}/Details")]
        public IActionResult UpdateDetails(int id, string details)
        {
            pageRepository.UpdatePageDetails(id.ToString(), details);
            return Ok();
        }

        // DELETE: api/Pages/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            pageRepository.RemovePage(id.ToString());
            return Ok();
        }
    }
}
