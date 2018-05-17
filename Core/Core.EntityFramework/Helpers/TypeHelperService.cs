using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Threading.Tasks;

namespace Core.EntityFramework
{
    public class TypeHelperService : ITypeHelperService
    {
        public bool TryHastProperties<T>(string fields)
        {
            if (string.IsNullOrWhiteSpace(fields))
                return true;
            var fieldsAfterSplit = fields.Split(',');
            foreach (var field in fieldsAfterSplit)
            {
                var propertyName = field.Trim();
                var propertyInfo = typeof(T).GetProperty(propertyName, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);

                if (propertyInfo == null)
                    return false;
            }
            return true;
        }
    }

    public static class SeederService
    {
        public static async Task VeriEkle<TEntity>(DbContext db, string logBaslik, string dosyaYolu, bool canIdentityInsert = false) where TEntity : class
        {
            Console.WriteLine($"{logBaslik} ekleniyor...");
            try
            {
                if (!File.Exists(dosyaYolu)) return;

                var json = File.ReadAllText(dosyaYolu);
                var veriler = JsonConvert.DeserializeObject<IEnumerable<TEntity>>(json);

                string tableName = string.Empty;
                if (canIdentityInsert)
                    tableName = db.GetTableName<TEntity>();
                if (!string.IsNullOrWhiteSpace(tableName))
                    SetTablesIdentityInsert(db, new string[] { tableName }, true);
                db.Set<TEntity>().AddRange(veriler);
                await db.SaveChangesAsync();
                if (!string.IsNullOrWhiteSpace(tableName))
                    SetTablesIdentityInsert(db, new string[] { tableName }, false);
            }
            catch (Exception hata)
            {

            }
            finally
            {
                Console.WriteLine($"{logBaslik} eklendi.");
            }

        }

        public static void KompleksVeriEkle<TEntity>(DbContext db, string logBaslik, string dosyaYolu, params string[] tabloAdlari) where TEntity : class
        {
            Console.WriteLine($"{logBaslik} ekleniyor...");

            SetTablesIdentityInsert(db, tabloAdlari, true);
            var json = File.ReadAllText(dosyaYolu);
            var veriler = JsonConvert.DeserializeObject<IEnumerable<TEntity>>(json);

            db.Set<TEntity>().AddRange(veriler);
            db.SaveChanges();
            SetTablesIdentityInsert(db, tabloAdlari, false);

            Console.WriteLine($"{logBaslik} eklendi.");
        }

        private static void SetTablesIdentityInsert(DbContext db, string[] tabloAdlari, bool canIdentityInsert)
        {
            var aksiyonCumlesi = canIdentityInsert ? "ON" : "OFF";
            foreach (var tabloAdi in tabloAdlari)
            {
                try
                {
                    string sqlStr = $"SET IDENTITY_INSERT {tabloAdi} {aksiyonCumlesi}";
                    db.Database.ExecuteSqlCommand(sqlStr);
                }
                catch (Exception hata)
                {

                }
            }
        }


    }
}

