using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StartFolio.Models
{
    public class Page
    {
        static int pageCount=0;

        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; } = pageCount++.ToString();
        public int Position { get; set; }
        public string PageTemplate { get; set; }
        public string Details { get; set; }
    }
}
