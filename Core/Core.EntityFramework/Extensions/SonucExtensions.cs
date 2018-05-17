using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Reflection;

namespace Core.EntityFramework
{
    public static class SonucExtensions
    {
        public static ListeSonuc<TSource> ShapeData<TSource>(
            this ListeSonuc<TSource> source,
                string fields = null)
        {
            if (source == null)
                throw new ArgumentException("kaynak boş olamaz!");
            var expandoObjectList = new List<ExpandoObject>();

            var propertyInfoList = new List<PropertyInfo>();
            if (string.IsNullOrWhiteSpace(fields))
            {
                return source;
                //var propertyInfos = typeof(TSource).GetProperties(BindingFlags.Public | BindingFlags.Instance);
                //propertyInfoList.AddRange(propertyInfos);
            }
            else
            {
                var fieldsAfterSplit = fields.Split(',');
                foreach (var field in fieldsAfterSplit)
                {
                    var propertyName = field.Trim();
                    var propertyInfo = typeof(TSource).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                    if (propertyInfo == null)
                        throw new Exception($"Proeprty {propertyName} wasn't found on {typeof(TSource)}.");
                    propertyInfoList.Add(propertyInfo);
                }
            }
            foreach (TSource sourceObject in source.DonenListe)
            {
                var dataShapedObject = new ExpandoObject();

                foreach (var propertyInfo in propertyInfoList)
                {
                    var propertyValue = propertyInfo.GetValue(sourceObject);
                    dataShapedObject.TryAdd(propertyInfo.Name, propertyValue);
                }
                expandoObjectList.Add(dataShapedObject);
            }
            source.DonenSekillenmisListe = expandoObjectList;
            source.DonenListe = null;
            return source;
        }
        public static KayitSonuc<TSource> ShapeData<TSource>(this KayitSonuc<TSource> source, string fields=null)
        {
            if (source == null)
                throw new ArgumentNullException("kaynak boş olamaz1");
            var dataShapedObject = new ExpandoObject();
            if (string.IsNullOrWhiteSpace(fields))
            {
                return source;
            }
            var propertyInfoList = new List<PropertyInfo>();
            var fieldsAfterSplit = fields.Split(',');
            foreach (var field in fieldsAfterSplit)
            {
                var propertyName = field.Trim();
                var propertyInfo = typeof(TSource).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
                if (propertyInfo == null)
                    throw new Exception($"Proeprty {propertyName} wasn't found on {typeof(TSource)}.");
                propertyInfoList.Add(propertyInfo);
            }

            foreach (var propertyInfo in propertyInfoList)
            {
                var propertyValue = propertyInfo.GetValue(source.DonenNesne);
                dataShapedObject.TryAdd(propertyInfo.Name, propertyValue);
            }
            source.DonenNesne = default(TSource);
            source.DonenSekillenmisNesne = dataShapedObject;
            return source;
        }
    }
}
