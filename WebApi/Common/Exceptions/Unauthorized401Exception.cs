using System;

namespace WebApi.Common.Exceptions
{
    public class Unauthorized401Exception : Exception
    {
        public Unauthorized401Exception(string message = "") : base(message)
        {
        }
    }
}
