﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading;
using System.Threading.Tasks;
using WebApi.Common.Exceptions;

namespace WebApi.Persistence
{
    public static class EntityFrameworkExtensions
    {
        public static async Task<TEntity> SingleOrNotFoundAsync<TEntity>(this IQueryable<TEntity> query, Expression<Func<TEntity, bool>> predicate, CancellationToken cancellationToken = default)
        {
            var entity = await query.SingleOrDefaultAsync(predicate, cancellationToken);
            return entity ?? throw new NotFoundException($"{typeof(TEntity).Name} not found.");
        }

        public static async ValueTask<TEntity> FindOrNotFoundAsync<TEntity>(this DbSet<TEntity> dbSet, CancellationToken cancellationToken, params object[] keyValues) where TEntity : class
        {
            return await dbSet.FindAsync(keyValues, cancellationToken) ?? throw new NotFoundException($"{typeof(TEntity).Name} with keyValues: {{{string.Join(',', keyValues)}}} not found.");
        }
    }
}
