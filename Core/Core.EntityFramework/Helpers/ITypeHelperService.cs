namespace Core.EntityFramework
{
    public interface ITypeHelperService
    {
        bool TryHastProperties<T>(string fields);
    }
}
