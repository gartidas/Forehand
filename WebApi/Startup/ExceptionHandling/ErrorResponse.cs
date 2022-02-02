using System.Collections.Generic;

namespace WebApi.Startup.ExceptionHandling
{
    public class ErrorResponse
    {
        public string ErrorCode { get; set; }

        public string ErrorMessage { get; set; }

        public List<ErrorDetail> ErrorDetails { get; set; }

        public ErrorResponse()
        {
            ErrorDetails = new List<ErrorDetail>();
        }
    }

    public class ErrorDetail
    {
        public string PropertyName { get; set; }

        public string Message { get; set; }

        public string Code { get; set; }

        public object CustomState { get; set; }
    }
}
