using System;

namespace WebApi.Common.Exceptions
{
    public class Forbidden403Exception : Exception
    {
        public Forbidden403Exception(string message = "") : base(message)
        {
        }
    }
}
