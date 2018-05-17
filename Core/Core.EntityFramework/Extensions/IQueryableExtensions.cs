using System.Collections.Generic;
using System.Linq;
using System;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore.Internal;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Core.EntityFramework
{
    public static class IQueryableExtensions
    {
        public static IQueryable<T> SiralamayiAyarla<T>(this IQueryable<T> kaynak, string orderBy, Dictionary<string, PropertyMappingValue> mappingDictionary)
        {
            if (kaynak == null)
                throw new ArgumentNullException("kaynak boş olamaz");
            if (mappingDictionary == null)
                throw new ArgumentNullException("ALan harita listesi boş olamaz");
            if (string.IsNullOrWhiteSpace(orderBy))
                return kaynak;
            var orderByAfterSplit = orderBy.Split(',');
            foreach (var orderByClause in orderByAfterSplit)
            {
                var trimmedOrderByClause = orderByClause.Trim();
                var orderDescending = trimmedOrderByClause.EndsWith(" azalan");

                var indexOfFirstSpace = trimmedOrderByClause.IndexOf(" ");
                var propertyName = indexOfFirstSpace == -1 ? trimmedOrderByClause : trimmedOrderByClause.Remove(indexOfFirstSpace);

                if (!mappingDictionary.ContainsKey(propertyName))
                    throw new ArgumentException($"Key mapping for {propertyName} is missing");
                var propertyMappingValue = mappingDictionary[propertyName];
                if (propertyMappingValue == null)
                    throw new ArgumentException("Property mapping value");

                foreach (var destinationProperty in propertyMappingValue.DestinationProperties.Reverse())
                {
                    if (propertyMappingValue.Revert)
                        orderDescending = !orderDescending;
                    kaynak = kaynak.OrderBy(destinationProperty + (orderDescending ? " descending" : " ascending"));

                }
            }
            return kaynak;
        }
    }

}
