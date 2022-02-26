namespace WebApi.Common.Constants
{
    public class ErrorCodes
    {
        public const string NotSupported = nameof(NotSupported);
        public const string InvalidRefreshToken = nameof(InvalidRefreshToken);
        public const string RefreshTokenExpired = nameof(RefreshTokenExpired);
        public const string Required = nameof(Required);
        public const string InvalidEmailAddress = nameof(InvalidEmailAddress);
        public const string MinLength = nameof(MinLength);
        public const string MaxLength = nameof(MaxLength);
        public const string MustBeUnique = nameof(MustBeUnique);
        public const string MustNotBeEmpty = nameof(MustNotBeEmpty);
        public const string InvalidLoginCredentials = nameof(InvalidLoginCredentials);
    }
}
