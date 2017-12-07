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
    [Route("api/[controller]")]
    public class PageController : Controller
    {
        private readonly IPageRepository pageRepository;
        IHostingEnvironment appEnvironment;

        public PageController(IPageRepository repository, IHostingEnvironment environment)
        {
            pageRepository = repository;
            appEnvironment = environment;
        }

        // GET: api/Page
        [HttpGet]
        public async Task<IEnumerable<Page>> GetAsync()
        {
            return await pageRepository.GetPagesAsync();
        }

        // GET: api/Page/5
        [HttpGet("{id}")]
        public Page GetPage(int id)
        {
            return new Page();
            //return await pageRepository.GetPage(id.ToString());
        }

        // POST: api/Page/
        [HttpPost]
        public async Task<IActionResult> UploadMultipart([FromForm]Page page, IFormFileCollection uploads)
        {
            if (page == null)
            {
                return BadRequest();
            }
            foreach (var uploadedFile in uploads)
            {
                string oldFilename = uploadedFile.FileName;
                string newFilename = Guid.NewGuid().ToString();
                page.Details = page.Details.Replace(oldFilename, newFilename);
                // путь к папке Files             
                string path = "/Images/" + newFilename;
                // сохраняем файл в папку Files в каталоге wwwroot
                using (var fileStream = new FileStream(appEnvironment.WebRootPath + path, FileMode.Create))
                {
                    await uploadedFile.CopyToAsync(fileStream);
                }
            }          
            await pageRepository.AddPage(page);
            return Ok(uploads.Count);
        }

        // PUT: api/Page/5/Position
        [HttpPut("{id}/Position")]
        public async Task<IActionResult> UpdatePositionAsync(string currentId, string swappedId)
        {
            int newCurrentPosition = (await pageRepository.GetPage(swappedId)).Position;
            int newSwappedPosition = (await pageRepository.GetPage(currentId)).Position;

            await pageRepository.UpdatePagePosition(currentId.ToString(), newCurrentPosition);
            await pageRepository.UpdatePagePosition(swappedId.ToString(), newSwappedPosition);

            return Ok();
        }

        // PUT: api/Page/5/Details
        [HttpPut("{id}/Details")]
        public IActionResult UpdateDetails(int id, string details)
        {
            pageRepository.UpdatePageDetails(id.ToString(), details);
            return Ok();
        }

        // DELETE: api/Page/5
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            pageRepository.RemovePage(id.ToString());
            return Ok();
        }
    }
}
