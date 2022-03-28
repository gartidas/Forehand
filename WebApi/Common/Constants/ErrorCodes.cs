namespace WebApi.Common.Constants
{
    public class ErrorCodes
    {
        public const string NotSupported = nameof(NotSupported);
        public const string InvalidRefreshToken = nameof(InvalidRefreshToken);
        public const string RefreshTokenExpired = nameof(RefreshTokenExpired);
        public const string Required = nameof(Required);
        public const string InvalidEmailAddress = nameof(InvalidEmailAddress);
        public const string InvalidPassword = nameof(InvalidPassword);
        public const string MinLength = nameof(MinLength);
        public const string MaxLength = nameof(MaxLength);
        public const string MustBeUnique = nameof(MustBeUnique);
        public const string MustNotBeEmpty = nameof(MustNotBeEmpty);
        public const string InvalidLoginCredentials = nameof(InvalidLoginCredentials);
        public const string RegistrationNotConfirmed = nameof(RegistrationNotConfirmed);
        public const string InvalidId = nameof(InvalidId);
        public const string AlreadyExists = nameof(AlreadyExists);
        public const string DoesNotExist = nameof(DoesNotExist);
        public const string MinimalValue = nameof(MinimalValue);
        public const string MaximalValue = nameof(MaximalValue);
        public const string MustBeInThePast = nameof(MustBeInThePast);
        public const string MustBeInTheFuture = nameof(MustBeInTheFuture);
        public const string MustBeAfterStartDate = nameof(MustBeAfterStartDate);
        public const string ReservationForThisDateNotValid = nameof(ReservationForThisDateNotValid);
    }
}
