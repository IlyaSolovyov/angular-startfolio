using StartFolio.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StartFolio.DAL
{
    interface IAccountRepository
    {
        Task<Account> GetPage(string id);
        Task AddPage(Page item);
        Task<DeleteResult> RemovePage(string id);
        Task<UpdateResult> UpdatePage(string id, string body);
    }
}
