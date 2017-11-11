using Microsoft.Extensions.Options;
using MongoDB.Driver;
using MongoDB.Driver.GridFS;
using StartFolio.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StartFolio.DAL
{
    public class DatabaseContext
    {
        IMongoDatabase database; // база данных
        IGridFSBucket gridFS;   // файловое хранилище

        public DatabaseContext(IOptions<DbConnectionSettings> settings)
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            if (client != null)
                database = client.GetDatabase(settings.Value.Database);
            gridFS = new GridFSBucket(database);
        }

        public IMongoCollection<Account> Account
        {
            get
            {
                return database.GetCollection<Account>("Account");
            }
        }

        public IMongoCollection<Page> Pages
        {
            get
            {
                return database.GetCollection<Page>("Page");
            }
        }

    }
}
