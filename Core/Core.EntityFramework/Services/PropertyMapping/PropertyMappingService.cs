using System;
using System.Collections.Generic;
using System.Linq;

namespace Core.EntityFramework
{

    public class PropertyMappingService : IPropertyMappingService
    {


        protected IList<IPropertyMapping> propertyMappings = new List<IPropertyMapping>();
        public PropertyMappingService()
        {

        }
        public void AddMap<TSource, TDestination>(Dictionary<string, PropertyMappingValue> mappingValues)
        {
            var mathingMapping = propertyMappings.OfType<PropertyMapping<TSource, TDestination>>();
            if (mathingMapping.Count() == 0)
                propertyMappings.Add(new PropertyMapping<TSource, TDestination>(mappingValues));
        }

        public Dictionary<string, PropertyMappingValue> GetPropertyMapping<TSource, TDestination>()
        {
            var mathingMapping = propertyMappings.OfType<PropertyMapping<TSource, TDestination>>();
            if (mathingMapping.Count() == 1)
            {
                return mathingMapping.First().mappingDictionary;
            }
            throw new Exception($"Cannot find exact property mapping instance for<{typeof(TSource)}>");
        }
        public bool ValidMappingsExistsFor<TSource, TDestinatin>(string fields)
        {
            var propertyMappig = GetPropertyMapping<TSource, TDestinatin>();
            if (string.IsNullOrWhiteSpace(fields))
                return true;
            var fieldAfterSplit = fields.Split(',');
            foreach (var field in fieldAfterSplit)
            {
                var trimmedField = field.Trim();
                var indexOfFirstSpace = trimmedField.IndexOf(" ");
                var propertyName = indexOfFirstSpace == -1 ? trimmedField : trimmedField.Remove(indexOfFirstSpace);
                if (!propertyMappig.ContainsKey(propertyName))
                    return false;
            }
            return true;
        }
    }
}
