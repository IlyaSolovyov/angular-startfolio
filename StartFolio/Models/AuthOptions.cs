using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StartFolio.Models
{
    public class AuthOptions
    {
        public const string ISSUER = "StartFolio"; // издатель токена
        public const string AUDIENCE = "Admin@StartFolio"; // потребитель токена
        const string KEY = "JU3lpV3QPW0HXw2IA1DGjjQPuHRJ51RbqdQH4EbFFXsfsX3NgzwSMJUolQSDPm6";   // ключ для шифрации
        public const int LIFETIME = 60*24; // время жизни токена - 1 день
        public static SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
        }
    }
}
