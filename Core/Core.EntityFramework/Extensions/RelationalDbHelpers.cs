using Microsoft.EntityFrameworkCore;

namespace Core.EntityFramework
{
    public static class RelationalDbHelpers
    {
        public static string GetTableName<TEntity>(this DbContext dbContext) where TEntity:class
        {
            var entityName = typeof(TEntity).FullName;
            var entityType = dbContext.Model.FindEntityType(entityName); ;
            var mapping = entityType.Relational();
            return $"[{mapping.Schema}].[{mapping.TableName}]";
        }
    }
}
