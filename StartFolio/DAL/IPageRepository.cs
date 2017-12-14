using MongoDB.Driver;
using StartFolio.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StartFolio.DAL
{
    public interface IPageRepository
    {
        Task<IEnumerable<Page>> GetPagesAsync();
        Task<Page> GetPage(int position); 
        Task AddPage(Page item);
        Task<DeleteResult> RemovePage(string id);
        Task<UpdateResult> UpdatePagePosition(string id, int position);
        Task<UpdateResult> UpdatePageDetails(string id, string details);
    }
}
