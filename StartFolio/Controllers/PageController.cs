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
        [HttpGet("{position}")]
        public async Task<Page> GetPageAsync(int position)
        {
            return await pageRepository.GetPage(position);
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
                string newFilename = Guid.NewGuid().ToString() + "." + uploadedFile.FileName.Split('.').Last();
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
            return Ok("Page succesfully added.");
        }

        // PUT: api/Page/Position
        [HttpPut("{currentPosition}/position")]
        public async Task<IActionResult> UpdatePositionAsync(int currentPosition, [FromForm]int newPosition )
        {
          //  int currentPosition = Int32.Parse(data["currentPosition"]);
          //  int newPosition = Int32.Parse(data["newPosition"]);
            Page thisPage = await pageRepository.GetPage(currentPosition);
            Page swappedWithPage = await pageRepository.GetPage(newPosition);

            if (thisPage==null || swappedWithPage == null)
            {
                return Ok(0);
            }
            await pageRepository.UpdatePagePosition(thisPage.Id, newPosition);
            await pageRepository.UpdatePagePosition(swappedWithPage.Id, currentPosition);

            return Ok(1);

        }

        // PUT: api/Page/5/Details
        [HttpPut("{position}/Details")]
        public async Task<IActionResult> UpdateDetailsAsync(int position, [FromForm] string details, IFormFileCollection uploads)
        {
            foreach (var uploadedFile in uploads)
            {
                string oldFilename = uploadedFile.FileName;
                string newFilename = Guid.NewGuid().ToString() + "." + uploadedFile.FileName.Split('.').Last();
                details = details.Replace(oldFilename, newFilename);
                // путь к папке Files             
                string path = "/Images/" + newFilename;
                // сохраняем файл в папку Files в каталоге wwwroot
                using (var fileStream = new FileStream(appEnvironment.WebRootPath + path, FileMode.Create))
                {
                    await uploadedFile.CopyToAsync(fileStream);
                }
            }

            Page page = await pageRepository.GetPage(position);
            await pageRepository.UpdatePageDetails(page.Id, details);
            return Ok();
        }

        // DELETE: api/Page/5
        [HttpDelete("{position}")]
        public async Task<IActionResult> DeleteAsync(int position)
        {
            Page page = await pageRepository.GetPage(position);
            await pageRepository.RemovePage(page.Id);
            return Ok();
        }
    }
}
