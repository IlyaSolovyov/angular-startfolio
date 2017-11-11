using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StartFolio.Models
{
    public class Page
    {
        [BsonId]
        public string Id { get; set; }
        public int Position { get; set; }
        public string PageTemplate { get; set; }
        public string Details { get; set; }
    }
}
