using System.Threading.Tasks;

namespace Core.Base
{
    public interface ISmsSender
    {
        Task SendSmsAsync(string number, string message);
    }
}
