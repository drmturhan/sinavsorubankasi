namespace Core.Base
{
    public class UpperInvariantLookupNormalizer : ILookupNormalizer
    {
        public virtual string Normalize(string key)
        {
            if (key == null)
            {
                return null;
            }
            return key.Normalize().ToUpperInvariant();
        }
    }
}
