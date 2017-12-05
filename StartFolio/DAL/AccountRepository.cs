using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Driver;
using StartFolio.Models;
using Microsoft.Extensions.Options;

namespace StartFolio.DAL
{
    public class AccountRepository : IAccountRepository
    {
        private readonly DatabaseContext context = null;

        public AccountRepository(IOptions<DbConnectionSettings> settings)
        {
            context = new DatabaseContext(settings);
        }

        public async Task AddAccount(Account item)
        {
            await context.Accounts.InsertOneAsync(item);
        }

        public async Task<Account> GetAccount()
        {
            return await context.Accounts
                                 .Find(_ => true)
                                 .FirstOrDefaultAsync();
        }



        public async Task<DeleteResult> RemoveAccount(string id)
        {
            return await context.Accounts.DeleteOneAsync(
                 Builders<Account>.Filter.Eq("Id", id));
        }

        public async Task<UpdateResult> UpdatePassword(string id, string password)
        {
            var filter = Builders<Account>.Filter.Eq(s => s.Id, id);
            var update = Builders<Account>.Update
                                .Set(s => s.Password, password)
                                .CurrentDate("LastPasswordUpdate");
            return await context.Accounts.UpdateOneAsync(filter, update);
        }
    }
}
