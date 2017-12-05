using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using StartFolio.Models;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;

namespace StartFolio.DAL
{
    public class PageRepository : IPageRepository
    {
        private readonly DatabaseContext context = null;

        public PageRepository(IOptions<DbConnectionSettings> settings)
        {
            context = new DatabaseContext(settings);
        }

        public async Task AddPage(Page item)
        {
            await context.Pages.InsertOneAsync(item);
        }

        public async Task<Page> GetPage(string id)
        {
            var filter = Builders<Page>.Filter.Eq("Id", id);
            return await context.Pages
                                 .Find(filter)
                                 .FirstOrDefaultAsync();
        }

        public async Task<DeleteResult> RemovePage(string id)
        {
            return await context.Pages.DeleteOneAsync(
                     Builders<Page>.Filter.Eq("Id", id));
        }
        public async Task<UpdateResult> UpdatePagePosition(string id, int position)
        {
            var filter = Builders<Page>.Filter.Eq(s => s.Id, id);
            var update = Builders<Page>.Update
                                .Set(s => s.Position, position);
            return await context.Pages.UpdateOneAsync(filter, update);
        }

        public async Task<UpdateResult> UpdatePageDetails(string id, string details)
        {
            var filter = Builders<Page>.Filter.Eq(s => s.Id, id);
            var update = Builders<Page>.Update
                                .Set(s => s.Details, details);
            return await context.Pages.UpdateOneAsync(filter, update);
        }

        public async Task<IEnumerable<Page>> GetPagesAsync()
        {
            return await context.Pages.Find(_ => true).ToListAsync();
        }
    }
}
