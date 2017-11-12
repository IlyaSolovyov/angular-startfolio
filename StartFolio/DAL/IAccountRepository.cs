using MongoDB.Driver;
using StartFolio.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StartFolio.DAL
{
    public interface IAccountRepository
    {
        Task<Account> GetAccount(string id);
        Task AddAccount(Account item);
        Task<DeleteResult> RemoveAccount(string id);
        Task<UpdateResult> UpdatePassword(string id, string password);
    }
}
