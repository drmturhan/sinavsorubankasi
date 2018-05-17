using System.Collections.Generic;

namespace Core.EntityFramework
{
    public class PropertyMapping<TSource, TDictionary> : IPropertyMapping
    {
        public Dictionary<string, PropertyMappingValue> mappingDictionary { get; private set; }
        public PropertyMapping(Dictionary<string, PropertyMappingValue> mappingDictionary)
        {
            this.mappingDictionary = mappingDictionary;
        }

    }
}
