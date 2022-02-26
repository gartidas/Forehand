using System.Text.Json.Serialization;

namespace WebApi.Features.Auth
{
    public class AuthResponse
    {
        public string AccessToken { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }
    }
}
