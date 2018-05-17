using System.Threading.Tasks;

namespace Core.Base
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string email, string subject, string message);
    }
}
