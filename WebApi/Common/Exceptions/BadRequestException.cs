using System;
using System.Collections.Generic;

namespace WebApi.Common.Exceptions
{
    public class BadRequestException : Exception
    {
        public BadRequestException(string message = null) : base(message)
        {
        }

        public BadRequestException(IEnumerable<string> messages)
            : base(string.Join($"{Environment.NewLine}", messages))
        {
        }
    }
}
