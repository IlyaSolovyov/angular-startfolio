using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using StartFolio.Models;
using Microsoft.IdentityModel.Tokens;
using StartFolio.DAL;
using StartFolio.Services;
using Newtonsoft.Json;

namespace StartFolio.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AccountController : Controller
    {
        private readonly IAccountRepository accountRepository;

        public AccountController(IAccountRepository repository)
        {
            accountRepository = repository;
            if (accountRepository.GetAccount() == null)
            {
                accountRepository.AddAccount(new Account());
            }
        }

        // GET: api/Accounts/Token
        [HttpPost]
        public async Task Token()
        {
            string password = Request.Form["password"];
            ClaimsIdentity identity = GetIdentityAsync(password);
            if (identity == null)
            {
                Response.StatusCode = 400;
                await Response.WriteAsync("Invalid password.");
                return;
            }

            DateTime now = DateTime.UtcNow;
            // создаем JWT-токен
            JwtSecurityToken jwt = new JwtSecurityToken(
                    issuer: AuthOptions.ISSUER,
                    audience: AuthOptions.AUDIENCE,
                    notBefore: now,
                    claims: identity.Claims,
                    expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            string encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            var response = new
            {
                access_token = encodedJwt,
                username = identity.Name
            };

            // сериализация ответа
            Response.ContentType = "application/json";
            await Response.WriteAsync(JsonConvert.SerializeObject(response, new JsonSerializerSettings { Formatting = Formatting.Indented }));
        }

        private ClaimsIdentity GetIdentityAsync(string password)
        {
            // Account account = await GetAdminAccountInternal();
            Account account = new Account();
            if (account != null)
            {
                if (SecurePasswordHasher.Verify(password, account.Password))
                {
                    var claims = new List<Claim>();
                    claims.Add(new Claim(ClaimsIdentity.DefaultNameClaimType, account.Id.ToString()));
                    claims.Add(new Claim(ClaimsIdentity.DefaultRoleClaimType, account.Role));
                    ClaimsIdentity claimsIdentity =
                    new ClaimsIdentity(claims, "Token", ClaimsIdentity.DefaultNameClaimType,
                        ClaimsIdentity.DefaultRoleClaimType);
                    return claimsIdentity;
                }
               
            }
            // если пользователя не найдено
            return null;
        }

        private async Task<Account> GetAdminAccountInternal()
        {
            return await accountRepository.GetAccount();
        }
    }
}
