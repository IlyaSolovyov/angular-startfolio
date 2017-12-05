using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using StartFolio.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StartFolio.Models
{
    public class Account
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }
        public string Password { get; set; } = SecurePasswordHasher.Hash("Admin");
        public string Role { get; set; } = "Admin";
        public DateTime LastPasswordUpdate { get; set; } = DateTime.Now;
    }
}
