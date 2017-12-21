using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using StartFolio.Models;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;
using MongoDB.Bson;

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

        public async Task<Page> GetPage(int position)
        {
            var filter = Builders<Page>.Filter.Eq("Position", position);
            var page = await context.Pages
                                 .Find(filter)
                                 .FirstOrDefaultAsync();
            return page;
        }

        public async Task<DeleteResult> RemovePage(string id)
        {
            int deletedElementPosition = context.Pages.Find(page => page.Id == id).First().Position;
            DeleteResult result = await context.Pages.DeleteOneAsync(
                     Builders<Page>.Filter.Eq("Id", id));
            for (int i = deletedElementPosition + 1; i <= (context.Pages.Count(new BsonDocument()) + 1); i++)
            {
                var filter = Builders<Page>.Filter.Eq(s => s.Position, i);
                var update = Builders<Page>.Update
                                    .Set(s => s.Position, i - 1);
                await context.Pages.UpdateOneAsync(filter, update);
            }
            return result;
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
            return await context.Pages.Find(_ => true).SortBy(x=> x.Position).ToListAsync();
        }
    }
}
