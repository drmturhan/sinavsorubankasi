using System.Collections.Generic;

namespace Core.EntityFramework
{
    public interface IPropertyMappingService
    {
        bool ValidMappingsExistsFor<TSource, TDestinatin>(string fields);
        void AddMap<TSource, TDestination>(Dictionary<string, PropertyMappingValue> mappingValues);
        Dictionary<string, PropertyMappingValue> GetPropertyMapping<TSource, TDestination>();
    }
}
