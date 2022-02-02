﻿using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Net;
using System.Threading.Tasks;
using WebApi.Common.Exceptions;

namespace WebApi.Startup.ExceptionHandling
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionHandlingMiddleware> _logger;

        public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            var code = HttpStatusCode.BadRequest;
            ErrorResponse errorResponse;

            switch (exception)
            {
                case BadRequestException _:
                    errorResponse = ErrorResponseFactory.CreateBadRequestErrorResponse(exception.Message);
                    break;
                case NotFoundException _:
                    code = HttpStatusCode.NotFound;
                    errorResponse = ErrorResponseFactory.CreateNotFoundErrorResponse(exception.Message);
                    break;
                case Unauthorized401Exception _:
                    code = HttpStatusCode.Unauthorized;
                    errorResponse = ErrorResponseFactory.CreateUnauthorizedn401Response(exception.Message);
                    break;
                case Forbidden403Exception _:
                    code = HttpStatusCode.Forbidden;
                    errorResponse = ErrorResponseFactory.CreateForbiden403Response(exception.Message);
                    break;
                case ValidationException validationException:
                    errorResponse = ErrorResponseFactory.CreateBadRequestErrorResponse(validationException.Errors);
                    break;
                default:
                    _logger.LogError(exception, string.Empty);
                    var message = string.IsNullOrEmpty(exception.Message) ? "Processing error" : exception.Message;
                    errorResponse = ErrorResponseFactory.CreateBadRequestErrorResponse(message);
                    break;
            }

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)code;

            var result = JsonConvert.SerializeObject(errorResponse,
               new JsonSerializerSettings() { ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() } });

            return context.Response.WriteAsync(result);
        }
    }

    public static class ExceptionHandlingMiddlewareExtensions
    {
        public static IApplicationBuilder UseCustomExceptionHandlingMiddleware(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<ExceptionHandlingMiddleware>();
        }
    }
}
